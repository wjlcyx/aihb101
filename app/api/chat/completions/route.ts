import { ChatStatus, ChatStreamEvent } from "@/services/constant";

import {  Message } from "@/types/message";
import { chatCompletions } from "@/services/chat";
import { default_model } from "@/services/model";
import { getIsoTimestr } from "@/lib/time";
import { getUserUuid } from "@/services/user";
import { respErr } from "@/lib/resp";

export const runtime = "edge";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const customReadable = new ReadableStream({
      start: await handle(req),
    });

    return new Response(customReadable, {
      headers: {
        'Connection': 'keep-alive',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache, no-transform',
        'Content-Type': 'text/event-stream; charset=utf-8',
      },
    });
  } catch (e: any) {
    console.log("chat failed:", e);
    return respErr(e.message);
  }
}

async function handle(req: Request) {
  let { user_msg, assistant_msg } = await req.json();

  if (
    !user_msg ||
    !user_msg.chat_uuid ||
    !user_msg.uuid ||
    !user_msg.content ||
    !assistant_msg ||
    !assistant_msg.uuid
  ) {
    throw new Error("invalid params");
  }

  if (!user_msg.model) {
    user_msg.model = default_model;
  }
  if (!user_msg.locale) {
    user_msg.locale = "zh";
  }

  const user_uuid = await getUserUuid();

  let ctx_msgs: Message[] = [];

  const chat_uuid = user_msg.chat_uuid;

  let chat = null;
  if (!chat) {
    chat = {
      uuid: chat_uuid,
      user_uuid: user_uuid,
      title: user_msg.content,
      created_at: getIsoTimestr(),
      status: ChatStatus.Created,
    };
    // await insertChat(chat);
  } else {
    ctx_msgs = [];
  }

  console.log("context messages: ", ctx_msgs);

  return async function start(
    controller: ReadableStreamDefaultController<any>
  ) {
    try {
      sendData(
        controller,
        formatMetadata(ChatStreamEvent.ConversationStart, {
          chat: chat,
        })
      );

      // await insertMessage(user_msg);

      // chat with llm
      sendData(controller, formatMetadata(ChatStreamEvent.ChatStart, {}));

      const reply_msg = await requestChat({
        user_msg,
        assistant_msg,
        ctx_msgs,
        controller,
      });

      console.log("chat reply msg: ", reply_msg);
      if (reply_msg.content) {
        reply_msg.created_at = getIsoTimestr();
        // await insertMessage(reply_msg);
      }

      sendData(controller, formatMetadata(ChatStreamEvent.ConversationEnd, {}));

      controller.close();
    } catch (e: any) {
      console.log("chat failed: ", e);
      sendData(controller, {
        object: "stream.event",
        step: ChatStreamEvent.ConversationError,
        choices: [],
        metadata: {},
        error: e.message,
      });
      controller.close();
    }
  };
}

async function requestChat({
  user_msg,
  assistant_msg,
  ctx_msgs,
  controller,
}: {
  user_msg: Message;
  assistant_msg: Message;
  ctx_msgs: Message[];
  controller: ReadableStreamDefaultController<any>;
}) {
  const ragRes = await chatCompletions({
    query: user_msg.content,
    locale: user_msg.locale || "zh",
    model: user_msg.model || default_model,
    messages: ctx_msgs.reverse().map((msg) => {
      return {
        role: msg.role,
        content: msg.content,
      };
    }),
  });

  let reply = "";
  const openTagRegex = /<cocoder(.+?)>/g;
  const closeTagRegex = /<\/cocoder>/g;

  for await (const part of ragRes) {
    if (part.choices.length === 0 || part.choices[0].finish_reason === "stop") {
      continue;
    }
    const content = part.choices[0].delta?.content || "";
    reply += content;

     //准备发送给��户端的内容
    let sendContent = reply;

    //检查并确保最后一个开放标签被闭合
    const openTags = Array.from(sendContent.matchAll(openTagRegex));
    const closeTags = Array.from(sendContent.matchAll(closeTagRegex));

    if (openTags.length > closeTags.length) {
      const lastOpenTagIndex = openTags[openTags.length - 1].index;
      const tempReply = sendContent.slice(lastOpenTagIndex);
      if (tempReply.includes("</cocoder>")) {
        sendContent += "</cocoder>";
      }
    }


    assistant_msg.content = sendContent;

    sendData(
      controller,
      formatMetadata(ChatStreamEvent.ChatResult, {
        assistant_msg: assistant_msg,
      })
    );
  }

  return assistant_msg;
}

function formatMetadata(step: number, metadata: any): any {
  return {
    object: 'stream.event',
    step: step,
    choices: [],
    metadata: metadata,
  };
}

function sendData(controller: ReadableStreamDefaultController<any>, data: any) {
  const encoder = new TextEncoder();

  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

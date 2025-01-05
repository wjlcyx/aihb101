"use client";

import { ChatStreamEvent } from "@/services/constant";
import { Message } from "@/types/message";
import { getClientInfo } from "@/lib/browser";
import { useState } from "react";

export default function () {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>({});
  const [steps, setSteps] = useState<any[]>([]);

  const chat = async ({
    user_msg,
    assistant_msg,
  }: {
    user_msg: Message;
    assistant_msg: Message;
  }) => {
    try {
      if (
        !user_msg ||
        !user_msg.chat_uuid ||
        !user_msg.content ||
        !assistant_msg ||
        !assistant_msg.chat_uuid ||
        !assistant_msg.uuid
      ) {
        throw new Error("invalid params");
      }

      const { device_id, user_agent } = await getClientInfo();

      setProcessing(true);

      const req = {
        user_msg,
        assistant_msg,
        device_id,
        user_agent,
        req_from: "web",
      };

      console.log("chat request:", req);
      const resp = await fetch("/api/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      if (!resp.ok) {
        throw new Error("chat failed with status: " + resp.status);
      }

      if (resp.headers.get("Content-Type")?.startsWith("application/json")) {
        const { message } = await resp.json();
        throw new Error(message);
      }

      if (!resp.body) {
        throw new Error("chat failed with invalid response");
      }

      const reader = resp.body.getReader();
      readStream(reader);
    } catch (e: any) {
      console.log("chat failed:", e);
      setError(e);
      setProcessing(false);
    }
  };

  const readStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>
  ) => {
    try {
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("chat stream read done");
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split("\n");
        for (let i = 0; i < lines.length - 1; i++) {
          if (lines[i].startsWith("data: ")) {
            const text = lines[i].substring(6);
            parseData(text);
          }
        }

        buffer = lines[lines.length - 1];
      }

      setProcessing(false);
    } catch (e) {
      console.log("read stream failed: ", e);
      throw e;
    }
  };

  return {
    chat,
    processing,
    error,
    result,
    steps
  };
}

function parseData(text: string) {
    throw new Error("Function not implemented.");
}

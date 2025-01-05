import { ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { chatPrompt } from "./prompts/chat";
import { default_model } from "./model";
import { getOpenAIClient } from "./llms/openai";

export async function chatCompletions({
  query,
  locale,
  search_results,
  context,
  model,
  messages,
}: {
  query: string;
  locale?: string;
  search_results?: string;
  context?: string;
  model?: string;
  messages?: any[];
}): Promise<any | undefined> {
  try {
    const client = getOpenAIClient(model);

    const params: ChatCompletionCreateParams = {
      model: model || default_model,
      stream: true,
      messages: [
        {
          role: "system",
          content: chatPrompt
            .replace("{query}", query)
            .replace("{search_results}", search_results || "")
            .replace("{context}", context || "")
            .replaceAll("{locale}", locale || ""),
        },
      ],
      temperature: 0.5,
    };

    if (messages && messages.length > 0) {
      params.messages.push(...messages);
    }

    params.messages.push({
      role: "user",
      content: query,
    }); 
    
    console.log("chat completions request:", params);

    const response = await client.chat.completions.create(params);

    return response;
  } catch (err) {
    console.log("chat completions failed:", err);
    throw err;
  }
}

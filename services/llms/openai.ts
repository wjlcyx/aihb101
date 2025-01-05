import OpenAI, { ClientOptions } from "openai";

export function getOpenAIClient(model?: string): OpenAI {
  const options: ClientOptions = {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  };

  const openai = new OpenAI(options);

  return openai;
}
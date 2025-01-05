import { NextRequest } from "next/server";
import { respData } from '@/lib/resp';
import { getOpenAIClient } from "@/services/llms/openai";

export async function POST(request: NextRequest) {
    const { message } = await request.json();

    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct",
        messages: [{ role: "user", content:  message }],
    });

    const reply = response.choices[0].message.content;

    return respData({
        reply: reply,
    });
}
import OpenAI from 'openai';

export function getOpenAIClient(): OpenAI {
    const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
        baseURL: 'https://apitb.gueai.com/',
        });

    return openai;
}

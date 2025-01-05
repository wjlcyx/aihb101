import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import OSS from 'ali-oss';
import { insertWallpaper } from '@/models/gethb';
import { Wallpaper } from '@/types/aihb';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.log('错误：未找到 API Key');
    return NextResponse.json({
      code: 200,
      message: "请先配置 API Key",
      data: null
    }, { status: 401 });
  }

  const { prompt } = await req.json();
  console.log("用户输入的描述:", prompt);

  try {
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://apitb.gueai.com/v1'
    });


    const img_size = "1024x1792";
    const llm_name = "flux-pro";
    const created_at = new Date().toISOString();
    const result = await client.images.generate({
      prompt: `:${prompt}`,
      model: llm_name,
      n: 1,
      quality: "hd",
      response_format: "url",
      size: img_size,

    });

    console.log("API 返回结果:", JSON.stringify(result, null, 2));

    const raw_img_url = result.data[0].url;

    // 添加 URL 检查
    if (!raw_img_url) {
      throw new Error("生成的图片URL为空");
    }

    // 初始化 OSS 客户端
    const ossClient = new OSS({
      region: process.env.OSS_REGION!,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
      bucket: process.env.OSS_BUCKET!
    });

    // 添加生成唯一文件名的函数
    const generateUniqueFileName = (prompt: string | undefined) => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const sanitizedPrompt = prompt 
        ? prompt.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)
        : 'untitled';
      return `wallpapers/${timestamp}-${randomStr}-${sanitizedPrompt}.jpg`;
    };

    try {
      // 下载图片
      const response = await fetch(raw_img_url);
      const buffer = await response.arrayBuffer();

      const fileName = generateUniqueFileName(prompt);
      const ossResult = await ossClient.put(fileName, Buffer.from(buffer));

      const wallpaper: Wallpaper = {
        img_description: prompt,
        img_size: img_size,
        img_url: ossResult.url,
        llm_name: llm_name,
        created_at: created_at,
      };
      await insertWallpaper(wallpaper);

      return NextResponse.json({
        img_url: ossResult.url 
      });

    } catch (ossError) {
      console.error('OSS上传失败，返回原始URL:', ossError);
      // OSS 上传失败时返回原始 URL
      return NextResponse.json({
        img_url: raw_img_url
      });
    }

  } catch (error) {
    console.error('生成图片失败:', error);
    return NextResponse.json({
      error: {
        message: error instanceof Error ? error.message : "生成图片失败",
        type: "api_error",
        code: 500
      }
    }, { status: 500 });
  }
}

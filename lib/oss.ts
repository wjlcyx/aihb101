import OSS from 'ali-oss';
import { Readable } from "stream";
import axios from "axios";
import fs from "fs";

// 创建 OSS 客户端
const client = new OSS({
  region: process.env.OSS_REGION!,
  accessKeyId: process.env.OSS_AK!,
  accessKeySecret: process.env.OSS_SK!,
  bucket: process.env.OSS_BUCKET!
});

/**
 * 下载并上传图片到 OSS
 * @param imageUrl 图片URL
 * @param bucketName 存储桶名称
 * @param ossKey OSS中的文件路径
 */
export async function downloadAndUploadImage(
  imageUrl: string,
  bucketName: string,
  ossKey: string
) {
  try {
    const response = await axios({
      method: "GET",
      url: imageUrl,
      responseType: "stream",
    });

    // 确保使用正确的 bucket
    client.useBucket(bucketName);

    // 上传到 OSS
    return await client.putStream(ossKey, response.data as Readable);
  } catch (e) {
    console.log("上传失败:", e);
    throw e;
  }
}

/**
 * 下载图片到本地
 * @param imageUrl 图片URL
 * @param outputPath 本地输出路径
 */
export async function downloadImage(imageUrl: string, outputPath: string) {
  try {
    const response = await axios({
      method: "GET",
      url: imageUrl,
      responseType: "stream",
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      let error: Error | null = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });

      writer.on("close", () => {
        if (!error) {
          resolve(null);
        }
      });
    });
  } catch (e) {
    console.log("下载失败:", e);
    throw e;
  }
}

// 额外提供一些实用的 OSS 操作函数
export async function getSignedUrl(objectKey: string, expires: number = 3600) {
  try {
    return await client.signatureUrl(objectKey, { expires });
  } catch (e) {
    console.log("获取签名URL失败:", e);
    throw e;
  }
}

export async function deleteObject(objectKey: string) {
  try {
    return await client.delete(objectKey);
  } catch (e) {
    console.log("删除文件失败:", e);
    throw e;
  }
}

import { Wallpaper } from "@/types/aihb";
import { getDb } from "./db";

export async function insertWallpaper(wallpaper: Wallpaper) {
  const db = getDb();
  
  // 确保 created_at 是正确的 MySQL datetime 格式
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  const [res] = await db.execute(
    `INSERT INTO wallpapers 
          (img_description, img_size, img_url, llm_name, created_at) 
          VALUES 
          (?, ?, ?, ?, ?)`,
    [
      wallpaper.img_description,
      wallpaper.img_size,
      wallpaper.img_url,
      wallpaper.llm_name,
      created_at,  // 使用格式化后的时间
    ]
  );

  return res;
}


export async function getWallpapers(
  page: number = 1,
  limit: number = 6
): Promise<Wallpaper[]> {
  // 确保参数有效
  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.max(1, Math.min(Number(limit), 50)); // 限制最大查询数量
  const safeOffset = (safePage - 1) * safeLimit;

  const db = getDb();
  try {
    // 使用 query 而不是 execute，因为 mysql2 在处理 LIMIT/OFFSET 时可能有问题
    const [rows] = await db.query(
      'SELECT * FROM wallpapers ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [safeLimit, safeOffset]
    );

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return [];
    }

    return (rows as any[]).map((row) => ({
      id: row.id,
      img_description: row.img_description,
      img_size: row.img_size,
      img_url: row.img_url,
      llm_name: row.llm_name,
      created_at: row.created_at,
    }));

  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to fetch wallpapers');
  }
}
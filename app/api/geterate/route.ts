import { NextRequest, NextResponse } from 'next/server';
import { getWallpapers } from '@/models/gethb';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 6;
    
    const offset = (page - 1) * limit;
    const wallpapers = await getWallpapers(page, limit);
    
    return NextResponse.json({
      code: 0,
      message: 'success',
      data: wallpapers,
      pagination: {
        page,
        limit,
        total: wallpapers.length
      }
    });
  } catch (error) {
    console.error('获取壁纸失败:', error);
    return NextResponse.json({
      code: -1,
      message: '获取壁纸失败',
      data: []
    }, { status: 500 });
  }
}
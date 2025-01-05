'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Wallpaper } from "@/types/aihb"

interface PreviewPanelProps {
  images: string[]
}

export default function PreviewPanel({ images }: PreviewPanelProps) {
  const [localImages, setLocalImages] = useState<Wallpaper[]>([]);
  const [open, setOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化时从服务器获取图片
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/geterate');
        const data = await response.json();
        if (data.code === 0 && Array.isArray(data.data)) {
          setLocalImages(data.data);
          // 如果有数据，自动打开预览面板
          if (data.data.length > 0 && !isInitialized) {
            setOpen(true);
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error('获取图片失败:', error);
      }
    }
    fetchImages();
  }, [isInitialized]);

  // 当新图片通过props传入时，更新本地状态
  useEffect(() => {
    if (images.length > 0) {
      const newWallpapers = images.map(url => ({
        id: Date.now(),
        img_description: '',
        img_size: '',
        img_url: url,
        llm_name: '',
        created_at: new Date().toISOString()
      }));
      setLocalImages(prev => {
        const combined = [...newWallpapers, ...prev];
        // 去重，避免重复显示相同的图片
        return combined.filter((wallpaper, index, self) =>
          index === self.findIndex((w) => w.img_url === wallpaper.img_url)
        );
      });
      setOpen(true);
    }
  }, [images]);

  // 监听 localImages 变化，打印日志用于调试
  useEffect(() => {
    console.log('当前图片列表:', localImages);
  }, [localImages]);

  const downloadImage = async (imageUrl: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(imageUrl)}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `red-envelope-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请稍后重试。');
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg">
          预览 ({localImages.length})
        </button>
      </SheetTrigger>
      <SheetContent 
        className="w-[400px] sm:w-[540px] bg-white/40"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#ff00fa]/5 blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-[#ffdf26]/5 blur-2xl" />
          <div className="absolute bottom-1/4 left-1/3 w-36 h-36 rounded-full bg-[#f7007e]/5 blur-2xl" />
          <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-[#f95e1b]/5 blur-2xl" />
          <div className="absolute bottom-1/3 right-1/4 w-28 h-28 rounded-full bg-[#fd19fb]/5 blur-2xl" />
        </div>

        <SheetHeader>
          <SheetTitle>
            <div className="relative z-10 text-2xl font-bold group">
              <span className="relative inline-block group-hover:animate-pulse">
                <span className="relative tracking-[0.23em] bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-400 to-yellow-500">
                  红包封面
                </span>
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)] mt-4">
          <div className="space-y-6 pr-4">
            {localImages.map((wallpaper, index) => (
              <div
                key={`${wallpaper.id}-${index}`}
                className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#E95040] to-[#E95040] rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-[80%] bg-white rounded-t-3xl overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={wallpaper.img_url}
                      alt={`Generated image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[20%] flex items-center justify-center">
                  <button
                    onClick={() => downloadImage(wallpaper.img_url)}
                    className="w-16 h-16 rounded-full bg-[#FDD37D] hover:bg-[#FDD37D] 
                             flex items-center justify-center text-[#E95040] font-bold text-2xl
                             shadow-lg transform transition hover:scale-105 hover:rotate-3
                             -translate-y-8"
                  >
                    存
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}


"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { toast } from "sonner";
import PreviewPanel from '@/components/preview-panel';
import { useGuard } from '@authing/guard-react18';
import RedPacketContainer from "./RedPacketContainer";
import DemoQueries from "../demoQueries";
import { useChatContext } from "@/contexts/chat";

const MAX_DAILY_GENERATIONS = 6;  // 每日最大生成次数

export default function Input() {
  const guard = useGuard()
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [dailyCount, setDailyCount] = useState(0);
  const { setChat } = useChatContext();

  // 检查并更新每日生成次数
  useEffect(() => {
    const checkDailyLimit = () => {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem('lastGenerateDate');
      const storedCount = localStorage.getItem('dailyGenerateCount');

      if (storedDate !== today) {
        // 新的一天，重置计数
        localStorage.setItem('lastGenerateDate', today);
        localStorage.setItem('dailyGenerateCount', '0');
        setDailyCount(0);
      } else {
        // 同一天，读取已有计数
        setDailyCount(Number(storedCount || 0));
      }
    };

    checkDailyLimit();
  }, []);

  const updateDailyCount = () => {
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    localStorage.setItem('dailyGenerateCount', newCount.toString());
  };

  const checkLogin = async () => {
    try {
      const loginStatus = await guard.checkLoginStatus();
      if (!loginStatus) {
        toast.info("请先登录");
        setTimeout(() => {
          guard.startWithRedirect({
            state: 'some-random-string'
          });
        }, 1000);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Login check error:', error);
      toast.error("登录检查失败");
      return false;
    }
  };

  const handleInputKeydown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (!e.nativeEvent.isComposing && query.trim()) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (query.trim() === "") {
      toast.error("请输入描述文字");
      return;
    }
    
    if (loading) {
      return;
    }

    // 检查每日生成次数限制
    if (dailyCount >= MAX_DAILY_GENERATIONS) {
      toast.error(`今日生成次数已用完，每天最多可生成 ${MAX_DAILY_GENERATIONS} 张图片`);
      return;
    }

    if (!await checkLogin()) {
      return;
    }
    
    setLoading(true);
    toast.loading("正在生成图片...");

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("API返回结果：", result);
      
      if (result.img_url) {
        setImages(prev => [...prev, result.img_url]);
        updateDailyCount();  // 更新生成次数
        toast.success(`图片生成成功！今日剩余次数：${MAX_DAILY_GENERATIONS - dailyCount - 1}`);
      } else {
        toast.error("生成图片失败：未获取到图片URL");
      }
    } catch (error) {
      console.error('Generate image error:', error);
      toast.error("生成图片失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RedPacketContainer
        query={query}
        setQuery={setQuery}
        loading={loading}
        handleSubmit={handleSubmit}
        handleInputKeydown={handleInputKeydown}
      />
      <PreviewPanel images={images} />
      <div className="text-sm text-gray-500 mt-2 mb-4">
        今日剩余生成次数：{MAX_DAILY_GENERATIONS - dailyCount} 次
      </div>
      <DemoQueries onClick={(query) => setQuery(query)} loading={loading} />
    </>
  );
}
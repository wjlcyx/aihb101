import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";

interface RedPacketProps {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  handleSubmit: () => void;
  handleInputKeydown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function RedPacketContainer({
  query,
  setQuery,
  loading,
  handleSubmit,
  handleInputKeydown,
}: RedPacketProps) {
  return (
    <div className="relative w-full max-w-[350px] mx-auto">
      <style>{`
        @keyframes coin-flip {
          0% {
            transform: rotateY(0);
          }
          100% {
            transform: rotateY(1800deg);
          }
        }
        
        .animate-coin-flip {
          animation: coin-flip 2.5s linear infinite;
          transform-style: preserve-3d;
          backface-visibility: visible;
        }
      `}</style>

      <div className="relative bg-white/50 rounded-2xl overflow-hidden" style={{ aspectRatio: '957/1278' }}>
        {/* 输入区域保持不变 */}
        <div className="relative w-full h-[70%] flex flex-col justify-center items-center p-6 bg-white/50 space-y-4 z-10">
          <div className="w-full max-w-4xl">
            <div className="w-full relative overflow-hidden rounded-lg border bg-white/40 backdrop-blur-md focus-within:ring-1 focus-within:ring-[#df88c2]">
              <Textarea
                placeholder="输入要生成红包封面的描述"
                className="min-h-[55px] max-h-[250px] w-full resize-none border-0 p-3 shadow-none focus-visible:ring-0 bg-transparent text-gray-800 placeholder:text-gray-500 text-sm overflow-auto"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // 自动调整高度
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={handleInputKeydown}
                enterKeyHint="send"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* 红包底部区域 */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#E95040] h-[30%] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-16 before:bg-white/85 before:rounded-b-[100%]">
          {/* 外层容器添加 perspective */}
          <div className="absolute left-1/2 top-8 -translate-x-1/2" style={{ perspective: '1000px' }}>
            {/* 将动画类移到这个div上 */}
            <div className={`
              w-16 h-16 rounded-full shadow-lg
              ${loading ? 'animate-coin-flip' : 'hover:scale-105 transition-transform duration-300'}
            `}>
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className="
                  bg-[#FDD37D] hover:bg-[#FDD37D] text-[#E95040] 
                  px-4 py-1 text-base rounded-full w-full h-full 
                  flex items-center justify-center border-0
                "
              >
                開
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
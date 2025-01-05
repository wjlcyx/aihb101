export default function DemoQueries({
  onClick,
  loading,
}: {
  onClick: (query: string) => void;
  loading: boolean;
}) {
  const queries = [
    "绚丽烟花，夜空绽放，五彩斑斓，光影交织，浪漫氛围",
    "绚烂虹彩，黑暗环境",
    "颗粒感故障的正面照片，光线洒落在亚洲女孩脸上，90年代Y2K风格的梦幻柔焦镜头光晕",
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      {queries.map((query) => (
        <div
          key={query}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
          onClick={() => {
            if (!loading) {
              onClick(query);
            }
          }}
        >
          {query}
        </div>
      ))}
    </div>
  );
}

import Input from "./input";


export default function ChatHome() {
  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-8 text-white">
        新年快乐，好运连连
        </h1>
        <Input />
      </div>
    </div>
  );
}
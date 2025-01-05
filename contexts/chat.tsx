import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useContext, useState } from "react";
import { Chat } from "@/types/chat";
import { Message } from "@/types/message";

const ChatContext = createContext({} as ContextProviderValue);
export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({ children }: ContextProviderProps) => {
  // 管理聊天列表状态
  const [chats, setChats] = useState<Chat[] | null>(null);
  // 管理当前选中的聊天
  const [chat, setChat] = useState<Chat | null>(null);
  // 管理消息列表
  const [messages, setMessages] = useState<Message[] | null>(null);
  // 管理当前消息
  const [message, setMessage] = useState<Message | null>(null);

  // 获取聊天列表
  const fetchChats = async ({
    page,
    limit = 50,
  }: {
    page: number;
    limit?: number;
  }) => {
    try {
      const resp = await fetch("/api/get-user-chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, limit }),
      });

      if (!resp.ok) {
        throw new Error(`fetch chats failed with status: ${resp.status}`);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message);
      }

      setChats(data);
    } catch (e) {
      console.log("fetch chats failed");
    }
  };

  // 提供上下文值
  const contextValue = {
    chats,
    setChats,
    chat,
    setChat,
    messages,
    setMessages,
    message,
    setMessage,
    fetchChats,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

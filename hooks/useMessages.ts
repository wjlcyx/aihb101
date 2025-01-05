import { useState, useCallback } from 'react';
import type { Message } from '../types/message';
import { Chat } from '../types/chat';

export function useMessages() {
    const [messages, setMessages] = useState<Message[] | null>(null);

    const appendMessage = useCallback((role: Message['role'], content: string) => {
        const newMessage: Message = { 
            role, 
            content, 
            uuid: crypto.randomUUID(),
            chat_uuid: '', 
            created_at: new Date().toISOString(),
            status: 'done'
        };
        setMessages((prevMessages) => prevMessages ? [...prevMessages, newMessage] : [newMessage]);
        return newMessage;
    }, []);

    const replaceMessage = useCallback((uuid: string, content: string) => {
        setMessages((prevMessages) => {
            if (!prevMessages) return [];  // 如果是 null，返回空数组
            return prevMessages.map((msg) => 
                msg.uuid === uuid ? { ...msg, content } : msg
            );
        });
    }, []);

    const clearMessages = useCallback(() => {
        setMessages(null);  // 保持使用 null 作为清空值
    }, []);

    return {
        messages,
        appendMessage,
        replaceMessage,
        clearMessages
    };
}
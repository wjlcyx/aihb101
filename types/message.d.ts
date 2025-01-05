export interface Message {
    uuid: string;
    chat_uuid: string;
    created_at: string;
    status: string;
    role: string;
    content: string;
    target_msg_uuid?: string;
    model?: string;
    locale?: string;
}

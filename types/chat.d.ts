export interface Chat {
    uuid: string;
    created_at: string; 
    status: string;
    user_uuid?: string;
    title?: string;
    last_message?: string;
    updated_at?: string;
}


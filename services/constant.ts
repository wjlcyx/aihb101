export enum ChatStreamEvent {
    ConversationStart = 1,
    ChatStart,
    ChatResult,
    ConversationEnd,
    ConversationError,
}

export enum ChatStatus {
    New = "new",
    Pending = "pending",
    Created = "created",
    Deleted = "deleted",
}


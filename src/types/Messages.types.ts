export interface Message {
    messageId: string;
    messagesArrayID: string;
    text: string;
    senderId: string;
    receiverId: string[];
    reactions: string[];
    repliedMessageId: string[];
    repliedMessage: string[];
    translations: {
        igbo?: string[];
        hausa?: string[];
        yoruba?: string[];
        pidgin?: string[];
        latin?: string[];
        spanish?: string[];
        french?: string[];
        english?: string[];
    };
    reactionTrue: boolean;
    editingTrue: boolean;
    deleteTrue: boolean;
    replyTrue: boolean;
    createdAt: string;
}

export interface MessagesState {
    messages: Message[];
    loading: boolean;
    error: string | null;
}
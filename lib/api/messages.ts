import { safeJsonFetch } from "../http";
import { conversationItemSchema, messageSchema } from "../schemas";

export type Message = {
  id: number;
  content: string;
  dateSent: string;
  senderId: number;
  receiverId: number;
};

export type ConversationItem = { userId: number; lastMessage: Message };

export async function listConversations(token: string) {
  return safeJsonFetch<ConversationItem[]>(`/api/v1/messages/conversations`, { token, schema: conversationItemSchema.array() });
}

export async function getConversation(token: string, otherUserId: number) {
  return safeJsonFetch<Message[]>(`/api/v1/messages/conversation/${otherUserId}`, { token, schema: messageSchema.array() });
}

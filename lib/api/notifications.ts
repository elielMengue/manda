import { safeJsonFetch } from "../http";
import { notificationSchema } from "../schemas";

export type Notification = {
  id: number;
  title: string;
  content: string;
  dateCreated: string;
  isRead: boolean;
};

export async function listMyNotifications(token: string) {
  return safeJsonFetch<Notification[]>(`/api/v1/notifications`, { token, schema: notificationSchema.array() });
}

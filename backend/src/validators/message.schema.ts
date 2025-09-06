import { z } from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.number().int().positive(),
  content: z.string().min(1),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;


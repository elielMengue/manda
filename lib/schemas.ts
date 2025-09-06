import { z } from "zod";

export const moduleSchema = z.object({
  id: z.number(),
  titre: z.string(),
  description: z.string(),
  ordre: z.number(),
  duree: z.number(),
  coursId: z.number(),
});

export const coursSchema = z.object({
  id: z.number(),
  titre: z.string(),
  description: z.string(),
  duree: z.number(),
  status: z.string(),
  imageUrl: z.string(),
  createdAt: z.string(),
  mentorId: z.number(),
  modules: z.array(moduleSchema).optional(),
});

export function paginated<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  });
}

export const lessonSchema = z.object({
  id: z.number(),
  titre: z.string(),
  textContenu: z.string(),
  duree: z.number(),
  type: z.string(),
  ordre: z.number(),
  videoUrl: z.string(),
  moduleId: z.number(),
});

export const quizOptionSchema = z.object({
  id: z.number(),
  optionText: z.string(),
  isCorrect: z.boolean().optional(),
});

export const quizQuestionSchema = z.object({
  id: z.number(),
  questionText: z.string(),
  ordre: z.number(),
  points: z.number().optional(),
  typeQuestion: z.string(),
  options: z.array(quizOptionSchema),
});

export const quizSchema = z.object({
  id: z.number(),
  titre: z.string(),
  description: z.string(),
  dureeMax: z.number(),
  nombreTentatives: z.number(),
  scoreMinReussite: z.number(),
  type: z.string(),
  moduleId: z.number(),
  questions: z.array(quizQuestionSchema),
});

export const quizSummarySchema = quizSchema.omit({ questions: true });

export const quizSubmitResultSchema = z.object({ attemptId: z.number(), score: z.number() });

export const inscriptionSchema = z.object({
  id: z.number(),
  apprenantId: z.number(),
  coursId: z.number(),
  status: z.string(),
  inscriptionDate: z.string(),
  dateFin: z.string(),
  progression: z.number(),
  cours: z.object({ id: z.number(), titre: z.string(), imageUrl: z.string(), description: z.string() }),
});

export const notificationSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  dateCreated: z.string(),
  isRead: z.boolean(),
});

export const messageSchema = z.object({
  id: z.number(),
  content: z.string(),
  dateSent: z.string(),
  senderId: z.number(),
  receiverId: z.number(),
});

export const conversationItemSchema = z.object({
  userId: z.number(),
  lastMessage: messageSchema,
});

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  address: z.string(),
  phone: z.string(),
  status: z.boolean(),
  photoUrl: z.string(),
  role: z.string(),
});

export const apprenantSchema = z.object({
  id: z.number(),
  bio: z.string(),
  profession: z.string(),
  lastConnected: z.string(),
  userId: z.number(),
});

export const mentorSchema = z.object({
  id: z.number(),
  specialite: z.string(),
  experience: z.string(),
  bio: z.string(),
  lastConnected: z.string(),
  userId: z.number(),
});

export const partenaireSchema = z.object({
  id: z.number(),
  organisationName: z.string(),
  activitySector: z.string(),
  juridicStatus: z.string(),
  description: z.string(),
  siteweb: z.string(),
  contact: z.string(),
  logoUrl: z.string(),
  lastConnected: z.string(),
  userId: z.number(),
});

export const myProfileSchema = z.object({
  user: userSchema,
  apprenant: apprenantSchema.nullable(),
  mentor: mentorSchema.nullable(),
  partenaire: partenaireSchema.nullable(),
});


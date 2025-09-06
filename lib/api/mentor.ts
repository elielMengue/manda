import { z } from "zod";
import { safeJsonFetch } from "../http";

export const mentorCourseSummarySchema = z.object({
  id: z.number(),
  titre: z.string(),
  duree: z.number(),
  status: z.string(),
  imageUrl: z.string(),
  inscriptionsCount: z.number(),
  modulesCount: z.number(),
  lessonsCount: z.number(),
  quizzesCount: z.number(),
});

export const mentorCoursesSummarySchema = z.object({
  items: mentorCourseSummarySchema.array(),
  totals: z.object({
    courses: z.number(),
    modules: z.number(),
    lessons: z.number(),
    quizzes: z.number(),
    inscriptions: z.number(),
  }),
});

export type MentorCoursesSummary = z.infer<typeof mentorCoursesSummarySchema>;

export async function getMyMentorCoursesSummary(token: string) {
  return safeJsonFetch(`/api/v1/me/mentor/courses`, { token, schema: mentorCoursesSummarySchema });
}


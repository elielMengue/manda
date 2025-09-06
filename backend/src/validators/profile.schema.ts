import { z } from "zod";

export const createApprenantProfileSchema = z.object({
  bio: z.string().min(1),
  profession: z.string().min(1),
});

export const createMentorProfileSchema = z.object({
  specialite: z.string().min(1),
  experience: z.string().min(1),
  bio: z.string().min(1),
});

export const createPartenaireProfileSchema = z.object({
  organisationName: z.string().min(1),
  activitySector: z.string().min(1),
  juridicStatus: z.string().min(1),
  description: z.string().min(1),
  siteweb: z.string().min(1),
  contact: z.string().min(1),
  logoUrl: z.string().min(1),
});


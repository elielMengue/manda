import { safeJsonFetch } from "../http";
import { myProfileSchema } from "../schemas";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  status: boolean;
  photoUrl: string;
  role: string;
};

export type Apprenant = {
  id: number;
  bio: string;
  profession: string;
  lastConnected: string;
  userId: number;
};

export type Mentor = {
  id: number;
  specialite: string;
  experience: string;
  bio: string;
  lastConnected: string;
  userId: number;
};

export type Partenaire = {
  id: number;
  organisationName: string;
  activitySector: string;
  juridicStatus: string;
  description: string;
  siteweb: string;
  contact: string;
  logoUrl: string;
  lastConnected: string;
  userId: number;
};

export type MyProfile = {
  user: User;
  apprenant: Apprenant | null;
  mentor: Mentor | null;
  partenaire: Partenaire | null;
};

export async function getMyProfile(token: string) {
  return safeJsonFetch<MyProfile>(`/api/v1/profiles/me`, { token, schema: myProfileSchema });
}

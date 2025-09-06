import { safeJsonFetch } from "../http";
import { inscriptionSchema } from "../schemas";

export type Inscription = {
  id: number;
  apprenantId: number;
  coursId: number;
  status: string;
  inscriptionDate: string;
  dateFin: string;
  progression: number;
  cours: {
    id: number;
    titre: string;
    imageUrl: string;
    description: string;
  };
};

export async function listMyInscriptions(token: string) {
  return safeJsonFetch<Inscription[]>(`/api/v1/me/inscriptions`, { token, schema: inscriptionSchema.array() });
}

import { prisma } from "../db/prisma";
import { HttpError } from "../middlewares/error";
import PDFDocument from "pdfkit";

export async function issueCertificateService(issuerUserId: number, apprenantUserId: number, coursId: number) {
  // Admin ou Mentor propriétaire du cours
  const issuer = await prisma.user.findUnique({ where: { id: issuerUserId } });
  if (!issuer) throw new HttpError(404, "Émetteur introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (issuer.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: issuerUserId } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Non autorisé");
  } else if (issuer.role !== "Admin") {
    throw new HttpError(403, "Non autorisé");
  }

  const apprenant = await prisma.apprenant.findUnique({ where: { userId: apprenantUserId }, include: { user: true } });
  if (!apprenant) throw new HttpError(404, "Apprenant introuvable");
  const ins = await prisma.inscription.findFirst({ where: { apprenantId: apprenant.id, coursId } });
  if (!ins) throw new HttpError(400, "L'apprenant n'est pas inscrit à ce cours");
  if (ins.progression < 100) throw new HttpError(400, "Progression insuffisante pour certifier");

  const cert = await prisma.certificat.create({
    data: {
      titre: `Certificat - ${cours.titre}`,
      description: `Atteste la réussite du cours ${cours.titre}`,
      imageUrl: "",
      status: "delivered",
      apprenantId: apprenant.id,
      coursId,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  return cert;
}

export async function generateCertificatePdfService(certificatId: number) {
  const cert = await prisma.certificat.findUnique({
    where: { id: certificatId },
    include: { apprenant: { include: { user: true } }, cours: true },
  });
  if (!cert) throw new HttpError(404, "Certificat introuvable");

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(24).text("Certificat de Réussite", { align: "center" }).moveDown(2);
    doc.fontSize(16).text(`Décerné à: ${cert.apprenant.user.firstName} ${cert.apprenant.user.lastName}`, { align: "center" }).moveDown(1);
    doc.text(`Pour la réussite du cours: ${cert.cours.titre}`, { align: "center" }).moveDown(1);
    doc.text(`Date d'émission: ${cert.dateEmission.toDateString()}`, { align: "center" }).moveDown(2);
    doc.text("EduImpact", { align: "center" });
    doc.end();
  });
}


import { PrismaClient, Role } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@eduimpact.test";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(adminPassword, salt);
    await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "EduImpact",
        email: adminEmail,
        address: "-",
        phone: "-",
        status: true,
        photoUrl: "-",
        password,
        role: Role.Admin,
      },
    });
    // eslint-disable-next-line no-console
    console.log(`Seed: admin créé (${adminEmail})`);
  } else {
    // eslint-disable-next-line no-console
    console.log("Seed: admin déjà présent");
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});


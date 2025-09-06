import { PrismaClient, Role } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const defaultPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const admins = [
    {
      firstName: "Admin",
      lastName: "EduImpact",
      email: process.env.ADMIN_EMAIL || "admin@eduimpact.test",
    },
    {
      firstName: "Alice",
      lastName: "Admin",
      email: "admin2@eduimpact.test",
    },
  ];

  for (const a of admins) {
    const existing = await prisma.user.findUnique({ where: { email: a.email } });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(defaultPassword, salt);
      await prisma.user.create({
        data: {
          ...a,
          address: "-",
          phone: "-",
          status: true,
          photoUrl: "-",
          password,
          role: Role.Admin,
          Admin: { create: {} },
        },
      });
      // eslint-disable-next-line no-console
      console.log(`Seed: admin créé (${a.email})`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`Seed: admin déjà présent (${a.email})`);
    }
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});


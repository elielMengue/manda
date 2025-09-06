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
    {
      firstName: "Bob",
      lastName: "Admin",
      email: "admin3@eduimpact.test",
    },
  ];

  for (const a of admins) {
    const existing = await prisma.user.findUnique({ where: { email: a.email } });
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(defaultPassword, salt);
    if (!existing) {
      const created = await prisma.user.create({
        data: {
          ...a,
          address: "-",
          phone: "-",
          status: true,
          photoUrl: "-",
          password,
          role: Role.Admin,
        },
      });
      await prisma.admin.upsert({
        where: { userId: created.id },
        create: { userId: created.id },
        update: {},
      });
      // eslint-disable-next-line no-console
      console.log(`Seed: admin créé (${a.email})`);
    } else {
      // force role + password reset for consistency
      const updated = await prisma.user.update({
        where: { email: a.email },
        data: { firstName: a.firstName, lastName: a.lastName, password, role: Role.Admin },
      });
      await prisma.admin.upsert({ where: { userId: updated.id }, create: { userId: updated.id }, update: {} });
      // eslint-disable-next-line no-console
      console.log(`Seed: admin mis à jour (${a.email})`);
    }
  }
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

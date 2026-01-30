import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminEmail = "tanvir@email.com";

    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("tanvir123", 10);
    const userId = randomUUID();

    await prisma.user.create({
      data: {
        id: userId,
        name: "Tanvir",
        email: adminEmail,
        role: "ADMIN",
      },
    });

    await prisma.account.create({
      data: {
        id: randomUUID(),
        userId,
        providerId: "credential",
        accountId: userId,
        password: hashedPassword,
      },
    });

    console.log("✅ Admin seeded successfully");
  } catch (error) {
    console.error("❌ Failed to seed admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();

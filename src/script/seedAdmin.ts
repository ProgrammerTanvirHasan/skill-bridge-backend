import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function seedAdmin() {
  try {
    const adminEmail = "tanvir@email.com";

    const existing = await prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("tanvir123", 10);

    await prisma.user.create({
      data: {
        name: "Tanvir",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
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

import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      name: true,
      email: true,
      role: true,
    },
  });
};

const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const userService = {
  getAllUsers,
  getUserById,
};

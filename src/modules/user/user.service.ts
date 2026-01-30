import { prisma } from "../../lib/prisma";

const getAlluser = async () => {
  return prisma.user.findMany({
    select: {
      name: true,
      email: true,
      role: true,
    },
  });
};

export const userService = {
  getAlluser,
};

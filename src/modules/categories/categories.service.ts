import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};
const postCategories = async (name: string) => {
  const result = await prisma.category.create({
    data: { name },
  });
  return result;
};
export const categoriesService = {
  getAllCategories,
  postCategories,
};

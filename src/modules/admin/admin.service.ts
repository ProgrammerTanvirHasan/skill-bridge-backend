import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      tutorProfile: {
        select: {
          id: true,
          bio: true,
          hourlyRate: true,
          status: true,
          categories: { include: { category: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BANNED",
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: { select: { id: true, name: true, email: true } },
      tutor: {
        include: {
          user: true,
          categories: { include: { category: true } },
        },
      },
    },
    orderBy: { scheduledAt: "desc" },
  });
};

const getAllCategoriesAdmin = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { tutors: true } },
    },
  });
};

const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name },
  });
};

const updateCategory = async (id: number, name: string) => {
  return prisma.category.update({
    where: { id },
    data: { name },
  });
};

const deleteCategory = async (id: number) => {
  await prisma.tutorCategory.deleteMany({ where: { categoryId: id } });
  return prisma.category.delete({
    where: { id },
  });
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
};

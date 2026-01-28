import type { TutorStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface CreateTutorProfileInput {
  bio: string;
  hourlyRate: number;
  categoryIds?: number[];
  status: TutorStatus;
}

const createTutorProfile = async (
  userId: string,
  data: CreateTutorProfileInput,
) => {
  const tutor = await prisma.tutorProfile.create({
    data: {
      userId,
      bio: data.bio,
      hourlyRate: data.hourlyRate,
      status: data.status,
      ...(data.categoryIds
        ? {
            categories: {
              create: data.categoryIds.map((categoryId) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            },
          }
        : {}),
    },
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  return tutor;
};

const getAllTutors = async () => {
  return prisma.tutorProfile.findMany({
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      reviews: true,
    },
  });
};

const getTutorById = async (id: number) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      reviews: true,
      bookings: true,
    },
  });
};

export const tutorsService = {
  createTutorProfile,
  getAllTutors,
  getTutorById,
};

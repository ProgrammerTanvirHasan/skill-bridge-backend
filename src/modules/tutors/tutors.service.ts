import type { Prisma } from "../../../generated/prisma/client";
import type { TutorStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface CreateTutorProfileInput {
  bio: string;
  hourlyRate: number;
  categoryIds?: number[];
  status: TutorStatus;
}
export interface UpdateTutorProfileInput {
  bio?: string;
  hourlyRate?: number;
  status?: "AVAILABLE" | "BUSY" | "OFFLINE";
  categoryIds?: number[];
}

export interface TutorFilters {
  categoryId?: number | undefined;
  minRating?: number | undefined;
  maxPrice?: number | undefined;
}

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
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

const getAllTutors = async (filters?: TutorFilters) => {
  const where: Prisma.TutorProfileWhereInput = {};
  if (filters?.categoryId != null) {
    where.categories = {
      some: { categoryId: filters.categoryId },
    };
  }
  if (filters?.maxPrice != null) {
    where.hourlyRate = { lte: filters.maxPrice };
  }
  const tutors = await prisma.tutorProfile.findMany({
    where,
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      reviews: true,
      availability: true,
    },
  });
  if (filters?.minRating != null) {
    return tutors.filter((t) => {
      if (!t.reviews.length) return false;
      const avg =
        t.reviews.reduce((s, r) => s + r.rating, 0) / t.reviews.length;
      return avg >= filters!.minRating!;
    });
  }
  return tutors;
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
      reviews: {
        include: { student: { select: { id: true, name: true } } },
      },
      bookings: true,
      availability: true,
    },
  });
};

const updateTutorProfile = async (
  userId: string,
  data: UpdateTutorProfileInput,
) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) return null;
  const updateData: Parameters<typeof prisma.tutorProfile.update>[0]["data"] = {
    ...(data.bio != null && { bio: data.bio }),
    ...(data.hourlyRate != null && { hourlyRate: data.hourlyRate }),
    ...(data.status != null && { status: data.status }),
  };
  if (data.categoryIds != null) {
    await prisma.tutorCategory.deleteMany({
      where: { tutorProfileId: profile.id },
    });
    if (data.categoryIds.length > 0) {
      await prisma.tutorCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({
          tutorProfileId: profile.id,
          categoryId,
        })),
      });
    }
  }
  return prisma.tutorProfile.update({
    where: { id: profile.id },
    data: updateData,
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
    },
  });
};

const setAvailability = async (userId: string, slots: AvailabilitySlot[]) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) return null;
  await prisma.tutorAvailability.deleteMany({
    where: { tutorId: profile.id },
  });
  if (slots.length > 0) {
    await prisma.tutorAvailability.createMany({
      data: slots.map((s) => ({
        tutorId: profile.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
    });
  }
  return prisma.tutorAvailability.findMany({
    where: { tutorId: profile.id },
    orderBy: { dayOfWeek: "asc" },
  });
};

export const tutorsService = {
  createTutorProfile,
  getAllTutors,
  getTutorById,
  updateTutorProfile,
  setAvailability,
};

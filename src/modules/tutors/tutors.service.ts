import type { Prisma } from "../../../generated/prisma/client";
import type { TutorStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface CreateTutorProfileInput {
  bio: string;
  hourlyRate: number;
  status: TutorStatus;
  categoryIds?: number[];
}

export interface UpdateTutorProfileInput {
  bio?: string;
  hourlyRate?: number;
  status?: "AVAILABLE" | "BUSY" | "OFFLINE";
  categoryIds?: number[];
}

export interface TutorFilters {
  categoryId?: number;
  minRating?: number;
  maxPrice?: number;
}

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/* ---------------- CREATE PROFILE ---------------- */

const createTutorProfile = async (
  userId: string,
  data: CreateTutorProfileInput,
) => {
  const categoryIds = [...new Set(data.categoryIds ?? [])];

  return prisma.$transaction(async (tx) => {
    const existing = await tx.tutorProfile.findUnique({
      where: { userId },
    });

    if (existing) return existing;

    const profile = await tx.tutorProfile.create({
      data: {
        userId,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        status: data.status,
      },
    });

    if (categoryIds.length) {
      await tx.tutorCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          tutorProfileId: profile.id,
          categoryId,
        })),
        skipDuplicates: true,
      });
    }

    return tx.tutorProfile.findUnique({
      where: { id: profile.id },
      include: {
        user: true,
        categories: { include: { category: true } },
      },
    });
  });
};

/* ---------------- GET ALL ---------------- */

const getAllTutors = async (filters?: TutorFilters) => {
  const where: Prisma.TutorProfileWhereInput = {};

  if (filters?.categoryId) {
    where.categories = {
      some: { categoryId: filters.categoryId },
    };
  }

  if (filters?.maxPrice) {
    where.hourlyRate = { lte: filters.maxPrice };
  }

  const tutors = await prisma.tutorProfile.findMany({
    where,
    include: {
      user: true,
      categories: { include: { category: true } },
      reviews: true,
      availability: true,
    },
  });

  if (filters?.minRating) {
    return tutors.filter((t) => {
      if (!t.reviews.length) return false;
      const avg =
        t.reviews.reduce((s, r) => s + r.rating, 0) / t.reviews.length;
      return avg >= filters.minRating!;
    });
  }

  return tutors;
};

/* ---------------- GET BY ID ---------------- */

const getTutorById = async (id: number) =>
  prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      categories: { include: { category: true } },
      reviews: {
        include: { student: { select: { id: true, name: true } } },
      },
      bookings: true,
      availability: true,
    },
  });

/* ---------------- UPDATE PROFILE ---------------- */

const updateTutorProfile = async (
  userId: string,
  data: UpdateTutorProfileInput,
) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("Profile not found");

  const categoryIds = [...new Set(data.categoryIds ?? [])];

  return prisma.$transaction(async (tx) => {
    if (data.categoryIds) {
      await tx.tutorCategory.deleteMany({
        where: { tutorProfileId: profile.id },
      });

      if (categoryIds.length) {
        await tx.tutorCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            tutorProfileId: profile.id,
            categoryId,
          })),
          skipDuplicates: true,
        });
      }
    }

    return tx.tutorProfile.update({
      where: { id: profile.id },
      data: {
        ...(data.bio && { bio: data.bio }),
        ...(data.hourlyRate && { hourlyRate: data.hourlyRate }),
        ...(data.status && { status: data.status }),
      },
      include: {
        user: true,
        categories: { include: { category: true } },
        availability: true,
      },
    });
  });
};

/* ---------------- AVAILABILITY ---------------- */

const setAvailability = async (userId: string, slots: AvailabilitySlot[]) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("Profile not found");

  return prisma.$transaction(async (tx) => {
    await tx.tutorAvailability.deleteMany({
      where: { tutorId: profile.id },
    });

    if (slots.length) {
      await tx.tutorAvailability.createMany({
        data: slots.map((s) => ({
          tutorId: profile.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      });
    }

    return tx.tutorAvailability.findMany({
      where: { tutorId: profile.id },
      orderBy: { dayOfWeek: "asc" },
    });
  });
};

/* ---------------- EXPORT ---------------- */

export const tutorsService = {
  createTutorProfile,
  getAllTutors,
  getTutorById,
  updateTutorProfile,
  setAvailability,
};

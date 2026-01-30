import { prisma } from "../../lib/prisma";
import type { BookingStatus } from "../../../generated/prisma/enums";

interface CreateBookingInput {
  tutorId: number;
  scheduledAt: Date;
}

const createBooking = async (studentId: string, data: CreateBookingInput) => {
  return prisma.booking.create({
    data: {
      studentId,
      tutorId: data.tutorId,
      scheduledAt: data.scheduledAt,
      status: "CONFIRMED",
    },
    include: {
      tutor: {
        include: {
          user: true,
          categories: { include: { category: true } },
        },
      },
      student: { select: { id: true, name: true, email: true } },
    },
  });
};

const getBookingsByUser = async (userId: string, role: string) => {
  if (role === "TUTOR") {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) return [];
    return prisma.booking.findMany({
      where: { tutorId: profile.id },
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
  }
  return prisma.booking.findMany({
    where: { studentId: userId },
    include: {
      tutor: {
        include: {
          user: true,
          categories: { include: { category: true } },
        },
      },
      student: { select: { id: true, name: true, email: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
};

const getBookingById = async (id: number, userId: string, role: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      tutor: {
        include: {
          user: true,
          categories: { include: { category: true } },
        },
      },
      student: { select: { id: true, name: true, email: true } },
    },
  });
  if (!booking) return null;
  if (role === "ADMIN") return booking;
  if (role === "TUTOR") {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (profile?.id === booking.tutorId) return booking;
  }
  if (booking.studentId === userId) return booking;
  return null;
};

const updateBookingStatus = async (
  id: number,
  status: BookingStatus,
  userId: string,
  role: string,
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return null;
  if (role === "TUTOR") {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (profile?.id !== booking.tutorId) return null;
  } else if (role !== "ADMIN" && booking.studentId !== userId) {
    return null;
  }
  return prisma.booking.update({
    where: { id },
    data: { status },
    include: {
      tutor: { include: { user: true } },
      student: { select: { id: true, name: true, email: true } },
    },
  });
};

export const bookingService = {
  createBooking,
  getBookingsByUser,
  getBookingById,
  updateBookingStatus,
};

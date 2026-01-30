import { prisma } from "../../lib/prisma";

interface CreateReviewInput {
  tutorId: number;
  bookingId?: number | undefined;
  rating: number;
  comment?: string | undefined;
}

const createReview = async (studentId: string, data: CreateReviewInput) => {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const existing = await prisma.review.findFirst({
    where: {
      studentId,
      tutorId: data.tutorId,
      ...(data.bookingId
        ? {}
        : {}),
    },
  });
  if (existing) {
    throw new Error("You have already reviewed this tutor");
  }
  if (data.bookingId) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });
    if (
      !booking ||
      booking.studentId !== studentId ||
      booking.tutorId !== data.tutorId ||
      booking.status !== "COMPLETED"
    ) {
      throw new Error("Invalid or incomplete booking for this review");
    }
  }
  return prisma.review.create({
    data: {
      studentId,
      tutorId: data.tutorId,
      rating: data.rating,
      comment: data.comment ?? null,
    },
    include: {
      student: { select: { id: true, name: true } },
      tutor: { include: { user: true } },
    },
  });
};

export const reviewService = {
  createReview,
};

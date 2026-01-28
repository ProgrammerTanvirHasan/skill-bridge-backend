-- CreateEnum
CREATE TYPE "TutorStatus" AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE');

-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "status" "TutorStatus" NOT NULL DEFAULT 'AVAILABLE';

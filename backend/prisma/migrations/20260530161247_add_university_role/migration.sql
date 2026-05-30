-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'UNIVERSITY';

-- CreateTable
CREATE TABLE "university_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "contactPersonName" TEXT,
    "logoUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_profiles_userId_key" ON "university_profiles"("userId");

-- AddForeignKey
ALTER TABLE "university_profiles" ADD CONSTRAINT "university_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

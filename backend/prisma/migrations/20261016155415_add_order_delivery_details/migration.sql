/*
  Warnings:

  - Made the column `googleId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "googleId" SET NOT NULL;

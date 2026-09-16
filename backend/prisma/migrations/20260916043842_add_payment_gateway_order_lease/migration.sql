-- AlterTable
ALTER TABLE "PaymentAttempt" ADD COLUMN     "gatewayOrderCreationToken" TEXT,
ADD COLUMN     "gatewayOrderCreationUntil" TIMESTAMP(3);

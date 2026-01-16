/*
  Warnings:

  - You are about to drop the column `timeSlotId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `ServiceArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeSlot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceSlotId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `serviceType` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicleSize` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."SlotStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_timeSlotId_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "timeSlotId",
ADD COLUMN     "serviceSlotId" TEXT NOT NULL,
DROP COLUMN "serviceType",
ADD COLUMN     "serviceType" "public"."ServiceType" NOT NULL,
DROP COLUMN "vehicleSize",
ADD COLUMN     "vehicleSize" "public"."VehicleSize" NOT NULL;

-- DropTable
DROP TABLE "public"."ServiceArea";

-- DropTable
DROP TABLE "public"."TimeSlot";

-- CreateTable
CREATE TABLE "public"."ServiceZone" (
    "id" TEXT NOT NULL,
    "postcodePrefix" TEXT NOT NULL,
    "serviceDay" INTEGER NOT NULL,
    "zoneCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Operator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceSlot" (
    "id" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeFrom" TEXT NOT NULL,
    "timeTo" TEXT NOT NULL,
    "maxBookings" INTEGER NOT NULL,
    "zonePrefix" TEXT,
    "status" "public"."SlotStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceZone_postcodePrefix_idx" ON "public"."ServiceZone"("postcodePrefix");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceZone_postcodePrefix_serviceDay_key" ON "public"."ServiceZone"("postcodePrefix", "serviceDay");

-- CreateIndex
CREATE INDEX "ServiceSlot_date_idx" ON "public"."ServiceSlot"("date");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_serviceSlotId_fkey" FOREIGN KEY ("serviceSlotId") REFERENCES "public"."ServiceSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceSlot" ADD CONSTRAINT "ServiceSlot_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "public"."Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

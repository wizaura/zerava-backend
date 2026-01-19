/*
  Warnings:

  - You are about to drop the column `registration` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleMake` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleModel` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceSlotId,timeFrom,timeTo]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timeFrom` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTo` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "registration",
DROP COLUMN "vehicleMake",
DROP COLUMN "vehicleModel",
ADD COLUMN     "timeFrom" TEXT NOT NULL,
ADD COLUMN     "timeTo" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_serviceSlotId_idx" ON "public"."Booking"("serviceSlotId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_serviceSlotId_timeFrom_timeTo_key" ON "public"."Booking"("serviceSlotId", "timeFrom", "timeTo");

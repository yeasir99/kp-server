/*
  Warnings:

  - Added the required column `address` to the `Docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postCode` to the `Docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Docs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Docs" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "postCode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

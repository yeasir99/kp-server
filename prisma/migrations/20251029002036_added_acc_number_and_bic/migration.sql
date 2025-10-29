/*
  Warnings:

  - Added the required column `accNum` to the `Docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bicCode` to the `Docs` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Docs" ADD COLUMN     "accNum" TEXT NOT NULL,
ADD COLUMN     "bicCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

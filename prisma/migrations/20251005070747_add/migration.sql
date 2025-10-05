-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('Free', 'EmailVerification', 'PhoneVerification', 'Created');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Root', 'User');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "StatusType" NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('NOT_TOUCH', 'EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'CREATED');

-- CreateTable
CREATE TABLE "Docs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'NOT_TOUCH',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Docs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Docs" ADD CONSTRAINT "Docs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

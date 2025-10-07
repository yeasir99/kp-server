/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Docs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Docs_email_key" ON "Docs"("email");

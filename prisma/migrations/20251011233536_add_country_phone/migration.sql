-- CreateTable
CREATE TABLE "CountryPhone" (
    "id" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "apiCountryName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CountryPhone_pkey" PRIMARY KEY ("id")
);

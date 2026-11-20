-- AlterTable
ALTER TABLE "CandidateProfile" ADD COLUMN "industry" TEXT,
ADD COLUMN "jobTitle" TEXT,
ADD COLUMN "machinesFreeText" TEXT,
ADD COLUMN "skillsSummary" TEXT;

-- CreateTable
CREATE TABLE "ReferralRequest" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "machinesNeeded" TEXT NOT NULL,
    "experienceYears" INTEGER,
    "governorate" TEXT,
    "salaryRange" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidateProfile_industry_idx" ON "CandidateProfile"("industry");
CREATE INDEX "CandidateProfile_isAvailable_industry_idx" ON "CandidateProfile"("isAvailable", "industry");

-- CreateIndex
CREATE INDEX "ReferralRequest_employerId_idx" ON "ReferralRequest"("employerId");
CREATE INDEX "ReferralRequest_status_idx" ON "ReferralRequest"("status");

-- AddForeignKey
ALTER TABLE "ReferralRequest" ADD CONSTRAINT "ReferralRequest_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

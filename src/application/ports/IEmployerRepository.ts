// src/application/ports/IEmployerRepository.ts
// Port: Employer data access contract — no Prisma, no infrastructure coupling
// Implementations: PrismaEmployerRepository (infrastructure/repositories)

export interface ActiveSubscriptionRecord {
  id: string;
  employerId: string;
  status: string;
  endDate: Date;
  phoneViewsUsed: number;
  plan: {
    name: string;
    maxActiveJobs: number;
    maxPhoneViews: number;
    canViewPhone: boolean;
    canExportData: boolean;
  };
}

export interface ReferralRequestData {
  employerId: string;
  industry: string;
  jobTitle: string;
  machinesNeeded: string;
  experienceYears?: number;
  governorate?: string;
  salaryRange?: string;
  notes?: string;
}

export interface ReferralRequestRecord {
  id: string;
  employerId: string;
  industry: string;
  jobTitle: string;
  machinesNeeded: string;
  experienceYears: number | null;
  governorate: string | null;
  salaryRange: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  employer: {
    id: string;
    companyName: string;
    industryZone: string;
    user: {
      phoneNumber: string;
      email: string | null;
    };
  };
}

export interface IEmployerRepository {
  findProfileIdByUserId(userId: string): Promise<string | null>;
  findActiveSubscription(employerProfileId: string): Promise<ActiveSubscriptionRecord | null>;
  update(employerProfileId: string, data: { isVerified?: boolean }): Promise<{ companyName: string }>;
  findAllEmployersWithUsers(): Promise<unknown[]>;
  getVerifiedCompaniesWithJobs(query?: string, zone?: string): Promise<unknown[]>;
  incrementPhoneViews(subscriptionId: string): Promise<void>;
  createReferralRequest(data: ReferralRequestData): Promise<{ id: string }>;
  getAllReferralRequests(status?: string): Promise<ReferralRequestRecord[]>;
  updateReferralRequestStatus(requestId: string, status: string): Promise<void>;
  createCheckoutTransaction(
    employerId: string,
    planId: string,
    amount: number,
    idempotencyKey: string
  ): Promise<{ invoiceId: string; transactionId: string; planName: string; companyName?: string }>;
  activateSubscriptionAfterPayment(
    idempotencyKey: string,
    gatewayRef: string
  ): Promise<{ success: boolean; employerId?: string; subscriptionId?: string; invoiceId?: string; amount?: number }>;
}

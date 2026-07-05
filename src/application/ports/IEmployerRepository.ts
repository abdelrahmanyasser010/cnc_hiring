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

export interface IEmployerRepository {
  findProfileIdByUserId(userId: string): Promise<string | null>;
  findActiveSubscription(employerProfileId: string): Promise<ActiveSubscriptionRecord | null>;
  update(employerProfileId: string, data: { isVerified?: boolean }): Promise<{ companyName: string }>;
  findAllEmployersWithUsers(): Promise<unknown[]>;
  getVerifiedCompaniesWithJobs(query?: string, zone?: string): Promise<unknown[]>;
  incrementPhoneViews(subscriptionId: string): Promise<void>;
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

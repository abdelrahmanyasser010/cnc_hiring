// src/application/ports/IPlanRepository.ts
// Port: Subscription plans data access contract — no Prisma, no infrastructure coupling

export interface PlanDTO {
  id: string;
  name: string;
  description: string | null;
  priceEGP: number;
  durationDays: number;
  maxActiveJobs: number;
  maxPhoneViews: number;
  canViewPhone: boolean;
  canExportData: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface IPlanRepository {
  listAllPlans(): Promise<PlanDTO[]>;
  listActivePlans(): Promise<PlanDTO[]>;
  createPlan(data: {
    name: string;
    description?: string;
    priceEGP: number;
    durationDays: number;
    maxActiveJobs: number;
    maxPhoneViews: number;
    canViewPhone?: boolean;
    canExportData?: boolean;
    sortOrder?: number;
  }): Promise<PlanDTO>;
  updatePlan(
    id: string,
    data: {
      name?: string;
      description?: string;
      priceEGP?: number;
      durationDays?: number;
      maxActiveJobs?: number;
      maxPhoneViews?: number;
      canViewPhone?: boolean;
      canExportData?: boolean;
      isActive?: boolean;
      sortOrder?: number;
    }
  ): Promise<PlanDTO>;
  togglePlanStatus(id: string): Promise<boolean>;
}

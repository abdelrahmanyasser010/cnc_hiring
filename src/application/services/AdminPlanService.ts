// src/application/services/AdminPlanService.ts
// Application service for managing subscription plans and pricing by Super Admin
// Refactored to use IPlanRepository Port (Clean Architecture compliance)

import { IPlanRepository, PlanDTO } from "@/application/ports/IPlanRepository";
export type { PlanDTO };

export class AdminPlanService {
  constructor(private readonly planRepo: IPlanRepository) {}

  async listAllPlans(): Promise<PlanDTO[]> {
    return this.planRepo.listAllPlans();
  }

  async listActivePlans(): Promise<PlanDTO[]> {
    return this.planRepo.listActivePlans();
  }

  async createPlan(data: {
    name: string;
    description?: string;
    priceEGP: number;
    durationDays: number;
    maxActiveJobs: number;
    maxPhoneViews: number;
    canViewPhone?: boolean;
    canExportData?: boolean;
    sortOrder?: number;
  }): Promise<PlanDTO> {
    return this.planRepo.createPlan(data);
  }

  async updatePlan(
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
  ): Promise<PlanDTO> {
    return this.planRepo.updatePlan(id, data);
  }

  async togglePlanStatus(id: string): Promise<boolean> {
    return this.planRepo.togglePlanStatus(id);
  }
}

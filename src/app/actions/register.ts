// src/app/actions/register.ts
// Barrel re-export + getRegistrationLookups helper (backward compatibility)
// The actual registration actions live in src/presentation/actions/auth.actions.ts

export { registerCandidateAction, registerEmployerAction, verifyEmailAction } from "@/presentation/actions/auth.actions";

import { candidateRepo } from "@/infrastructure/container";

/**
 * Fetches lookup data for the candidate registration form.
 * Falls back to constants if DB is unavailable.
 */
export async function getRegistrationLookups() {
  return candidateRepo.getRegistrationLookups();
}

/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Case interface - matches database schema
 */
export interface Case {
  id: number;
  applianceType: string;
  brand: string;
  model: string;
  symptoms: string[];
  additionalNotes: string | null;
  diagnosticSteps: string[];
  rootCause: string;
  partReplaced: string;
  partCost: string;
  laborTimeMinutes: number;
  diyFeasibility: 'Easy' | 'Moderate' | 'Professional Required';
  successful: boolean;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCaseRequest = Omit<Case, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateCaseResponse = Case;

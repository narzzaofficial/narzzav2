// types/api-helpers.ts

import type { ZodError } from "zod";

/**
 * Error types yang bisa diterima validationErrorResponse
 */
export type ValidationError = 
  | ZodError 
  | { message: string } 
  | Error
  | { errors: unknown };

/**
 * Standard error response shape
 */
export interface ErrorResponse {
  error: string;
  details?: unknown;
}

/**
 * Success response (generic)
 */
export interface SuccessResponse {
  success: boolean;
  message?: string;
}
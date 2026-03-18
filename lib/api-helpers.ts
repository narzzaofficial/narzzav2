// lib/api-helpers.ts

import { NextResponse } from "next/server";
import type { ValidationError, ErrorResponse } from "@/types/api-halpers";

/**
 * Return JSON response dengan cache headers
 */
export function cachedJson<T>(data: T, maxAge: number = 60): NextResponse<T> {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    },
  });
}

/**
 * Database unavailable response (503)
 */
export function dbUnavailableResponse(): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { error: "Database unavailable" },
    { status: 503 }
  );
}

/**
 * Invalid ID response (400)
 */
export function invalidIdResponse(): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { error: "Invalid ID" },
    { status: 400 }
  );
}

export function invalidSlugResponse(): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { error: "Invalid slug" },
    { status: 400 }
  );
}

export function invalidPaginationResponse(): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { error: "Invalid pagination params" },
    { status: 400 }
  );
}

export function parsePositiveInt(
  value: string | null,
  fallback: number
): number | null {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return parsed;
}

export function normalizeSlug(value: string | null): string | null {
  if (value === null) return null;
  const slug = value.trim();
  if (!slug) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  return slug;
}

export function logApiError(
  operation: string,
  error: unknown,
  context?: Record<string, unknown>
) {
  console.error(operation, {
    error,
    ...(context ?? {}),
  });
}

/**
 * Validation error response (400)
 */
export function validationErrorResponse(
  error: ValidationError
): NextResponse<ErrorResponse> {
  let details: unknown;

  if ("issues" in error) {
    // Zod error
    details = error.issues;
  } else if ("errors" in error) {
    // Mongoose validation error
    details = error.errors;
  } else if ("message" in error) {
    // Generic error
    details = error.message;
  } else {
    details = error;
  }

  return NextResponse.json(
    {
      error: "Validation failed",
      details,
    },
    { status: 400 }
  );
}

/**
 * Not found response (404)
 */
export function notFoundResponse(
  message: string = "Resource not found"
): NextResponse<ErrorResponse> {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Unauthorized response (401)
 */
export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<ErrorResponse> {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Forbidden response (403)
 */
export function forbiddenResponse(
  message: string = "Forbidden"
): NextResponse<ErrorResponse> {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Internal server error response (500)
 */
export function serverErrorResponse(
  message: string = "Internal server error"
): NextResponse<ErrorResponse> {
  return NextResponse.json({ error: message }, { status: 500 });
}

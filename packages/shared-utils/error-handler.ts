import { Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import axios from 'axios';
export function handleError(
  res: Response,
  error: unknown,
  fallbackStatus = 400
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: (error as ZodError).issues.map((e: ZodIssue) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (axios.isAxiosError(error)) {
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.response?.data?.message,
    });
  }

  if (error instanceof Error) {
    return res.status(fallbackStatus).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: 'Internal server error',
  });
}

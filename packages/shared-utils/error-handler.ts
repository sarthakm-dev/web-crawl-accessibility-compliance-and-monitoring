import { Response } from 'express';
import { ZodError } from 'zod';
import axios from 'axios';
import { BaseError, UniqueConstraintError } from 'sequelize';
export function handleError(
  res: Response,
  error: unknown,
  fallbackStatus = 500
) {
  // handle zod error
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: (error as ZodError).issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }
  // handle axios error
  if (axios.isAxiosError(error)) {
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.response?.data?.message,
    });
  }
  // handle database unique constraint error
  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({
      error: 'Conflict',
      message:
        (error as UniqueConstraintError).errors
          .map(e => e.message)
          .join(', ') || 'Record already exists',
    });
  }
  // handle base database error
  if (error instanceof BaseError) {
    return res.status(500).json({
      error: 'Database error',
    });
  }
  // handle fallback error
  if (error instanceof Error) {
    return res.status(fallbackStatus).json({
      error: error.message,
    });
  }
  // any other internal server error
  return res.status(500).json({
    error: 'Internal server error',
  });
}

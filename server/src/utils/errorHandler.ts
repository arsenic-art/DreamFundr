import type { Response } from 'express';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/error.types.js';
import { ErrorCodes } from '../types/error.types.js';

const ERROR_MESSAGES: Record<ErrorCodes, string> = {
  [ErrorCodes.AUTH_USER_NOT_FOUND]: 'No account found with this email address. Please check your email or sign up for a new account',
  [ErrorCodes.AUTH_INVALID_PASSWORD]: 'Incorrect password. Please try again or reset your password',
  [ErrorCodes.AUTH_EMAIL_NOT_VERIFIED]: 'Email not verified. Verification email resent.',
  [ErrorCodes.AUTH_ACCOUNT_LOCKED]: 'Your account has been temporarily locked. Please contact support for assistance',
  [ErrorCodes.AUTH_INVALID_TOKEN]: 'Your session has expired. Please log in again',
  
  [ErrorCodes.VALIDATION_REQUIRED_FIELD]: 'This field is required',
  [ErrorCodes.VALIDATION_INVALID_EMAIL]: 'Please enter a valid email address (example@domain.com)',
  [ErrorCodes.VALIDATION_PASSWORD_WEAK]: 'Password must be at least 8 characters long',
  [ErrorCodes.VALIDATION_USERNAME_TAKEN]: 'This username is already taken. Please choose a different one',
  [ErrorCodes.VALIDATION_INVALID_FORMAT]: 'Please enter a valid format',
  
  [ErrorCodes.SYSTEM_DATABASE_ERROR]: 'Something went wrong on our end. Please try again in a moment',
  [ErrorCodes.SYSTEM_NETWORK_ERROR]: 'Connection lost. Please check your internet and try again',
  [ErrorCodes.SYSTEM_RATE_LIMITED]: 'Too many requests. Please wait a moment before trying again',
  [ErrorCodes.SYSTEM_PERMISSION_DENIED]: 'You don\'t have permission to perform this action',
  [ErrorCodes.SYSTEM_RESOURCE_NOT_FOUND]: 'The requested item could not be found',
  [ErrorCodes.SYSTEM_INTERNAL_ERROR]: 'Something went wrong on our end. Please try again in a moment'
};

export function createErrorResponse(
  code: ErrorCodes,
  message: string,
  field?: string,
  details?: any
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      userMessage: ERROR_MESSAGES[code] || 'An unexpected error occurred',
      field,
      details
    },
    timestamp: new Date().toISOString()
  };
}

export function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };
}
export function sendErrorResponse(
  res: Response,
  statusCode: number,
  code: ErrorCodes,
  message: string,
  field?: string,
  details?: any
): Response {
  const errorResponse = createErrorResponse(code, message, field, details);
  
  console.error(`[${errorResponse.timestamp}] ERROR ${statusCode}:`, {
    code,
    message,
    field,
    details
  });
  
  return res.status(statusCode).json(errorResponse);
}

export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response {
  const successResponse = createSuccessResponse(data);
  return res.status(statusCode).json(successResponse);
}

export function handleValidationError(
  res: Response,
  field: string,
  code: ErrorCodes,
  customMessage?: string
): Response {
  const message = customMessage || `Validation failed for field: ${field}`;
  return sendErrorResponse(res, 400, code, message, field);
}

export function handleAuthError(
  res: Response,
  code: ErrorCodes,
  customMessage?: string
): Response {
  const statusCode = code === ErrorCodes.AUTH_EMAIL_NOT_VERIFIED ? 403 : 401;
  const message = customMessage || 'Authentication failed';
  return sendErrorResponse(res, statusCode, code, message);
}

export function handleSystemError(
  res: Response,
  error: any,
  code: ErrorCodes = ErrorCodes.SYSTEM_INTERNAL_ERROR
): Response {
  console.error('System error:', error);
  
  const message = error?.message || 'Internal system error';
  return sendErrorResponse(res, 500, code, message, undefined, {
    stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
  });
}

export function asyncHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error('Async handler error:', error);
      handleSystemError(res, error);
    });
  };
}
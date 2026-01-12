export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;           
    message: string;        
    userMessage: string;    
    field?: string;         
    details?: any;         
  };
  timestamp: string;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
}

export enum ErrorCodes {
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_INVALID_PASSWORD = 'AUTH_INVALID_PASSWORD',
  AUTH_EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  
  VALIDATION_REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_EMAIL = 'VALIDATION_INVALID_EMAIL',
  VALIDATION_PASSWORD_WEAK = 'VALIDATION_PASSWORD_WEAK',
  VALIDATION_USERNAME_TAKEN = 'VALIDATION_USERNAME_TAKEN',
  VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',
  
  SYSTEM_DATABASE_ERROR = 'SYSTEM_DATABASE_ERROR',
  SYSTEM_NETWORK_ERROR = 'SYSTEM_NETWORK_ERROR',
  SYSTEM_RATE_LIMITED = 'SYSTEM_RATE_LIMITED',
  SYSTEM_PERMISSION_DENIED = 'SYSTEM_PERMISSION_DENIED',
  SYSTEM_RESOURCE_NOT_FOUND = 'SYSTEM_RESOURCE_NOT_FOUND',
  SYSTEM_INTERNAL_ERROR = 'SYSTEM_INTERNAL_ERROR'
}

export enum ErrorSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export enum ErrorType {
  FIELD = 'field',
  FORM = 'form',
  GLOBAL = 'global'
}
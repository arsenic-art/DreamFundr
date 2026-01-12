import { ErrorCodes } from '../types/error.types.js';

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    code: ErrorCodes;
    message: string;
  }>;
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN_LENGTH = 8;

export function validateEmail(email: string, fieldName: string = 'email'): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  
  if (!email || email.trim() === '') {
    errors.push({
      field: fieldName,
      code: ErrorCodes.VALIDATION_REQUIRED_FIELD,
      message: 'Email is required'
    });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({
      field: fieldName,
      code: ErrorCodes.VALIDATION_INVALID_EMAIL,
      message: 'Invalid email format'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePassword(password: string, fieldName: string = 'password'): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  
  if (!password || password.trim() === '') {
    errors.push({
      field: fieldName,
      code: ErrorCodes.VALIDATION_REQUIRED_FIELD,
      message: 'Password is required'
    });
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push({
      field: fieldName,
      code: ErrorCodes.VALIDATION_PASSWORD_WEAK,
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateRequired(value: any, fieldName: string): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    errors.push({
      field: fieldName,
      code: ErrorCodes.VALIDATION_REQUIRED_FIELD,
      message: `${fieldName} is required`
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateLength(
  value: string,
  fieldName: string,
  minLength?: number,
  maxLength?: number
): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  
  if (minLength && value.length < minLength) {
    errors.push({
      field: fieldName,
      code: ErrorCodes.VALIDATION_INVALID_FORMAT,
      message: `${fieldName} must be at least ${minLength} characters long`
    });
  }
  
  if (maxLength && value.length > maxLength) {
    errors.push({
      field: fieldName,
      code: ErrorCodes.VALIDATION_INVALID_FORMAT,
      message: `${fieldName} must be no more than ${maxLength} characters long`
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap(result => result.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

export function validateFields(validations: Array<() => ValidationResult>): ValidationResult {
  const results = validations.map(validation => validation());
  return combineValidationResults(...results);
}
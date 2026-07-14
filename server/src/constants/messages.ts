export const SuccessMessages = {
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  HEALTH_OK: 'System is healthy',
  PROFILE_RETRIEVED: 'User profile retrieved successfully',
} as const;

export const ErrorMessages = {
  EMAIL_ALREADY_EXISTS: 'Email address is already registered',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Authentication required. Please provide a valid token.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred on the server',
  VALIDATION_ERROR: 'Validation failed',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token signature or format',
} as const;

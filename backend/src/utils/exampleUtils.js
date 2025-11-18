/**
 * Example Utils Template
 *
 * Utility functions for common operations.
 * Keep them pure and reusable.
 *
 * Usage:
 * - Import this pattern for new utilities
 * - Remove this file when creating actual utilities
 */

// Example: Validation utility
export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Example: Helper function
export const formatDate = date => {
  return new Date(date).toISOString();
};

// Example: Constants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

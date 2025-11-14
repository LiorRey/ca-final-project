/**
 * Example Service Template
 * 
 * Services contain business logic and interact with models/databases.
 * They should be reusable and testable.
 * 
 * Usage:
 * - Import this pattern for new services
 * - Remove this file when creating actual services
 */

// Example: User Service
export const getUserById = async (id) => {
  // Business logic here
  // Database queries, external API calls, etc.
  // throw new Error('User not found'); // Example error
  return { id, name: 'Example User' };
};

export const createUser = async (userData) => {
  // Validation, transformation, database operations
  return { id: 1, ...userData };
};


/**
 * Centralized error handler middleware
 * Handles all errors and returns consistent JSON response
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Default error message and status
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Send error response
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;


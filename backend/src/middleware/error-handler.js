import createError from "http-errors";
import { config } from "../config/env.js";

function errorHandler(err, _req, res, _next) {
  let error = err;

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(", ");
    error = createError(400, messages);
  }

  if (err.name === "CastError") {
    error = createError(400, `${err.path} is invalid`);
  }

  if (err.name === "JsonWebTokenError") {
    error = createError(401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    error = createError(401, "Token expired");
  }

  // Some unexpected programming error
  if (!createError.isHttpError(error)) {
    console.error("Unexpected error:", error);
    error = createError(500, "Internal server error");
  }

  const status = error.statusCode || error.status || 500;

  const response = {
    error: error.message,
  };

  if (config.app.env === "development") {
    response.stack = error.stack;
  }

  res.status(status).json(response);
}

export default errorHandler;

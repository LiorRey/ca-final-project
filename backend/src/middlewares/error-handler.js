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

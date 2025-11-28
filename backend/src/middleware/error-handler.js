import { isHttpError } from "http-errors";
import { config } from "../config/env.js";

function errorHandler(err, _req, res, _next) {
  console.error("Error:", err);

  if (isHttpError(err)) {
    res.status(err.status).json({
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    error:
      config.app.env === "development" ? err.message : "Internal server error",
    ...(config.app.env === "development" && { stack: err.stack }),
  });
}

export default errorHandler;

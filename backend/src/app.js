import { config } from "./config/env.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error-handler.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files from public directory
app.use(express.static(join(__dirname, "../public")));

// CORS configuration - allow same-origin when serving React app
const corsOptions = {
  credentials: true,
};

// Only set specific origin for development or when frontend is served separately
if (config.cors.origin) {
  corsOptions.origin = config.cors.origin;
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.app.env === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(cookieParser());

app.use("/api", routes);

app.get("/health", function (_req, res) {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

if (config.app.env === "production") {
  // SPA routing - serve index.html for all non-API routes
  app.get("/{*splat}", function (_req, res) {
    res.sendFile(join(__dirname, "../public/index.html"));
  });
}

app.use(errorHandler);

export default app;

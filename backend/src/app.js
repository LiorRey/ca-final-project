import { config } from "./config/env.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.app.env === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(cookieParser());

app.use("/", routes);

app.get("/health", function (_req, res) {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(function (_req, res) {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;

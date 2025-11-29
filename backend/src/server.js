import "dotenv/config";
import { config } from "./config/env.js";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = config.app.port;
const NODE_ENV = config.app.env;
const URL = `http://localhost:${PORT}`;

async function startServer() {
  try {
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`URL: ${URL}`);
      console.log("Database is connecting...");
      await connectDatabase();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

await startServer();

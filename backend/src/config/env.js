export function getConfig() {
  const env = process.env.NODE_ENV;

  const port = parseInt(process.env.PORT || "3000", 10);

  const dbURL = process.env.MONGODB_URI || "mongodb://localhost:27017/basicdb";

  const dbName = process.env.MONGO_DATABASE || "basicdb";

  const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:5173";

  return {
    app: {
      env,
      port,
    },
    database: {
      url: dbURL,
      name: dbName,
    },
    cors: {
      origin: frontendUrl,
    },
  };
}

export const config = getConfig();

export function getConfig() {
  const env = process.env.NODE_ENV;

  const port = parseInt(process.env.PORT);

  const dbURL = process.env.MONGODB_URI;

  const dbName = process.env.MONGO_DATABASE;

  const frontendUrl = process.env.CORS_ORIGIN;

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

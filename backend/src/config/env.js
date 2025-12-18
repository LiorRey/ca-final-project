export function getConfig() {
  const env = process.env.NODE_ENV;

  const port = parseInt(process.env.PORT);

  const dbURL = process.env.MONGODB_URI;

  const dbName = process.env.MONGO_DATABASE;

  const frontendUrl = process.env.CORS_ORIGIN;

  const cloudinaryFolder = process.env.CLOUDINARY_FOLDER;
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

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
    cloudinary: {
      cloudName: cloudinaryCloudName,
      apiKey: cloudinaryApiKey,
      apiSecret: cloudinaryApiSecret,
      defaultFolder: cloudinaryFolder,
    },
  };
}

export const config = getConfig();

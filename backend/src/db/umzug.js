import { Umzug, MongoDBStorage } from "umzug";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates and configures an Umzug instance for MongoDB migrations
 * @returns {Promise<Umzug>} Configured Umzug instance
 */
export async function getUmzug() {
  if (mongoose.connection.readyState !== 1) {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
  }

  const umzug = new Umzug({
    migrations: {
      glob: path.join(__dirname, "migrations", "*.js"),
      resolve: ({ name, path: filepath }) => {
        return {
          name,
          up: async () => {
            const migration = await import(filepath);
            return migration.up({ context: mongoose.connection.db });
          },
          down: async () => {
            const migration = await import(filepath);
            return migration.down({ context: mongoose.connection.db });
          },
        };
      },
    },
    create: {
      folder: path.join(__dirname, "migrations"),
      template: filepath => [
        [
          filepath,
          `export const up = async ({ context }) => {
  // Migration code here
  // Example: await context.collection('users').insertOne({ name: 'Admin' });
};

export const down = async ({ context }) => {
  // Rollback code here
  // Example: await context.collection('users').deleteOne({ name: 'Admin' });
};
`,
        ],
      ],
    },
    context: mongoose.connection.db,
    storage: new MongoDBStorage({
      connection: mongoose.connection.db,
      collectionName: "migrations",
    }),
    logger: console,
  });

  return umzug;
}

export default getUmzug;

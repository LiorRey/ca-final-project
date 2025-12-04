import { Umzug, MongoDBStorage } from "umzug";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getUmzug() {
  if (mongoose.connection.readyState !== 1) {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
  }

  // Manually read migration files
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter(file => file.endsWith(".js"))
    .map(file => ({
      name: file,
      path: path.join(migrationsDir, file),
    }));

  console.log(
    `[DEBUG] Found ${files.length} migration files:`,
    files.map(f => f.name)
  );

  const umzug = new Umzug({
    migrations: files.map(({ name, path: filepath }) => ({
      name,
      up: async () => {
        console.log(`[DEBUG] Running migration up: ${name}`);
        const migration = await import(`file://${filepath}`);
        return migration.up({ context: mongoose.connection.db });
      },
      down: async () => {
        console.log(`[DEBUG] Running migration down: ${name}`);
        const migration = await import(`file://${filepath}`);
        return migration.down({ context: mongoose.connection.db });
      },
    })),
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

#!/usr/bin/env node

import "dotenv/config";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import readline from "readline";

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Database collections in the trello_clone database
 */
const COLLECTIONS = {
  users: "User accounts and authentication data",
  boards: "Trello boards with labels, owners, and members",
  lists: "Lists within boards (To Do, In Progress, Done, etc.)",
  cards: "Cards within lists with comments, labels, assignees",
  migrations: "Umzug migration tracking (usually preserved)",
};

/**
 * Prompt user for confirmation
 */
function askConfirmation(message) {
  return new Promise(resolve => {
    rl.question(`${message} (y/N): `, answer => {
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Prompt user to select collections
 */
function askForCollections() {
  return new Promise(resolve => {
    console.log("\nAvailable collections:");
    Object.entries(COLLECTIONS).forEach(([name, description]) => {
      console.log(`  ${name}: ${description}`);
    });

    rl.question(
      '\nEnter collections to clean (comma-separated, or "all"): ',
      answer => {
        if (answer.toLowerCase().trim() === "all") {
          resolve(Object.keys(COLLECTIONS));
        } else {
          const selected = answer
            .split(",")
            .map(s => s.trim())
            .filter(s => COLLECTIONS[s]);
          resolve(selected);
        }
      }
    );
  });
}

/**
 * Clean specified collections
 */
async function cleanCollections(collections, preserveMigrations = true) {
  const db = mongoose.connection.db;
  let totalDeleted = 0;

  console.log("\n🧹 Cleaning collections...");

  for (const collectionName of collections) {
    // Skip migrations if preserveMigrations is true
    if (collectionName === "migrations" && preserveMigrations) {
      console.log(`⏭️  Skipping ${collectionName} (preserved)`);
      continue;
    }

    try {
      const collection = db.collection(collectionName);
      const result = await collection.deleteMany({});
      const deletedCount = result.deletedCount || 0;
      totalDeleted += deletedCount;

      if (deletedCount > 0) {
        console.log(`✅ ${collectionName}: ${deletedCount} documents deleted`);
      } else {
        console.log(`✅ ${collectionName}: already empty`);
      }
    } catch (error) {
      console.error(`❌ ${collectionName}: Error - ${error.message}`);
    }
  }

  return totalDeleted;
}

/**
 * Display current collection statistics
 */
async function showCollectionStats() {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  console.log("\n📊 Current collection statistics:");
  console.log("================================");

  for (const collection of collections) {
    try {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} documents`);
    } catch (error) {
      console.log(`${collection.name}: Error accessing - ${error.message}`);
    }
  }
  console.log("================================\n");
}

/**
 * Main cleanup function
 */
async function cleanDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🔗 Connected to database: ${mongoose.connection.name}`);

    // Show current state
    await showCollectionStats();

    // Ask what to clean
    const collections = await askForCollections();

    if (collections.length === 0) {
      console.log("❌ No valid collections selected");
      return;
    }

    // Check if migrations should be preserved
    const preserveMigrations = collections.includes("migrations")
      ? await askConfirmation("Preserve migrations collection?")
      : true;

    // Confirm before proceeding
    const confirmation = await askConfirmation(
      `⚠️  This will delete ALL data in: ${collections.join(", ")}\n` +
        `Migrations will ${preserveMigrations ? "be preserved" : "also be deleted"}\n` +
        "Are you absolutely sure?"
    );

    if (!confirmation) {
      console.log("❌ Cleanup cancelled");
      return;
    }

    // Perform cleanup
    const totalDeleted = await cleanCollections(
      collections,
      preserveMigrations
    );

    console.log(
      `\n🎉 Cleanup completed! Total documents deleted: ${totalDeleted}`
    );

    // Show final state
    await showCollectionStats();
  } catch (error) {
    console.error("💥 Database cleanup error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    rl.close();
  }
}

/**
 * CLI help message
 */
function showHelp() {
  console.log(`
🧹 Trello Clone Database Cleanup Script

Usage:
  node clean-db.js [options]

Options:
  --help, -h     Show this help message
  --stats         Show current collection statistics only
  --all           Clean all collections (except migrations)
  --force-all      Clean all collections INCLUDING migrations (DANGEROUS!)

Examples:
  node clean-db.js              # Interactive mode
  node clean-db.js --stats       # Show statistics only
  node clean-db.js --all         # Clean all (preserve migrations)
  node clean-db.js --force-all    # Clean everything (DANGEROUS!)
`);
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    return null;
  }

  if (args.includes("--stats")) {
    return { action: "stats" };
  }

  if (args.includes("--force-all")) {
    return {
      action: "clean",
      collections: Object.keys(COLLECTIONS),
      preserveMigrations: false,
      force: true,
    };
  }

  if (args.includes("--all")) {
    return {
      action: "clean",
      collections: Object.keys(COLLECTIONS),
      preserveMigrations: true,
      force: false,
    };
  }

  return { action: "interactive" };
}

// Main execution
if (isMainModule) {
  const options = parseArgs();

  if (!options) {
    process.exit(0);
  }

  if (options.action === "stats") {
    // Stats only mode
    (async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`🔗 Connected to database: ${mongoose.connection.name}`);
        await showCollectionStats();
      } catch (error) {
        console.error("💥 Error:", error);
        process.exit(1);
      } finally {
        await mongoose.connection.close();
      }
    })();
  } else if (options.action === "clean") {
    // Direct cleanup mode
    (async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`🔗 Connected to database: ${mongoose.connection.name}`);

        if (!options.force) {
          const confirmation = await askConfirmation(
            `⚠️  This will delete ALL data in: ${options.collections.join(", ")}\n` +
              `Migrations will ${options.preserveMigrations ? "be preserved" : "also be deleted"}\n` +
              "Are you absolutely sure?"
          );

          if (!confirmation) {
            console.log("❌ Cleanup cancelled");
            return;
          }
        }

        await showCollectionStats();
        const totalDeleted = await cleanCollections(
          options.collections,
          options.preserveMigrations
        );
        console.log(
          `\n🎉 Cleanup completed! Total documents deleted: ${totalDeleted}`
        );
        await showCollectionStats();
      } catch (error) {
        console.error("💥 Database cleanup error:", error);
        process.exit(1);
      } finally {
        await mongoose.connection.close();
        rl.close();
      }
    })();
  } else {
    // Interactive mode
    cleanDatabase();
  }
}

export { cleanCollections, showCollectionStats };

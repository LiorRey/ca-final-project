#!/usr/bin/env node

import "dotenv/config";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { getUmzug } from "./umzug.js";

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  try {
    const umzug = await getUmzug();
    await umzug.runAsCLI();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

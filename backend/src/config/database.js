import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
    console.log(`Database: ${mongoose.connection.name}`);

    mongoose.connection.on("error", err => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

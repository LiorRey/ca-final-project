import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/basicdb";

    await mongoose.connect(mongoURI);

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

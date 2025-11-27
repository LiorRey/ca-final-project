import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    labels: [
      {
        title: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    owner: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Board = mongoose.model("Board", boardSchema);

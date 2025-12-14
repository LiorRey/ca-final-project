import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
});

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
    labels: [labelSchema],
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
      fullname: {
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
        fullname: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

boardSchema.set("toJSON", { virtuals: true });

boardSchema.virtual("lists", {
  ref: "List",
  localField: "_id",
  foreignField: "boardId",
});

export const Board = mongoose.model("Board", boardSchema);

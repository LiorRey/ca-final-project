import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      required: true,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

listSchema.set("toJSON", { virtuals: true });

listSchema.virtual("cards", {
  ref: "Card",
  localField: "_id",
  foreignField: "listId",
});

export const List = mongoose.model("List", listSchema);

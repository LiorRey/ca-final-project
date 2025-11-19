import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  labels: [String],
  assignedTo: [String],
  dueDate: Number,
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

const Card = mongoose.model("Card", cardSchema);

export default Card;

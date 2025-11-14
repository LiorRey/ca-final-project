import mongoose from 'mongoose';

/**
 * Card Schema
 * Simple schema for cards with title, description, labels, assigned users, and due date
 */
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

// Export the model
const Card = mongoose.model('Card', cardSchema);

export default Card;

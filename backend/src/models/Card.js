import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
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
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.pre("save", function (next) {
  if (!this.isNew && this.isModified("text")) {
    this.isEdited = true;
  }
  next();
});

const cardSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "List",
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
    labelIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    assignees: [
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
    archivedAt: {
      type: Date,
      default: null,
    },
    startDate: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

cardSchema.pre("save", function (next) {
  const error = validateDateOrder(this.startDate, this.dueDate);
  if (error) return next(error);
  next();
});

// Validation for .findByIdAndUpdate() and .findOneAndUpdate()
cardSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  const startDateUpdate = update.$set?.startDate || update.startDate;
  const dueDateUpdate = update.$set?.dueDate || update.dueDate;

  if (startDateUpdate !== undefined || dueDateUpdate !== undefined) {
    const doc = await this.model.findOne(this.getFilter());
    if (!doc) return next();

    const startDate = startDateUpdate
      ? new Date(startDateUpdate)
      : doc.startDate;
    const dueDate = dueDateUpdate ? new Date(dueDateUpdate) : doc.dueDate;

    const error = validateDateOrder(startDate, dueDate);
    if (error) return next(error);
  }

  next();
});

function validateDateOrder(startDate, dueDate) {
  if (startDate && dueDate && startDate > dueDate) {
    const error = new mongoose.Error.ValidationError();
    error.addError(
      "dueDate",
      new mongoose.Error.ValidatorError({
        path: "dueDate",
        message: "Due date must be after or equal to start date",
        value: dueDate,
      })
    );
    return error;
  }
  return null;
}

cardSchema.index({ listId: 1, position: 1 }, { unique: true });

export const Card = mongoose.model("Card", cardSchema);

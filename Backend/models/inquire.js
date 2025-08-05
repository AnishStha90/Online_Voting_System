const mongoose = require("mongoose");

const inquireSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    replied: { type: Boolean, default: false },
  },
  { timestamps: true }  // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Inquire", inquireSchema);

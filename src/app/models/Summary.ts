import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: {
      type: String,
    },
    sent: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default SummarySchema;

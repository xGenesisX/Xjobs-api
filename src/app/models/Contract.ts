import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Client ID field can't be empty",
      ref: "User",
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Job ID field can't be empty",
      ref: "Gig",
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Freelancer ID field can't be empty",
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: ["In Escrow", "Refunded", "Paid", "Rejected", "Refund", "Release"],
      default: "In Escrow",
    },
    txHash: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    releaseFunds: {
      type: Boolean,
      default: false,
    },
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
    },
  },
  { timestamps: true }
);

const Contract =
  mongoose.models.Contract || mongoose.model("Contract", contractSchema);
export default Contract;

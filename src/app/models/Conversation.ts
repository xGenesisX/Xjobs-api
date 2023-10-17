import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    group: { type: Boolean, default: false },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
    summary: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Summary",
    },
    unread: {
      type: Number,
      default: 0,
    },
    gigDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
    proposalID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
    },
    contractID: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
  },
  {
    timestamps: true,
  }
);

const conversation =
  mongoose.models.conversation ||
  mongoose.model("conversation", conversationSchema);

export default conversation;

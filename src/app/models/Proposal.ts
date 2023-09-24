import mongoose from "mongoose";

const ProposalSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      default: null,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
  },
  { timestamps: true }
);

const Proposal =
  mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);

export default Proposal;

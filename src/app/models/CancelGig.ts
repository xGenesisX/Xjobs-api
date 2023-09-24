import mongoose from "mongoose";

const cancelSchema = new mongoose.Schema(
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
    contractID: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Contract ID field can't be empty",
      ref: "Contract",
    },
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
    },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

const CancelGig =
  mongoose.models.CancelGig || mongoose.model("CancelGig", cancelSchema);
export default CancelGig;

import CancelGig from "../models/CancelGig";
import mongoose from "mongoose";
class cancelGigService {
  // cancel a gig
  cancelGig = async (
    clientId: mongoose.Schema.Types.ObjectId,
    gigId: mongoose.Schema.Types.ObjectId,
    freelancerId: mongoose.Schema.Types.ObjectId,
    contractID: mongoose.Schema.Types.ObjectId,
    conversationID: mongoose.Schema.Types.ObjectId,
    reason: string
  ) => {
    const newCancellationRequest = new CancelGig({
      clientId: clientId,
      gigId: gigId,
      freelancerId: freelancerId,
      contractID: contractID,
      conversationID: conversationID,
      reason: reason,
    });

    await newCancellationRequest.save();
  };
}

export default new cancelGigService();

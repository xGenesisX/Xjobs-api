import CancelGig from "../models/CancelGig";
import mongoose from "mongoose";
class cancelGigService {
  // cancel a gig
  cancelGig = async (
    clientId: mongoose.Types.ObjectId,
    gigId: mongoose.Types.ObjectId,
    freelancerId: mongoose.Types.ObjectId,
    contractID: mongoose.Types.ObjectId,
    conversationID: mongoose.Types.ObjectId,
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

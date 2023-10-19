import mongoose, { Document, model } from "mongoose";
import { IUser } from "./User";
import { IConversation } from "./Conversation";
import { IGig } from "./Gig";

export type TProposal = {
  freelancerId: IUser["_id"];
  conversationID: IConversation["_id"];
  coverLetter: string;
  accepted: boolean;
  gigId: IGig["_id"];
};

export interface IProposal extends TProposal, Document {}

const ProposalSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
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

const Proposal = model<IProposal>("Proposal", ProposalSchema);

export default Proposal;

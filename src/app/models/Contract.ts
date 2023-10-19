import mongoose, { Document } from "mongoose";
import { IUser } from "./User";
import { IGig } from "./Gig";
import { IConversation } from "./Conversation";

export type TContract = {
  clientId: IUser["_id"];
  gigId: IGig["_id"];
  freelancerId: IUser["_id"];
  status: string;
  txHash: string;
  amount: number;
  releaseFunds: boolean;
  conversationID: IConversation["_id"];
};

export interface IContract extends TContract, Document {}

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
      ref: "Conversation",
    },
  },
  { timestamps: true }
);

const Contract =
  mongoose.models.Contract || mongoose.model("Contract", contractSchema);
export default Contract;

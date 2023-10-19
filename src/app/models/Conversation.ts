import mongoose, { Document, model } from "mongoose";
import { IUser } from "./User";
import { IMessage } from "./Message";
import { ISummary } from "./Summary";
import { IGig } from "./Gig";
import { IProposal } from "./Proposal";
import { IContract } from "./Contract";

export type TConversation = {
  createdBy: IUser["_id"];
  lastMessage: IMessage["_id"];
  members: IUser["_id"];
  group: boolean;
  modifiedAt: number;
  summary: ISummary["_id"];
  unread: number;
  gigDetails: IGig["_id"];
  proposalID: IProposal["_id"];
  contractID: IContract["_id"];
};

export interface IConversation extends TConversation, Document {}

const conversationSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
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

const Conversation = model<IConversation>("Conversation", conversationSchema);

export default Conversation;

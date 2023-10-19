import mongoose, { Document } from "mongoose";
import { IConversation } from "./Conversation";
import { IUser } from "./User";

export type TMessage = {
  converssationID: IConversation["_id"];
  sender: IUser["_id"];
  message: string;
  sent: number;
  read: number;
};

export interface IMessage extends TMessage, Document {}

const messagesSchema = new mongoose.Schema(
  {
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 0,
      maxlength: 3500,
    },
    sent: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const messages =
  mongoose.models.messages || mongoose.model("messages", messagesSchema);

export default messages;

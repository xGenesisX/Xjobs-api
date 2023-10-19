import mongoose, { Document, model } from "mongoose";
import { IUser } from "./User";

export type TSummary = {
  sender: IUser["_id"];
  summary?: string;
  sent?: number;
};

export interface ISummary extends TSummary, Document {}

const SummarySchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: {
      type: String,
    },
    sent: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Summary = model<ISummary>("Summary", SummarySchema);

export default Summary;

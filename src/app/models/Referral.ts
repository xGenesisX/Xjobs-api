import mongoose, { Document, model } from "mongoose";
import { IUser } from "./User";

export type TReferral = {
  referralId: string;
  referralLink: string;
  userId: IUser["_id"];
  createdBy: number;
};

export interface IReferral extends TReferral, Document {}

const ReferralSchema = new mongoose.Schema({
  referralId: {
    type: String,
    unique: true,
  },
  referralLink: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Referral = model<IReferral>("Referral", ReferralSchema);

export default Referral;

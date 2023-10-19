import mongoose, { Document, model } from "mongoose";
import { IUser } from "./User";
import { IProposal } from "./Proposal";
import { IContract } from "./Contract";

export type TGig = {
  owner: IUser["_id"];
  currency: string;
  ownerAddress: string;
  slug: string;
  title: string;
  clientName: string;
  company: string;
  timezone: any;
  category: any;
  gig_description: string;
  skills_required: any;
  payment_type: string;
  date_due: any;
  experience_level: string;
  url: string;
  timeframe: string;
  approvedForMenu: boolean;
  isActive: boolean;
  featured: boolean;
  isAwarded: boolean;
  awardedFreelancer: IUser["_id"];
  proposals: IProposal["_id"];
  status: string;
  price: number;
  contractId: IContract["_id"];
};

export interface IGig extends TGig, Document {}

const GigSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    currency: {
      type: String,
      enum: ["solana", "usd"],
      required: true,
    },
    ownerAddress: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    timezone: {
      type: Object,
      default: {},
      required: true,
    },
    category: {
      type: Object,
      default: {},
      required: true,
    },
    gig_description: {
      type: String,
      required: true,
      minlength: 40,
      maxlength: 3500,
      trim: true,
    },
    skills_required: {
      type: [Object],
      default: [],
      required: true,
    },
    payment_type: {
      type: String,
      enum: ["fixed", "hourly"],
    },
    date_due: {
      type: Date,
    },
    experience_level: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
    },
    url: {
      type: String,
      required: false,
    },
    timeframe: {
      type: String,
      enum: ["short", "medium", "long"],
      required: "A job must have a duration",
    },
    approvedForMenu: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isAwarded: {
      type: Boolean,
      default: false,
    },
    awardedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    proposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proposal",
        default: [],
      },
    ],
    status: {
      type: String,
      required: true,
      enum: [
        "listed",
        "Pending",
        "Active",
        "Processing",
        "Completed",
        "Cancelled",
        "Refund",
      ],
      default: "listed",
    },
    price: {
      type: Number,
      min: [1, "budget should more than 1sol"],
    },
    contractId: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
  },
  { timestamps: true }
);

const Gig = model<IGig>("Gig", GigSchema);

export default Gig;

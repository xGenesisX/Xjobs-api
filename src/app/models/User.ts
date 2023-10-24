import mongoose, { Document, model, Schema } from "mongoose";
import { roles } from "../config/roles";
import { IGig } from "./Gig";
import { INotification } from "./Notification";

export type TUser = {
  profileId?: string;
  isAdmin?: boolean;
  address?: string;
  company?: string;
  user_image?: any;
  name?: string;
  dateOfBirth?: any;
  timezone?: any;
  email_address?: string;
  verified?: boolean;
  banned?: boolean;
  profile_details_description?: string;
  job_category?: any;
  skills?: any;
  isAvailable?: boolean;
  role?: string;
  socials?: any;
  expertiseLevel?: string;
  hourlyRate?: number;
  gigs?: IGig["_id"];
  submittedProposals?: [string];
  notifications?: INotification["_id"];
  completedGigs?: IGig["_id"];
  bookmarkedGigs?: IGig["_id"];
  feedbacks?: any;
  userPoints?: number;
};

export interface IUser extends TUser, Document {}

const UserSchema = new Schema(
  {
    profileId: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      trim: true,
      unique: true,
    },
    company: {
      type: String,
    },
    user_image: {
      type: Object,
      default: {},
    },
    name: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    timezone: {
      type: Object,
      default: {},
    },
    email_address: { type: String, default: null, unique: true },
    verified: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    profile_details_description: {
      type: String,
    },
    job_category: { type: Object, default: {} },
    skills: {
      type: Array,
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: roles,
      default: "freelancer",
    },
    socials: {
      type: Object,
      default: {},
    },
    expertiseLevel: {
      type: String,
      default: "entry level",
    },
    hourlyRate: {
      type: Number,
      // required: "Hourly rate field can't be empty",
      default: 10,
    },
    gigs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig",
      },
    ],
    submittedProposals: { type: [String] },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    completedGigs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig",
      },
    ],
    bookmarkedGigs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig",
      },
    ],
    feedbacks: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        rate: {
          type: Number,
          min: 0,
          max: 5,
        },
      },
    ],
    userPoints: {
      type: Number,
      default: 0,
      max: 10_000,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);

export default User;

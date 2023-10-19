import mongoose, { Document, model } from "mongoose";
import { IUser } from "./User";

export type TNotification = {
  freelancerId: IUser["_id"];
  message: string;
  date: string;
  gigLink: string;
  read: boolean;
};

export interface INotification extends TNotification, Document {}

const notificationSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    gigLink: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;

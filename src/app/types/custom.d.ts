import mongoose, { ObjectId } from "mongoose";

declare namespace Express {
  export interface Request {
    currentUser?: { user_id: mongoose.Types.ObjectId; address: string };
  }
}

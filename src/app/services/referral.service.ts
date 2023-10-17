import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Referral from "../models/Referral";

export class referralService {
  checkReferrer = async (id: mongoose.Schema.Types.ObjectId) => {
    const ref = await Referral.findById(id).populate({ path: "userId" });

    //If referral is not found, throw error.
    if (!ref) {
      throw new Error("Invalid Referral");
    }
    return ref;
  };
  createNewReferral = async (userId: mongoose.Schema.Types.ObjectId) => {
    const newReferrer = new Referral({
      referralId: uuidv4(),
      referralLink: uuidv4(),
      userId: userId,
    });
    //save referral to the database and redirect to login
    await newReferrer.save();
  };
}

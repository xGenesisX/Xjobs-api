import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import { sendAccountCreated } from "./email.service";
import Joi from "@hapi/joi";
import mongoose from "mongoose";

class profileController {
  // @notice update a user profile, adds feedback
  addFeedbackToUserProfile = async (
    title: string,
    description: string,
    rate: number,
    gigId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
  ) => {
    const feedback = {
      title: title,
      description: description,
      rate: rate,
      gigId: gigId,
    };

    try {
      const user = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          $addToSet: { feedbacks: feedback },
        },
        {
          new: true,
        }
      );
      return user;
    } catch (error) {
      return error;
    }
  };

  // @notice get a specific user by its id
  getUserProfileWithId = async (userId: mongoose.Schema.Types.ObjectId) => {
    try {
      const user = await User.findOne({ _id: userId });
      return user;
    } catch (error) {
      return error;
    }
  };

  // @notice get a specific user by its id
  getUserWithId = async (userId: mongoose.Types.ObjectId) => {
    try {
      const user = await User.findOne({ _id: userId });
      return user;
    } catch (error) {
      return error;
    }
  };

  // @notice get a specific user by its registered address
  getUserProfileWithAddress = async (userAddress: string) => {
    try {
      const user = await User.findOne({ userAddress });
      return user;
    } catch (error) {
      return error;
    }
  };

  // @notice create a new user profile
  createUserProfile = async (
    profileId: string,
    isAdmin: boolean,
    address: string,
    company: string,
    user_image: any,
    name: string,
    dateOfBirth: string,
    timezone: any,
    email_address: string,
    profile_details_description: string,
    socials: any
  ) => {
    const verificationToken = uuidv4().toString();

    try {
      const newUser = new User({
        profileId: profileId,
        isAdmin: isAdmin,
        address: address,
        company: company,
        user_image: user_image,
        name: name,
        dateOfBirth: dateOfBirth,
        timezone: timezone,
        email_address: email_address,
        profile_details_description: profile_details_description,
        socials: socials,
        emailVerificationToken: verificationToken,
      });
      // Use Promise.allSettled to execute multiple async operations in parallel
      const onboard = await Promise.all([
        newUser.save(),
        sendAccountCreated(email_address, name),
      ]);
      // Check if all operations were successful
      if (onboard) {
        return newUser._id;
      } else {
        // If any operation fails, delete the user and return an error
        // will likely fail if the user already exists
        await User.deleteOne({ _id: newUser._id });
        return "error parsing request";
      }
    } catch (error) {
      return error;
    }
  };

  // @notice updates a user profile
  updateUserProfile = async (id: string) => {
    const userExists = await User.findOneAndUpdate(
      { _id: id },
      {
        // ...req.body,
      },
      {
        new: true,
      }
    );
    return userExists;
  };
}

export default new profileController();

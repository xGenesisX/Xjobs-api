import { v4 as uuidv4 } from "uuid";
import User, { TUser } from "../models/User";
import { sendAccountCreated } from "./email.service";
import mongoose from "mongoose";
import pointsService from "./points.service";
import * as jwt from "jsonwebtoken";

class profileController {
  // @notice update a user profile, adds feedback
  addFeedbackToUserProfile = async (
    title: string,
    description: string,
    rate: number,
    gigId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ) => {
    const feedback = {
      title: title,
      description: description,
      rate: rate,
      gigId: gigId,
    };

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
  };

  // @notice get a specific user by its id
  getUserProfileWithId = async (userId: mongoose.Types.ObjectId) => {
    const user = await User.findById(userId);
    return user;
  };

  // @notice get a specific user by its registered address
  getUserProfileWithAddress = async (userAddress: string) => {
    const user = await User.findOne({ userAddress });

    const token = jwt.sign(
      { user_id: user?._id, address: user?.address },
      "JSONXJOBSKEY$",
      {
        expiresIn: "24h",
      }
    );

    if (user) {
      user.token = token;
      const newUser = await user?.save();
      return newUser;
    }

    return user;
  };

  // @notice create a new user profile
  createUserProfile = async (
    profileId: mongoose.Types.ObjectId,
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

    const token = jwt.sign({ user_id: newUser._id, address }, "JSONXJOBSKEY$", {
      expiresIn: "24h",
    });

    newUser.token = token;
    // Use Promise.allSettled to execute multiple async operations in parallel
    const onboard = await Promise.all([
      newUser.save(),
      sendAccountCreated(email_address, name),
      pointsService.createFreelancerAccount(newUser._id),
    ]);
    // Check if all operations were successful
    if (onboard) {
      newUser;
      return newUser;
    } else {
      // If any operation fails, delete the user and return an error
      // will likely fail if the user already exists
      await User.deleteOne({ _id: newUser._id });
      return "error parsing request";
    }
  };

  // @notice updates a user profile
  updateUserProfile = async (
    id: mongoose.Types.ObjectId,
    profileField: TUser
  ) => {
    const userExists = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: profileField,
      },
      {
        new: true,
      }
    );
    return userExists;
  };
}

export default new profileController();

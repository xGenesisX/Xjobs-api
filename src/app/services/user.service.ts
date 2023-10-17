import { v4 as uuidv4 } from "uuid";
import { IOptions, QueryResult } from "../utils/paginate";
import User from "../models/User";
import ApiError from "../utils/ApiError";

import ChatController from "./conversation.service";
import { sendResetPasswordEmail } from "./email.service";
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
    // const schema = Joi.object().keys({
    //   name: Joi.string().required(),
    // });

    // if (!schema.validate(req.body)) {
    //   return { error: "Validation fails" };
    // }

    // add validation for the user input here

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
        // new ChatController(req, res).convoPostHandler(
        //   new mongoose.Types.ObjectId('64073a3334365f04f6854e69'),
        //   newUser._id,
        //   new mongoose.Types.ObjectId('64073a3334365f04f6854e69'),
        //   `Hey ${newUser.name},\nWelcome to XJobs! 👋\nHere you'll be able to send and receive messages about your projects on XJobs. In the sidebar to the right, you'll see next steps you'll need to take in order to move forward.\nWe're so happy you're here! 🚀`,
        //   true
        // ),
        // new Email(newUser.email_address, newUser.name).sendWelcome(),
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
    // const { id } = req.body;
    // add other user fields to be updated
    // add validaton here as well...

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

    // if (!userExists) {
    //   // res.status(400).json('user not found');
    //   return 'user not found';
    // } else {
    //   // Promise.all([userExists()]);
    //   // send a mail to ther user confirming thier profile has been updated
    // }
  };

  /**
   * Query for users
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @returns {Promise<QueryResult>}
   */
  queryusers = async (filter: Record<string, any>, options: IOptions) => {
    // const users = await User.paginate(filter, options);
    // return users;
  };
}

export default new profileController();

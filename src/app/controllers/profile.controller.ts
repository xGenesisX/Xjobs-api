import { Request, Response } from "express";
import mongoose from "mongoose";
import ChatController from "../services/conversation.service";
import userService from "../services/user.service";
import catchAsync from "../utils/catchAsync";

// @notice update a user profile, adds feedback
export const addFeedbackToUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { title, description, rate, gigId, userId } = req.body;

    try {
      const user = userService.addFeedbackToUserProfile(
        title,
        description,
        rate,
        gigId,
        userId
      );
      res.send(user);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

// @notice get a specific user by its id
export const getUserProfileWithId = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
      const user = await userService.getUserProfileWithId(userId);
      res.send(user);
    } catch (error) {
      res.send(error);
    }
  }
);

// @notice get a specific user by its registered address
export const getUserProfileWithAddress = catchAsync(
  async (req: Request, res: Response) => {
    const { userAddress } = req.body;

    try {
      const user = await userService.getUserProfileWithAddress(userAddress);
      res.send(user);
    } catch (error) {
      res.send(error);
    }
  }
);

// @notice create a new user profile
export const createUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    const {
      profileId,
      isAdmin,
      address,
      company,
      user_image,
      name,
      dateOfBirth,
      timezone,
      email_address,
      profile_details_description,
      socials,
    } = req.body;

    try {
      const user = await userService.createUserProfile(
        profileId,
        isAdmin,
        address,
        company,
        user_image,
        name,
        dateOfBirth,
        timezone,
        email_address,
        profile_details_description,
        socials
      );
      new ChatController(req, res).convoPostHandler(
        new mongoose.Types.ObjectId("64073a3334365f04f6854e69"),
        user._id,
        new mongoose.Types.ObjectId("64073a3334365f04f6854e69"),
        `Hey ${name},\nWelcome to XJobs! 👋\nHere you'll be able to send and receive messages about your projects on XJobs. In the sidebar to the right, you'll see next steps you'll need to take in order to move forward.\nWe're so happy you're here! 🚀`,
        true
      ),
        res.send(user);
    } catch (error) {
      res.status(400).json("internal server error");
    }
  }
);

// @notice updates a user profile
export const updateUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.body;
    // add other user fields to be updated
    // add validaton here as well...

    const userExists = await userService.updateUserProfile(id);

    if (!userExists) {
      res.status(400).json("user not found");
    }
  }
);

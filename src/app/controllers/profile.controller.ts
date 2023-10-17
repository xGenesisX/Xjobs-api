import { Request, Response } from "express";
import Joi from "@hapi/joi";
import catchAsync from "../utils/catchAsync";
import userService from "../services/user.service";

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

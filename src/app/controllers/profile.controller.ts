import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { TUser } from "../models/User";
import ChatController from "../services/conversation.service";
import userService from "../services/user.service";
import catchAsync from "../utils/catchAsync";
import * as jwt from "jsonwebtoken";
import { CustomRequest } from "../middleware/authHandler";

// @notice update a user profile, adds feedback
export const addFeedbackToUserProfile = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const auth = req.currentUser;

    if (auth) {
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
    } else {
      res.status(403).json({ status: "error", message: "Not authorized" });
    }
  }
);

// @notice get a specific user by its id
export const getUserProfileWithId = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const auth = req.currentUser;
    console.log(auth);
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { userId } = req.body;

      if (userId) {
        try {
          const user = await userService.getUserProfileWithId(userId);
          return res.status(200).json({ status: "success", data: user });
        } catch (error) {
          return res.status(404).json({ status: "error", error: error });
        }
      } else {
        const { user_id } = auth;

        if (user_id) {
          try {
            const user = await userService.getUserProfileWithId(user_id);
            return res.status(200).json({ status: "success", data: user });
          } catch (error) {
            return res.status(404).json({ status: "error", error: error });
          }
        } else {
          res.status(404).json({ message: "Expired" });
        }
      }
    }
  }
);

// @notice get a specific user by its registered address
export const getUserProfileWithAddress = catchAsync(
  async (req: Request, res: Response) => {
    const { userAddress } = req.body;

    if (userAddress) {
      try {
        const user = await userService.getUserProfileWithAddress(userAddress);
        res.send(user);
      } catch (error) {
        res.send(error);
      }
    } else {
      res
        .status(400)
        .json({ status: "error", message: "userAddress is undefined" });
    }
  }
);

// @notice create a new user profile
export const createUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    // console.log(req.body);

    // let token = getToken({ req });
    // if (!token) {
    //   return res.status(httpStatus.UNAUTHORIZED);
    // } else {
    console.log(req.body);
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

      if (user !== "error parsing request") {
        console.log("Reached Here");
        // new ChatController(req, res).convoPostHandler(
        //   new mongoose.Types.ObjectId("64073a3334365f04f6854e69"),
        //   user._id,
        //   new mongoose.Types.ObjectId("64073a3334365f04f6854e69"),
        //   `Hey ${name},\nWelcome to XJobs! 👋\nHere you'll be able to send and receive messages about your projects on XJobs. In the sidebar to the right, you'll see next steps you'll need to take in order to move forward.\nWe're so happy you're here! 🚀`,
        //   true
        // ),
        res.send(user);
      } else {
        console.log("Error 1");
        return res.status(400).json("internal server error");
      }
    } catch (error) {
      console.log(error);
      res.status(400).json("internal server error");
    }
  }
  // }
);

// @notice updates a user profile
export const updateUserProfile = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const auth = req.currentUser;

    if (auth) {
      const { id } = req.body;

      const profileFields: TUser = {
        profileId: id,
      };

      const userExists = await userService.updateUserProfile(id, profileFields);

      res.send(userExists);

      if (!userExists) {
        res.status(400).json("user not found");
      }
    } else {
      res
        .status(404)
        .json({ status: "error", message: "Must be authenticated" });
    }
  }
);

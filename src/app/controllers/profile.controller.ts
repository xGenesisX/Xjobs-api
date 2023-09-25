import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import ChatController from "./chat.controller";
import User from "../models/User";
import Email from "../utils/mailer";
import Joi from "@hapi/joi";

class profileController {
  constructor() {}

  // @notice update a user profile, adds feedback
  addFeedbackToUserProfile = async (req: Request, res: Response) => {
    const { title, description, rate, gigId, userId } = req.body;

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
      return res.status(400).json("error updating profile");
    }
  };

  // @notice get a specific user by its id
  getUserProfileWithId = async (req: Request) => {
    const { userId } = req.body;
    try {
      const user = await User.findOne({ _id: userId });
      return user;
    } catch (error) {
      return "error getting user";
    }
  };

  // @notice get a specific user by its registered address
  getUserProfileWithAddress = async (req: Request, res: Response) => {
    const { userAddress } = req.body;

    try {
      const user = await User.findOne({ userAddress });
      return user;
    } catch (error) {
      return res.status(400).json("error getting user");
    }
  };

  // @notice create a new user profile
  createUserProfile = async (req: Request, res: Response) => {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
    });

    if (!schema.validate(req.body)) {
      return { error: "Validation fails" };
    }

    // add validation for the user input here

    const verificationToken = uuidv4().toString();

    try {
      const newUser = new User({
        ...req.body,
        emailVerificationToken: verificationToken,
      });
      // Use Promise.allSettled to execute multiple async operations in parallel
      //   const [user, conversation, email] = await Promise.all([
      //     newUser.save(),
      //     ChatController.convoPostHandler({
      //       body: {
      //         client: "64073a3334365f04f6854e69",
      //         freelancer: newUser._id,
      //         sender: "64073a3334365f04f6854e69",
      //         group: true,
      //         message: `Hey ${newUser.name},\nWelcome to XJobs! 👋\nHere you'll be able to send and receive messages about your projects on XJobs. In the sidebar to the right, you'll see next steps you'll need to take in order to move forward.\nWe're so happy you're here! 🚀`,
      //       },
      //     } as Request),
      //     new Email(
      //       { name: newUser.name, email: newUser.email_address },
      //       this.url
      //     ).sendWelcome(),
      //   ]);
      // Check if all operations were successful
      if (
        // user.status === "fulfilled" &&
        // conversation.status === "fulfilled" &&
        // email.status === "fulfilled"
        // user &&
        // email
        true
      ) {
        return newUser;
      } else {
        // If any operation fails, delete the user and return an error
        // will likely fail if the user already exists
        await User.deleteOne({ _id: newUser._id });
        return res.status(400).json("error parsing request");
      }
    } catch (error) {
      return { message: "internal server error" };
    }
  };

  // @notice updates a user profile
  updateUserProfile = async (req: Request, res: Response) => {
    const { id } = req.body;
    // add other user fields to be updated
    // add validaton here as well...

    const userExists = await User.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (!userExists) {
      return res.status(400).json("user not found");
    } else {
      Promise.all([userExists()]);
      // send a mail to ther user confirming thier profile has been updated
    }
  };
}

export default new profileController();

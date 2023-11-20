// import httpStatus from "http-status";
// import Joi from "@hapi/joi";
import Ably from "ably/promises";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { getToken } from "next-auth/jwt";
import pako from "pako";
import profileController from "./user.service";
import {
  default as conversation,
  default as convo,
} from "../models/Conversation";
import Message from "../models/Message";
import mongoose from "mongoose";
import config from "../config/config";

dotenv.config({ path: "../../.env" });

class ChatController {
  ably_key: string;
  rest: Ably.Rest;
  url: string;
  token: any;
  constructor(req: Request, res: Response) {
    this.ably_key = config.ablyUrl;
    this.rest = new Ably.Rest(this.ably_key);
    this.url = `${req.protocol}://${req.get("host")}/chat`;
    this.token = getToken({ req });

    this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });
  }

  // @notice create a new message, update a conversation, send notification mail to user
  chatPostHandler = async (
    sender: mongoose.Types.ObjectId,
    message: string,
    conversationID: mongoose.Types.ObjectId,
    userID: mongoose.Types.ObjectId
  ): Promise<mongoose.Types.ObjectId> => {
    // add Joi validation
    // const schema = Joi.object({
    //   name: Joi.string().required().min(1).max(10),
    //   age: Joi.number().integer().min(1).max(10),
    // });

    const newMessage = new Message({
      sender: sender,
      message: message,
      conversationID: conversationID,
    });

    const savedMessage = await newMessage.save();

    const compressedMessage = pako.deflate(JSON.stringify(savedMessage));

    const channel = this.rest.channels.get(`chat${conversationID}`);

    await Promise.all([
      channel.publish("update-chat", compressedMessage),
      this.conversationPutHandler(conversationID, savedMessage._id, 1),
      profileController.getUserProfileWithId(userID).then((user) => {
        // new Email(user.email_address, user.name).NewMessageNotification();
      }),
    ]);

    return savedMessage._id;
  };

  // @notice get chat message by id
  getChatHandler = async (id: mongoose.Types.ObjectId) => {
    // add validation here

    const message = await Message.find({ conversationID: id });

    if (message.length == 0) {
      return { error: "Conversation does not exist" };
    }

    return message;
  };

  // @notice update a conversation with a message and read count
  conversationPutHandler = async (
    id: mongoose.Types.ObjectId,
    lastMessage: mongoose.Types.ObjectId,
    unread: number
  ) => {
    // add Joi validation

    const convoCurrentUnread = await convo.findById(id);
    const convoo = await convo
      .findOneAndUpdate(
        { _id: id },
        {
          // unread: convoCurrentUnread.unread + unread,
          lastMessage: lastMessage,
        },
        {
          new: true,
        }
      )
      .sort({ updatedAt: -1 })
      .populate("lastMessage members gigDetails summary.sender")
      .populate({
        path: "gigDetails",
        populate: { path: "awardedFreelancer", model: "User" },
      });

    const compressedConvoo = pako.deflate(JSON.stringify(convoo));

    const channel = this.rest.channels.get(`conversations`);
    await channel.publish("update-convo", compressedConvoo);

    return convoo;
  };

  // @notice create a new conversation, if it doesnt previosly exist
  convoPostHandler = async (
    client: mongoose.Types.ObjectId,
    freelancer: mongoose.Types.ObjectId,
    sender: mongoose.Types.ObjectId,
    message: string,
    group: boolean,
    proposalID?: mongoose.Types.ObjectId,
    gigDetails?: mongoose.Types.ObjectId
  ) => {
    await convo
      .exists({
        members: [client, freelancer],
        gigDetails: gigDetails,
      })
      .then(() => {
        return convo
          .findOne({ members: [client, freelancer] })
          .populate("lastMessage members gigDetails");
      })
      .finally(() => {
        const newConvo = new convo({
          createdBy: client,
          members: [client, freelancer],
          gigDetails: gigDetails,
          group: group,
          proposalID: proposalID,
        });

        const savedConvo = newConvo.save();

        return savedConvo;
      });
  };

  // @notice get most recent converstions of a user by id
  getConversationHandler = async (id: mongoose.Types.ObjectId) => {
    const conv = await convo
      .find({ members: id })
      .sort({ updatedAt: -1 })
      .populate("members lastMessage summary.sender gigDetails")
      .populate({
        path: "gigDetails",
        populate: { path: "awardedFreelancer", model: "User" },
      });

    return conv;
  };

  // @notice get a conversation by id
  getConvoById = async (id: mongoose.Types.ObjectId) => {
    const conv = await convo.findById(id).populate("members gigDetails");
    return conv;
  };

  // @notice add a contract id to a conversation
  addContractIdToConvo = async (
    id: mongoose.Types.ObjectId,
    contractId: mongoose.Types.ObjectId
  ) => {
    const convoo = await convo.findOneAndUpdate(
      { _id: id },
      {
        contractID: contractId,
      },
      {
        new: true,
      }
    );

    return convoo;
  };

  // @notice get most recent conversation for a user
  getMostRecentConvo = async (id: mongoose.Types.ObjectId) => {
    const conv = await convo.findOne({ members: id }).sort({ createdAt: -1 });
    return conv;
  };

  // @notice mark a conversation as read by id
  markAsRead = async (id: mongoose.Types.ObjectId) => {
    await convo.exists({ _id: id }).then(() => {
      const convoo = convo
        .findOneAndUpdate(
          { _id: id },
          {
            $set: {
              unread: 0,
            },
          },
          {
            new: true,
            timestamps: false,
          }
        )
        .populate("members lastMessage summary.sender gigDetails")
        .populate({
          path: "gigDetails",
          populate: { path: "awardedFreelancer", model: "User" },
        });

      const compressedConvoo = pako.deflate(JSON.stringify(convoo));

      const channel = this.rest.channels.get(`conversations`);
      channel.publish("update-convo", compressedConvoo);

      return convoo;
    });
  };

  // @notice make a new summary
  summaryPostHandler = async (
    conversationID: mongoose.Types.ObjectId,
    summaryText: string,
    sender: mongoose.Types.ObjectId
  ) => {
    const updatedConvo = await conversation
      .findOneAndUpdate(
        { _id: conversationID },
        { $addToSet: { summary: { sender: sender, summary: summaryText } } },
        {
          new: true,
          timestamps: false,
        }
      )
      .sort({ updatedAt: -1 })
      .populate("lastMessage members gigDetails summary.sender")
      .populate({
        path: "gigDetails",
        populate: { path: "awardedFreelancer", model: "User" },
      });

    const compressedConvoo = pako.deflate(JSON.stringify(updatedConvo));

    const channel = this.rest.channels.get(`conversations`);
    await channel.publish("update-convo", compressedConvoo);

    return updatedConvo;
  };
}

export default ChatController;

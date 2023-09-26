import Ably from "ably/promises";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { getToken } from "next-auth/jwt";
import pako from "pako";
import Email from "../utils/mailer";
import Joi from "@hapi/joi";
import profileController from "./profile.controller";
import {
  default as conversation,
  default as convo,
} from "../models/Conversation";
import Message from "../models/Message";
// import expressValidator from "express-validator";

// const validator = expressValidator.check();

dotenv.config({ path: "../../.env" });

class ChatController {
  ably_key: string;
  rest: Ably.Rest;
  url: string;
  token: any;
  constructor(req: Request, res: Response) {
    this.ably_key = process.env.ABLY_API_KEY + "";
    this.rest = new Ably.Rest(this.ably_key);
    this.url = `${req.protocol}://${req.get("host")}/chat`;
    this.token = getToken({ req });
  }

  chatPostHandler = async (
    sender: any,
    message: any,
    conversationID: any,
    userID: any
  ) => {
    // let { sender, message, conversationID, userID } = req.body;
    // add Joi validation
    // const schema = Joi.object({
    //   name: Joi.string().required().min(1).max(10),
    //   age: Joi.number().integer().min(1).max(10),
    // });

    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    try {
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
        await profileController.getUserWithId(userID).then((user) => {
          new Email(user.email_address, user.name).NewMessageNotification();
        }),
      ]);

      return { compressedMessage, tokenRequestData };
    } catch (error) {
      return error;
    }
  };

  getChatHandler = async (id: string) => {
    // add validation here

    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    const message = await Message.find({ conversationID: id });

    if (!message.length) {
      return { error: "Conversation does not exist" };
    }
    const compressedMessage = pako.deflate(JSON.stringify(message));

    return { compressedMessage, tokenRequestData };
  };

  conversationPutHandler = async (id: any, lastMessage: any, unread: any) => {
    // add Joi validation

    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    try {
      const convoCurrentUnread = await convo.findById(id);
      const convoo = await convo
        .findOneAndUpdate(
          { _id: id },
          {
            unread: convoCurrentUnread.unread + unread,
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

      return { convoo, tokenRequestData };
    } catch (error) {
      return error;
    }
  };

  convoPostHandler = async (
    client: string,
    freelancer: string,
    sender: string,
    message: string,
    gigDetails: any,
    proposalID: any,
    group: boolean
  ) => {
    // Joi validation

    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    await convo
      .exists({
        members: [client, freelancer],
        gigDetails: gigDetails,
      })
      .then(() => {
        const c = convo
          .findOne({ members: [client, freelancer] })
          .populate("lastMessage members gigDetails");
        return c;
      })
      .catch(() => {
        const newConvo = new convo({
          createdBy: client,
          members: [client, freelancer],
          gigDetails: gigDetails,
          group: group,
          proposalID: proposalID,
        });

        const savedConvo = newConvo.save();

        if (proposalID) {
          ({
            body: { conversationID: savedConvo._id, id: proposalID },
          }) as Request;
        }

        const chat = this.chatPostHandler(sender, message, savedConvo._id, "");

        const finalConvo = this.conversationPutHandler(savedConvo._id, chat, 0);

        return { finalConvo, tokenRequestData };
      });
  };

  getConversationHandler = async (id: string) => {
    // let { id } = req.query;

    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    const conv = await convo
      .find({ members: id })
      .sort({ updatedAt: -1 })
      .populate("members lastMessage summary.sender gigDetails")
      .populate({
        path: "gigDetails",
        populate: { path: "awardedFreelancer", model: "User" },
      });

    const compressedConvoo = pako.deflate(JSON.stringify(conv));

    return { compressedConvoo, tokenRequestData };
  };

  getConvoById = async (id: string) => {
    // const { id } = req.body;
    const conv = await convo.findById(id).populate("members gigDetails");

    const compressedConvoo = pako.deflate(JSON.stringify(conv));

    return compressedConvoo;
  };

  addContractIdToConvo = async (id: any, contractId: any) => {
    // const { id, contractId } = req.body;

    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    try {
      const convoo = await convo.findOneAndUpdate(
        { _id: id },
        {
          contractID: contractId,
        },
        {
          new: true,
        }
      );

      return { convoo, tokenRequestData };
    } catch (error) {
      return error;
    }
  };

  getMostRecentConvo = async (id: any) => {
    // const { id } = req.query;

    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    const conv = await convo.findOne({ members: id }).sort({ createdAt: -1 });
    return { conv, tokenRequestData };
  };

  markAsRead = async (id: any) => {
    // const { id } = req.body;

    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    try {
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

        return { convoo, tokenRequestData };
      });
    } catch (error) {
      return error;
    }
  };

  summaryPostHandler = async (
    conversationID: any,
    summaryText: any,
    sender: any
  ) => {
    const tokenRequestData = await this.rest.auth.createTokenRequest({
      clientId: JSON.stringify(this.token, null, 2),
    });

    try {
      // const { conversationID, summaryText, sender } = req.body;

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

      return { updatedConvo, tokenRequestData };
    } catch (error) {
      return error;
    }
  };
}

export default ChatController;

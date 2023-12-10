import { Request, Response } from "express";
import ChatController from "../services/conversation.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { getToken } from "next-auth/jwt";
import { CustomRequest } from "../middleware/authHandler";

export const chatPostHandler = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    } else {
      const { sender, message, conversationID, userId } = req.body;
      new ChatController(auth.user_id, url).chatPostHandler(
        sender,
        message,
        conversationID,
        userId
      );
    }
  }
);

export const getChatHandler = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;
      new ChatController(auth.user_id, url).getChatHandler(id);
    }
  }
);

export const conversationPutHandler = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id, lastMessage, unread } = req.body;

      new ChatController(auth.user_id, url).conversationPutHandler(
        id,
        lastMessage,
        unread
      );
    }
  }
);

export const convoPostHandler = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const {
        client,
        freelancer,
        sender,
        message,
        group,
        gigDetails,
        proposalId,
      } = req.body;

      new ChatController(auth?.user_id, url).convoPostHandler(
        client,
        freelancer,
        sender,
        message,
        group,
        gigDetails,
        proposalId
      );
    }

    // const chat = await this.chatPostHandler(sender, message, a._id, freelancer);

    // const chat = new ChatController().chatPostHandler(
    //   client,
    //   message,
    //   "",
    //   sender
    // );

    // const finalConvo = this.conversationPutHandler(a._id, chat, 0);

    // return finalConvo;
  }
);

export const getConversationHandler = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;

      new ChatController(auth.user_id, url).getConversationHandler(id);
    }
  }
);

export const getConvoById = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;

      new ChatController(auth.user_id, url).getConvoById(id);
    }
  }
);

export const addContractIdToConvo = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id, contractId } = req.body;

      new ChatController(auth.user_id, url).addContractIdToConvo(
        id,
        contractId
      );
    }
  }
);

export const getMostRecentConvo = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;

      new ChatController(auth.user_id, url).getMostRecentConvo(id);
    }
  }
);

export const markAsRead = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;

      new ChatController(auth.user_id, url).markAsRead(id);
    }
  }
);

export const summaryPostHandler = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { conversationID, summaryText, sender } = req.body;

      new ChatController(auth?.user_id, url).summaryPostHandler(
        conversationID,
        summaryText,
        sender
      );
    }
  }
);

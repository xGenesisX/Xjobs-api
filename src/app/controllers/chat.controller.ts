import { Response } from "express";
import httpStatus from "http-status";
import { CustomRequest } from "../middleware/authHandler";
import ChatController from "../services/conversation.service";
import catchAsync from "../utils/catchAsync";

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

      const a = new ChatController(auth?.user_id, url).convoPostHandler(
        client,
        freelancer,
        sender,
        message,
        group,
        gigDetails,
        proposalId
      );

      const chat = new ChatController(auth?.user_id, url).chatPostHandler(
        client,
        message,
        sender,
        sender
      );

      const MostRecentConvoId = new ChatController(
        auth?.user_id,
        url
      ).getMostRecentConvo((await chat)._id);

      // const finalConvo = new ChatController(
      //   auth?.user_id,
      //   url
      // ).conversationPutHandler((await chat)._id, MostRecentConvoId, 0);

      // return finalConvo;
    }
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

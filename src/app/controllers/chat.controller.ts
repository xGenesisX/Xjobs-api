import { Request, Response } from "express";
import httpStatus from "http-status";
import { getToken } from "next-auth/jwt";
import ChatController from "../services/conversation.service";
import catchAsync from "../utils/catchAsync";

export const chatPostHandler = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { sender, message, conversationID, userId } = req.body;
      new ChatController(token, url).chatPostHandler(
        sender,
        message,
        conversationID,
        userId
      );
    }
  }
);

export const getChatHandler = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;
      new ChatController(token, url).getChatHandler(id);
    }
  }
);

export const conversationPutHandler = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id, lastMessage, unread } = req.body;

      new ChatController(token, url).conversationPutHandler(
        id,
        lastMessage,
        unread
      );
    }
  }
);

export const convoPostHandler = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!token) {
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

      new ChatController(token, url).convoPostHandler(
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
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;

      new ChatController(token, url).getConversationHandler(id);
    }
  }
);

export const getConvoById = catchAsync(async (req: Request, res: Response) => {
  let token = getToken({ req });
  let url = `${req.protocol}://${req.get("host")}/chat`;
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED);
  } else {
    const { id } = req.body;

    new ChatController(token, url).getConvoById(id);
  }
});

export const addContractIdToConvo = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id, contractId } = req.body;

      new ChatController(token, url).addContractIdToConvo(id, contractId);
    }
  }
);

export const getMostRecentConvo = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;

      new ChatController(token, url).getMostRecentConvo(id);
    }
  }
);

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  let token = getToken({ req });
  let url = `${req.protocol}://${req.get("host")}/chat`;
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED);
  } else {
    const { id } = req.body;

    new ChatController(token, url).markAsRead(id);
  }
});

export const summaryPostHandler = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    let url = `${req.protocol}://${req.get("host")}/chat`;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { conversationID, summaryText, sender } = req.body;

      new ChatController(token, url).summaryPostHandler(
        conversationID,
        summaryText,
        sender
      );
    }
  }
);

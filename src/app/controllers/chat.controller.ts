import { Request, Response } from "express";
import ChatController from "../services/conversation.service";
import catchAsync from "../utils/catchAsync";

export const chatPostHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { sender, message, conversationID, userId } = req.body;
    new ChatController(req, res).chatPostHandler(
      sender,
      message,
      conversationID,
      userId
    );
  }
);

export const getChatHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.body;
    new ChatController(req, res).getChatHandler(id);
  }
);

export const conversationPutHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id, lastMessage, unread } = req.body;

    new ChatController(req, res).conversationPutHandler(
      id,
      lastMessage,
      unread
    );
  }
);

export const convoPostHandler = catchAsync(
  async (req: Request, res: Response) => {
    const {
      client,
      freelancer,
      sender,
      message,
      group,
      gigDetails,
      proposalId,
    } = req.body;

    new ChatController(req, res).convoPostHandler(
      client,
      freelancer,
      sender,
      message,
      group,
      gigDetails,
      proposalId
    );

    // const chat = await this.chatPostHandler(sender, message, a._id, freelancer);

    // const finalConvo = this.conversationPutHandler(a._id, chat, 0);

    // return finalConvo;
  }
);

export const getConversationHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.body;

    new ChatController(req, res).getConversationHandler(id);
  }
);

export const getConvoById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;

  new ChatController(req, res).getConvoById(id);
});

export const addContractIdToConvo = catchAsync(
  async (req: Request, res: Response) => {
    const { id, contractId } = req.body;

    new ChatController(req, res).addContractIdToConvo(id, contractId);
  }
);

export const getMostRecentConvo = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.body;

    new ChatController(req, res).getMostRecentConvo(id);
  }
);

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;

  new ChatController(req, res).markAsRead(id);
});

export const summaryPostHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { conversationID, summaryText, sender } = req.body;

    new ChatController(req, res).summaryPostHandler(
      conversationID,
      summaryText,
      sender
    );
  }
);

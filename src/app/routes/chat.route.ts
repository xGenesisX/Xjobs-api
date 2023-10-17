import express, { NextFunction, Request, Response } from "express";

// import { check } from "express-validator";

import ChatController from "../services/message.service";

const router = express.Router();

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.post("/add_contract_id_to_convo", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).addContractIdToConvo);
});

router.post("/get_most_recent_convo", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).getMostRecentConvo);
  // const id = req.query
});

router.post("/conversation_put", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).conversationPutHandler);
});

router.post("/get_conversation", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).getConversationHandler);
});

router.post("/summary_post", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).summaryPostHandler);
});

router.post("/convo_post", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).convoPostHandler);
});

router.post("/chat_post", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).chatPostHandler);
});

router.post("/get_chat", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).getChatHandler);
});

router.post("/mark_as_read", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).markAsRead);
});

router.post("/get_convo_by_id", (req: Request, res: Response) => {
  wrapAsync(new ChatController(req, res).getConvoById);
});

export default router;

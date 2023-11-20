import express, { NextFunction, Request, Response } from "express";

// import { check } from "express-validator";

import {
  addContractIdToConvo,
  chatPostHandler,
  conversationPutHandler,
  convoPostHandler,
  getChatHandler,
  getConversationHandler,
  getConvoById,
  getMostRecentConvo,
  markAsRead,
  summaryPostHandler,
} from "../controllers/chat.controller";

const router = express.Router();

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.post(
  "/add_contract_id_to_convo",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(addContractIdToConvo(req, res, next));
  }
);

router.get(
  "/get_most_recent_convo",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getMostRecentConvo(req, res, next));
  }
);

router.put(
  "/conversation_put",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(conversationPutHandler(req, res, next));
  }
);

router.get(
  "/get_conversation",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getConversationHandler(req, res, next));
  }
);

router.post(
  "/summary_post",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(summaryPostHandler(req, res, next));
  }
);

router.post(
  "/convo_post",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(convoPostHandler(req, res, next));
  }
);

router.post("/chat_post", (req: Request, res: Response, next: NextFunction) => {
  wrapAsync(chatPostHandler(req, res, next));
});

router.get("/get_chat", (req: Request, res: Response, next: NextFunction) => {
  wrapAsync(getChatHandler(req, res, next));
});

router.post(
  "/mark_as_read",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(markAsRead(req, res, next));
  }
);

router.get(
  "/get_convo_by_id",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getConvoById(req, res, next));
  }
);

export default router;

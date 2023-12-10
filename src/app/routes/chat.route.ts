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
import verifyToken from "../middleware/authHandler";

const router = express.Router();

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.post(
  "/add_contract_id_to_convo",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(addContractIdToConvo(req, res, next));
  }
);

router.get(
  "/get_most_recent_convo",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getMostRecentConvo(req, res, next));
  }
);

router.put(
  "/conversation_put",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(conversationPutHandler(req, res, next));
  }
);

router.get(
  "/get_conversation",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getConversationHandler(req, res, next));
  }
);

router.post(
  "/summary_post",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(summaryPostHandler(req, res, next));
  }
);

router.post(
  "/convo_post",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(convoPostHandler(req, res, next));
  }
);

router.post(
  "/chat_post",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(chatPostHandler(req, res, next));
  }
);

router.get(
  "/get_chat",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getChatHandler(req, res, next));
  }
);

router.post(
  "/mark_as_read",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(markAsRead(req, res, next));
  }
);

router.get(
  "/get_convo_by_id",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getConvoById(req, res, next));
  }
);

export default router;

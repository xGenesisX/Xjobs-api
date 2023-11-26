import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "../middleware/authHandler";

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

router
  .route("/add_contract_id_to_convo")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    addContractIdToConvo(req, res, next);
  });
router
  .route("/get_most_recent_convo")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getMostRecentConvo(req, res, next);
  });
router
  .route("/conversation_put")
  .put(authenticate, (req: Request, res: Response, next: NextFunction) => {
    conversationPutHandler(req, res, next);
  });
router
  .route("/get_conversation")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getConversationHandler(req, res, next);
  });
router
  .route("/summary_post")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    summaryPostHandler(req, res, next);
  });
router
  .route("/convo_post")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    convoPostHandler(req, res, next);
  });
router
  .route("/chat_post")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    chatPostHandler(req, res, next);
  });
router
  .route("/get_chat")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getChatHandler(req, res, next);
  });
router
  .route("/mark_as_read")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    markAsRead(req, res, next);
  });
router
  .route("/get_convo_by_id")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getConvoById(req, res, next);
  });

export default router;

import express, { NextFunction, Request, Response } from "express";

import { check } from "express-validator";

import ChatController from "../controllers/chat.controller";

const router = express.Router();

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.post(
  "/add_contract_id_to_convo",
  [check("id"), check("contractId") /*sanitizeBody("id")*/],
  (req: express.Request) => {
    wrapAsync(ChatController.addContractIdToConvo);
  }
);

router.post("/get_most_recent_convo", [check("id")], (req: express.Request) => {
  wrapAsync(ChatController.getMostRecentConvo);
});

router.post(
  "/conversation_put",
  [check("id"), check("lastMessage"), check("unread")],
  (req: express.Request) => {
    wrapAsync(ChatController.conversationPutHandler);
  }
);

router.post(
  "/get_conversation",
  [check("id").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(ChatController.getConversationHandler);
  }
);

router.post(
  "/summary_post",
  [
    check("conversationID").not().isEmpty(),
    check("summaryText"),
    check("sender"),
  ],
  (req: express.Request) => {
    wrapAsync(ChatController.summaryPostHandler);
  }
);

router.post(
  "/convo_post",
  [
    check("client"),
    check("freelancer"),
    check("sender"),
    check("message"),
    check("gigDetails"),
    check("proposalID"),
    check("group"),
  ],
  (req: express.Request) => {
    wrapAsync(ChatController.convoPostHandler);
  }
);

router.post(
  "/chat_post",
  [
    check("sender").not().isEmpty(),
    check("message"),
    check("proposalID"),
    check("userID"),
  ],
  (req: express.Request) => {
    wrapAsync(ChatController.chatPostHandler);
  }
);

router.post(
  "/get_chat",
  [check("id").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(ChatController.getChatHandler);
  }
);

router.post(
  "/mark_as_read",
  [check("id").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(ChatController.markAsRead);
  }
);

router.post(
  "/get_convo_by_id",
  [check("id").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(ChatController.getConvoById);
  }
);

export default router;

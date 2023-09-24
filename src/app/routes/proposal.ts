import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import proposalController from "../controllers/proposal.controller";

import { body, check } from "express-validator";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.put(
  "/update_proposal_convo_id",
  [
    check("id"),
    check("conversationID"),
    body("id", "id cannot be empty").not().isEmpty(),
    body("conversationID", "conversationID cannot be empty").not().isEmpty(),
  ],
  (req: express.Request) => {
    wrapAsync(proposalController.updateProposalConversationID);
  }
);

router.get(
  "/check_proposal_exists",
  [
    check("freelancerId"),
    check("gigID"),
    body("userId"),
    body("gigId", "gig id cannot be empty").not().isEmpty(),
    body("conversationID", "conversation id can not be empty").not().isEmpty(),
  ],
  (req: express.Request) => {
    wrapAsync(proposalController.checkIfProposalExists);
  }
);
router.get("/get_job_proposal", (req: express.Request) => {
  wrapAsync(proposalController.getJobProposal);
});
router.post(
  "/accept_proposal",
  [check("id").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(proposalController.acceptProposal);
  }
);

export default router;

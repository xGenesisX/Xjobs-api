import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import proposalController from "../controllers/proposal.controller";

// import { body, check } from "express-validator";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.put("/update_proposal_convo_id", (req: Request, res: Response) => {
  wrapAsync(proposalController.updateProposalConversationID(req, res));
});

router.get("/check_proposal_exists", (req: Request, res: Response) => {
  wrapAsync(proposalController.checkIfProposalExists(req, res));
});

router.get("/get_job_proposal", (req: Request, res: Response) => {
  wrapAsync(proposalController.getJobProposal(req, res));
});

router.get("/create_new_proposal", (req: Request, res: Response) => {
  wrapAsync(proposalController.createNewProposal(req, res));
});

router.get("/get_a_proposal", (req: Request, res: Response) => {
  wrapAsync(proposalController.getAProposal(req, res));
});

router.get("/get_proposal_by_id", (req: Request, res: Response) => {
  wrapAsync(proposalController.getProposalById(req, res));
});

router.get("/get_proposals_for_gig", (req: Request, res: Response) => {
  wrapAsync(proposalController.getProposalsForGig(req, res));
});

router.get(
  "/update_proposal_conversation_id",
  (req: Request, res: Response) => {
    wrapAsync(proposalController.updateProposalConversationID(req, res));
  }
);

export default router;

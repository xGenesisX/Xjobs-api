import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import {
  checkIfProposalExists,
  createNewProposal,
  getAProposal,
  getJobProposal,
  getProposalById,
  getProposalsForGig,
  updateProposalConversationID,
} from "../controllers/proposal.controller";

// import { body, check } from "express-validator";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.put(
  "/update_proposal_convo_id",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(updateProposalConversationID(req, res, next));
  }
);

router.get(
  "/check_proposal_exists",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(checkIfProposalExists(req, res, next));
  }
);

router.get(
  "/get_job_proposal",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getJobProposal(req, res, next));
  }
);

router.get(
  "/create_new_proposal",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(createNewProposal(req, res, next));
  }
);

router.get(
  "/get_a_proposal",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getAProposal(req, res, next));
  }
);

router.get(
  "/get_proposal_by_id",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getProposalById(req, res, next));
  }
);

router.get(
  "/get_proposals_for_gig",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getProposalsForGig(req, res, next));
  }
);

router.get(
  "/update_proposal_conversation_id",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(updateProposalConversationID(req, res, next));
  }
);

export default router;

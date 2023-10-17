import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import { checkIfProposalExists } from "../controllers/proposal.controller";
import { createNewProposal } from "../controllers/proposal.controller";
import { getAProposal } from "../controllers/proposal.controller";
import { getJobProposal } from "../controllers/proposal.controller";
import { getProposalById } from "../controllers/proposal.controller";
import { getProposalsForGig } from "../controllers/proposal.controller";
import { updateProposalConversationID } from "../controllers/proposal.controller";

// import { body, check } from "express-validator";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.put("/update_proposal_convo_id", (req: Request, res: Response) => {
  wrapAsync(updateProposalConversationID(req, res));
});

router.get("/check_proposal_exists", (req: Request, res: Response) => {
  wrapAsync(checkIfProposalExists(req, res));
});

router.get("/get_job_proposal", (req: Request, res: Response) => {
  wrapAsync(getJobProposal(req, res));
});

router.get("/create_new_proposal", (req: Request, res: Response) => {
  wrapAsync(createNewProposal(req, res));
});

router.get("/get_a_proposal", (req: Request, res: Response) => {
  wrapAsync(getAProposal(req, res));
});

router.get("/get_proposal_by_id", (req: Request, res: Response) => {
  wrapAsync(getProposalById(req, res));
});

router.get("/get_proposals_for_gig", (req: Request, res: Response) => {
  wrapAsync(getProposalsForGig(req, res));
});

router.get(
  "/update_proposal_conversation_id",
  (req: Request, res: Response) => {
    wrapAsync(updateProposalConversationID(req, res));
  }
);

export default router;

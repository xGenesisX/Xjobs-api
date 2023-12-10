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

import verifyToken from "../middleware/authHandler";


router
  .route("/update_proposal_convo_id")
  .put(authenticate, (req: Request, res: Response, next: NextFunction) => {
    updateProposalConversationID(req, res, next);
  });

router
  .route("/check_proposal_exists")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    checkIfProposalExists(req, res, next);
  });

router.put(
  "/update_proposal_convo_id",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(updateProposalConversationID(req, res, next));
  }
);

router.get(
  "/check_proposal_exists",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(checkIfProposalExists(req, res, next));
  }
);

router.get(
  "/get_job_proposal",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getJobProposal(req, res, next));
  }
);

router.post(
  "/create_new_proposal",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(createNewProposal(req, res, next));
  }
);

router.get(
  "/get_a_proposal",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getAProposal(req, res, next));
  }
);

router.get(
  "/get_proposal_by_id",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getProposalById(req, res, next));
  }
);

router.get(
  "/get_proposals_for_gig",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getProposalsForGig(req, res, next));
  }
);

router.put(
  "/update_proposal_conversation_id",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(updateProposalConversationID(req, res, next));
  }
);

export default router;

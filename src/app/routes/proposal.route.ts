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
import { authenticate } from "../middleware/authHandler";

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

router
  .route("/get_job_proposal")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getJobProposal(req, res, next);
  });

router
  .route("/get_a_proposal")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getAProposal(req, res, next);
  });

router
  .route("/get_proposal_by_id")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getProposalById(req, res, next);
  });

router
  .route("/get_proposals_for_gig")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getProposalsForGig(req, res, next);
  });

router
  .route("/update_proposal_conversation_id")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    updateProposalConversationID(req, res, next);
  });

router
  .route("/create_new_proposal")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    createNewProposal(req, res, next);
  });

export default router;

import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import {
  acceptContract,
  approveRefund,
  getAllContracts,
  getUserContracts,
  hireFreelancer,
  rejectContract,
  releaseFunds,
} from "../controllers/contract.controller";
import { authenticate } from "../middleware/authHandler";

router
  .route("/get_contracts")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getUserContracts(req, res, next);
  });
router
  .route("/hire_freelancer")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    hireFreelancer(req, res, next);
  });
router
  .route("/reject_contract")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    rejectContract(req, res, next);
  });
router
  .route("/accept_contract")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    acceptContract(req, res, next);
  });
router
  .route("/approve_refund")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    approveRefund(req, res, next);
  });
router
  .route("/get_all_contracts")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getAllContracts(req, res, next);
  });
router
  .route("/release_funds")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    releaseFunds(req, res, next);
  });

export default router;

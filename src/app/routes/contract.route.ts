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

import verifyToken from "../middleware/authHandler";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get(
  "/get_contracts",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getUserContracts(req, res, next));
  }
);

router.post(
  "/hire_freelancer",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(hireFreelancer(req, res, next));
  }
);

router.post(
  "/reject_contract",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(rejectContract(req, res, next));
  }
);

router.post(
  "/accept_contract",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(acceptContract(req, res, next));
  }
);

router.post(
  "/approve_refund",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(approveRefund(req, res, next));
  }
);

router.get(
  "/get_all_contracts",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getAllContracts(req, res, next));
  }
);

router.get(
  "/get_contract",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(releaseFunds(req, res, next));
  }
);

export default router;

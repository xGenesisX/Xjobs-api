import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import contractController from "../controllers/contract.controller";

import { check } from "express-validator";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get(
  "/get_contracts",
  [check("role"), check("id")],
  (req: express.Request) => {
    wrapAsync(contractController.getContractsHandler);
  }
);

router.post(
  "/hire_freelancer",
  [
    check("clientId"),
    check("gigId"),
    check("freelancerId"),
    check("txHash"),
    check("amount"),
    check("conversationID"),
  ],
  (req: express.Request, res: express.Response) => {
    wrapAsync(contractController.hireFreelancer);
  }
);

router.get(
  "/reject_contract",
  [
    check("gigId"),
    check("freelancerId"),
    check("conversationId"),
    check("contractId"),
  ],
  (req: express.Request, res: express.Response) => {
    wrapAsync(contractController.rejectContract);
  }
);
router.get(
  "/accept_contract",
  [
    check("conversationID"),
    check("proposalId"),
    check("freelancerId"),
    check("gigId"),
  ],
  (req: express.Request) => {
    wrapAsync(contractController.acceptContract);
  }
);

router.get(
  "/approve_refund",
  [
    check("userId"),
    check("conversationID"),
    check("contractId"),
    check("contractStatus"),
    check("summaryText"),
    check("gigId"),
  ],
  (req: express.Request, res: express.Response) => {
    wrapAsync(contractController.approveRefund);
  }
);
router.get("/get_contract", wrapAsync(contractController.getHandler));

export default router;

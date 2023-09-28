import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import contractController from "../controllers/contract.controller";

// import { check } from "express-validator";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get("/get_contracts", (req: Request, res: Response) => {
  wrapAsync(contractController.getUserContracts(req, res));
});

router.post("/hire_freelancer", (req: Request, res: Response) => {
  wrapAsync(contractController.hireFreelancer(req, res));
});

router.get("/reject_contract", (req: Request, res: Response) => {
  wrapAsync(contractController.rejectContract(req, res));
});

router.get("/accept_contract", (req: Request, res: Response) => {
  wrapAsync(contractController.acceptContract(req, res));
});

router.get("/approve_refund", (req: Request, res: Response) => {
  wrapAsync(contractController.approveRefund(req, res));
});

router.get("/get_all_contracts", (req: Request, res: Response) => {
  wrapAsync(contractController.getAllContracts(req, res));
});

router.get("/get_contract", (req: Request, res: Response) => {
  wrapAsync(contractController.releaseFunds(req, res));
});

export default router;

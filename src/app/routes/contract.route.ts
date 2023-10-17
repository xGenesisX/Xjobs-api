import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import { acceptContract } from "../controllers/contract.controller";
import { approveRefund } from "../controllers/contract.controller";
import { getAllContracts } from "../controllers/contract.controller";
import { getUserContracts } from "../controllers/contract.controller";
import { hireFreelancer } from "../controllers/contract.controller";
import { rejectContract } from "../controllers/contract.controller";
import { releaseFunds } from "../controllers/contract.controller";

// import { check } from "express-validator";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get(
  "/get_contracts",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getUserContracts(req, res, next));
  }
);

router.post(
  "/hire_freelancer",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(hireFreelancer(req, res, next));
  }
);

router.get(
  "/reject_contract",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(rejectContract(req, res, next));
  }
);

router.get(
  "/accept_contract",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(acceptContract(req, res, next));
  }
);

router.get(
  "/approve_refund",
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
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(releaseFunds(req, res, next));
  }
);

export default router;

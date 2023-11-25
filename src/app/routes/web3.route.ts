// is payment validated?
// get details on a address
import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "../middleware/authHandler";

const router = express.Router();

router
  .route("/send_usdc")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    // getOwnerGigById(req, res, next);
  });

router
  .route("/send_sol")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    // getOwnerGigById(req, res, next);
  });

router
  .route("/is_payment_validated")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    // getOwnerGigById(req, res, next);
  });

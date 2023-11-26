import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "../middleware/authHandler";
import { receiveSOL, sendSOL } from "../controllers/web3.controller";

const router = express.Router();

router
  .route("/receive_sol")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    receiveSOL(req, res, next);
  });

router
  .route("/send_sol")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    sendSOL(req, res, next);
  });

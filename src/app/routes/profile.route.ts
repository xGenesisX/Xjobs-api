import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import {
  addFeedbackToUserProfile,
  createUserProfile,
  getUserProfileWithAddress,
  getUserProfileWithId,
  updateUserProfile,
} from "../controllers/profile.controller";
import { authenticate } from "../middleware/authHandler";

router
  .route("/get_user_with_address")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getUserProfileWithAddress(req, res, next);
  });
router
  .route("/get_user_with_id")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getUserProfileWithId(req, res, next);
  });
router
  .route("/update_user_profile")
  .put(authenticate, (req: Request, res: Response, next: NextFunction) => {
    updateUserProfile(req, res, next);
  });
router
  .route("/add_feedback_to_user_profile")
  .put(authenticate, (req: Request, res: Response, next: NextFunction) => {
    addFeedbackToUserProfile(req, res, next);
  });
router
  .route("/create_user_profile")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    createUserProfile(req, res, next);
  });

export default router;

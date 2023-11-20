import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import {
  addFeedbackToUserProfile,
  createUserProfile,
  getUserProfileWithAddress,
  getUserProfileWithId,
  updateUserProfile,
} from "../controllers/profile.controller";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get(
  "/get_user_with_address",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getUserProfileWithAddress(req, res, next));
  }
);

router.get(
  "/get_user_with_id",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getUserProfileWithId(req, res, next));
  }
);

router.put(
  "/update_user_profile",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(updateUserProfile(req, res, next));
  }
);

router.put(
  "/add_feedback_to_user_profile",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(addFeedbackToUserProfile(req, res, next));
  }
);

router.post(
  "/create_user_profile",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(createUserProfile(req, res, next));
  }
);

export default router;

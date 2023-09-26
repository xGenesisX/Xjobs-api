import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import profileController from "../controllers/profile.controller";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get("/get_user_with_address", (req: Request, res: Response) => {
  wrapAsync(profileController.getUserProfileWithAddress(req, res));
});

router.get("/get_user_with_id", (req: Request, res: Response) => {
  wrapAsync(profileController.getUserProfileWithId(req, res));
});

router.get("/update_user_profile", (req: Request, res: Response) => {
  wrapAsync(profileController.updateUserProfile(req, res));
});

router.get("/add_feedback_to_user_profile", (req: Request, res: Response) => {
  wrapAsync(profileController.addFeedbackToUserProfile(req, res));
});

router.get("/create_user_profile", (req: Request, res: Response) => {
  wrapAsync(profileController.createUserProfile(req, res));
});

export default router;

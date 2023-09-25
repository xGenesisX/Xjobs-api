import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import { check } from "express-validator";

import profileController from "../controllers/profile.controller";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get(
  "/get_user_with_address",
  [check("address").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(profileController.getUserProfileWithAddress);
  }
);
router.get(
  "/get_profile_exist",
  [check("id").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(profileController.getUserProfileWithId);
  }
);
router.get(
  "/get_specific_user",
  [check("addr").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(profileController.getUserProfileWithAddress);
  }
);
router.get(
  "/get_user_with_id",
  [check("id").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(profileController.getUserProfileWithId);
  }
);

export default router;

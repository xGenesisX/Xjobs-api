import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

import { check } from "express-validator";

import gigController from "../controllers/gig.controller";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get(
  "/get_owner_gig_by_id",
  [check("id"), check("address").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(gigController.getOwnerGigById);
  }
);
router.get(
  "/update_gig_status",
  [check("id").not().isEmpty(), check("status") /*sanitizeBody("id")*/],
  (req: express.Request) => {
    wrapAsync(gigController.updateGigStatus);
  }
);
router.get(
  "/award_freelancer",
  [check("id").not().isEmpty(), check("freelancerId"), check("status")],
  (req: express.Request) => {
    wrapAsync(gigController.awardFreelancer);
  }
);

router.get(
  "/get_gig_by_owner",
  [check("address").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(gigController.getGigByOwner);
  }
);

router.get(
  "/get_gig_by_id",
  [check("id").not().isEmpty()],
  (req: express.Request) => {
    wrapAsync(gigController.getGigById);
  }
);

router.get(
  "/update_gig",
  [
    check("id"),
    check("owner"),
    check("currency"),
    check("ownerAddress"),
    check("slug"),
  ],
  (req: express.Request) => {
    wrapAsync(gigController.putHandler);
  }
);
router.get(
  "/get_my_jobs",
  [check("id"), check("status")],
  (req: express.Request) => {
    wrapAsync(gigController.getMyJobs);
  }
);

export default router;

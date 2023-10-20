import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

// import { check } from "express-validator";

import {
  bookmarkGig,
  cancelGig,
  createGig,
  getAllGigs,
  getGigById,
  getGigByOwner,
  getMyJobs,
  getOwnerGigById,
  listGigByOwner,
  removeBookmark,
  updateGigDetails,
} from "../controllers/gig.controller";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get(
  "/get_owner_gig_by_id",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getOwnerGigById(req, res, next));
  }
);

router.get(
  "/update_gig_details",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(updateGigDetails(req, res, next));
  }
);

router.get(
  "/remove_bookmark",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(removeBookmark(req, res, next));
  }
);

router.get(
  "/list_gig_by_owner",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(listGigByOwner(req, res, next));
  }
);

router.get(
  "/get_owner_gig_by_id",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getOwnerGigById(req, res, next));
  }
);

router.get(
  "/get_my_jobs",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getMyJobs(req, res, next));
  }
);

router.get(
  "/get_gig_by_owner",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getGigByOwner(req, res, next));
  }
);

router.get(
  "/get_gig_by_id",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getGigById(req, res, next));
  }
);

router.get(
  "/get_all_gigs",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(getAllGigs(req, res, next));
  }
);

router.get("/create_gig", (req: Request, res: Response, next: NextFunction) => {
  wrapAsync(createGig(req, res, next));
});

router.get("/cancel_gig", (req: Request, res: Response, next: NextFunction) => {
  wrapAsync(cancelGig(req, res, next));
});

router.get(
  "/bookmark_gig",
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(bookmarkGig(req, res, next));
  }
);

export default router;

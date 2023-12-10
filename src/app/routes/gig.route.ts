import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

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

import verifyToken from "../middleware/authHandler";

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

router.put(
  "/update_gig_details",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(updateGigDetails(req, res, next));
  }
);

router.delete(
  "/remove_bookmark",
  verifyToken,
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

router.post(
  "/create_gig",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(createGig(req, res, next));
  }
);

router.post(
  "/cancel_gig",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(cancelGig(req, res, next));
  }
);

router.put(
  "/bookmark_gig",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    wrapAsync(bookmarkGig(req, res, next));
  }
);

export default router;

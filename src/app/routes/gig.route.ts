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
import { authenticate } from "../middleware/authHandler";

router
  .route("/get_owner_gig_by_id")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getOwnerGigById(req, res, next);
  });

router
  .route("/update_gig_details")
  .put(authenticate, (req: Request, res: Response, next: NextFunction) => {
    updateGigDetails(req, res, next);
  });

router
  .route("/remove_bookmark")
  .delete(authenticate, (req: Request, res: Response, next: NextFunction) => {
    removeBookmark(req, res, next);
  });

router
  .route("/list_gig_by_owner")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    listGigByOwner(req, res, next);
  });

router
  .route("/get_my_jobs")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getMyJobs(req, res, next);
  });

router
  .route("/get_gig_by_owner")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getGigByOwner(req, res, next);
  });

router
  .route("/get_gig_by_id")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getGigById(req, res, next);
  });

router
  .route("/get_all_gigs")
  .get(authenticate, (req: Request, res: Response, next: NextFunction) => {
    getAllGigs(req, res, next);
  });

router
  .route("/create_gig")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    createGig(req, res, next);
  });

router
  .route("/cancel_gig")
  .post(authenticate, (req: Request, res: Response, next: NextFunction) => {
    cancelGig(req, res, next);
  });

router
  .route("/bookmark_gig")
  .put(authenticate, (req: Request, res: Response, next: NextFunction) => {
    bookmarkGig(req, res, next);
  });

export default router;

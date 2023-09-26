import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

// import { check } from "express-validator";

import gigController from "../controllers/gig.controller";

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

router.get("/get_owner_gig_by_id", (req: Request, res: Response) => {
  wrapAsync(gigController.getOwnerGigById(req, res));
});

router.get("/update_gig_details", (req: Request, res: Response) => {
  wrapAsync(gigController.updateGigDetails(req, res));
});

router.get("/remove_bookmark", (req: Request, res: Response) => {
  wrapAsync(gigController.removeBookmark(req, res));
});

router.get("/list_gig_by_owner", (req: Request, res: Response) => {
  wrapAsync(gigController.listGigByOwner(req, res));
});

router.get("/get_owner_gig_by_id", (req: Request, res: Response) => {
  wrapAsync(gigController.getOwnerGigById(req, res));
});

router.get("/get_my_jobs", (req: Request, res: Response) => {
  wrapAsync(gigController.getMyJobs(req, res));
});

router.get("/get_gig_by_owner", (req: Request, res: Response) => {
  wrapAsync(gigController.getGigByOwner(req, res));
});

router.get("/get_gig_by_id", (req: Request, res: Response) => {
  wrapAsync(gigController.getGigById(req, res));
});

router.get("/get_all_gigs", (req: Request, res: Response) => {
  wrapAsync(gigController.getAllGigs(req, res));
});

router.get("/create_gig", (req: Request, res: Response) => {
  wrapAsync(gigController.createGig(req, res));
});

router.get("/cancel_gig", (req: Request, res: Response) => {
  wrapAsync(gigController.cancelGig(req, res));
});

router.get("/bookmark_gig", (req: Request, res: Response) => {
  wrapAsync(gigController.bookmarkGig(req, res));
});

export default router;

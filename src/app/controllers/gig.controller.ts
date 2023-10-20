import { Request, Response } from "express";
import ChatController from "../services/conversation.service";
import * as gigService from "../services/gig.service";
import catchAsync from "../utils/catchAsync";

export const getGigById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;

  gigService.default.getGigById(id);
});

export const getOwnerGigById = catchAsync(
  async (req: Request, res: Response) => {
    const { id, address } = req.body;

    gigService.default.getOwnerGigById(id, address);
  }
);

export const getMyJobs = catchAsync(async (req: Request, res: Response) => {
  const { id, status } = req.body;

  gigService.default.getMyJobs(id, status);
});

export const getGigByOwner = catchAsync(async (req: Request, res: Response) => {
  const { address } = req.body;

  gigService.default.getGigByOwner(address);
});

export const updateGigDetails = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.body;

    gigService.default.updateGigDetails(id);
  }
);

export const awardFreelancer = catchAsync(
  async (req: Request, res: Response) => {
    const { id, freelancerId, status } = req.body;

    gigService.default.awardFreelancer(id, freelancerId, status);
  }
);

export const updateGigStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id, status } = req.body;

    gigService.default.updateGigStatus(id, status);
  }
);

export const bookmarkGig = catchAsync(async (req: Request, res: Response) => {
  const { id, GigId } = req.body;

  gigService.default.bookmarkGig(id, GigId);
});

export const createGig = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    currency,
    ownerAddress,
    clientName,
    company,
    timezone,
    category,
    gig_description,
    skills_required,
    url,
    timeframe,
    status,
    owner,
  } = req.body;

  gigService.default.createGig(
    title,
    currency,
    ownerAddress,
    clientName,
    company,
    timeframe,
    category,
    gig_description,
    skills_required,
    url,
    timeframe,
    status,
    owner
  );
});

export const listGigByOwner = catchAsync(
  async (req: Request, res: Response) => {
    const { address } = req.body;

    gigService.default.listGigByOwner(address);
  }
);

export const removeBookmark = catchAsync(
  async (req: Request, res: Response) => {
    const { id, GigId } = req.body;

    gigService.default.removeBookmark(id, GigId);
  }
);

export const getAllGigs = catchAsync(async (req: Request, res: Response) => {
  const { page, filter } = req.body;

  gigService.default.getAllGigs(page, filter);
});

export const cancelGig = catchAsync(async (req: Request, res: Response) => {
  const { clientId, gigId, freelancerId, contractId, reason, conversationID } =
    req.body;

  new ChatController(req, res).summaryPostHandler(
    conversationID,
    "requested a refund and to cancel this project",
    clientId
  ),
    gigService.default.cancelGig(
      clientId,
      gigId,
      freelancerId,
      contractId,
      reason,
      conversationID
    );
});

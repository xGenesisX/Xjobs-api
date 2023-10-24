import { Request, Response } from "express";
import ChatController from "../services/conversation.service";
import * as gigService from "../services/gig.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";

export const getGigById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    gigService.default.getGigById(id);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
});

export const getOwnerGigById = catchAsync(
  async (req: Request, res: Response) => {
    const { id, address } = req.body;

    try {
      gigService.default.getOwnerGigById(id, address);
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
);

export const getMyJobs = catchAsync(async (req: Request, res: Response) => {
  const { id, status } = req.body;

  try {
    gigService.default.getMyJobs(id, status);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
});

export const getGigByOwner = catchAsync(async (req: Request, res: Response) => {
  const { address } = req.body;

  try {
    gigService.default.getGigByOwner(address);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
});

export const updateGigDetails = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
      gigService.default.updateGigDetails(id);
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
);

export const awardFreelancer = catchAsync(
  async (req: Request, res: Response) => {
    const { id, freelancerId, status } = req.body;

    try {
      gigService.default.awardFreelancer(id, freelancerId, status);
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
);

export const updateGigStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id, status } = req.body;

    try {
      gigService.default.updateGigStatus(id, status);
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
);

export const bookmarkGig = catchAsync(async (req: Request, res: Response) => {
  const { id, GigId } = req.body;

  try {
    gigService.default.bookmarkGig(id, GigId);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
});

export const createGig = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    currency,
    ownerAddress,
    clientName,
    company,
    category,
    gig_description,
    skills_required,
    url,
    timeframe,
    status,
    owner,
  } = req.body;

  try {
    await gigService.default.createGig(
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
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
});

export const listGigByOwner = catchAsync(
  async (req: Request, res: Response) => {
    const { address } = req.body;

    try {
      await gigService.default.listGigByOwner(address);
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
);

export const removeBookmark = catchAsync(
  async (req: Request, res: Response) => {
    const { id, GigId } = req.body;

    try {
      await gigService.default.removeBookmark(id, GigId);
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
);

export const getAllGigs = catchAsync(async (req: Request, res: Response) => {
  const { page, filter } = req.body;

  try {
    await gigService.default.getAllGigs(page, filter);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
});

export const cancelGig = catchAsync(async (req: Request, res: Response) => {
  const { clientId, gigId, freelancerId, contractId, reason, conversationID } =
    req.body;

  new ChatController(req, res).summaryPostHandler(
    conversationID,
    "requested a refund and to cancel this project",
    clientId
  );

  try {
    await gigService.default.cancelGig(
      clientId,
      gigId,
      freelancerId,
      contractId,
      reason,
      conversationID
    );
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
});

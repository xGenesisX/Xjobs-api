import { Request, Response } from "express";
import httpStatus from "http-status";
import { getToken } from "next-auth/jwt";
import proposalService from "../services/proposal.service";
import catchAsync from "../utils/catchAsync";

// @notice create a new proposal
export const createNewProposal = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { gigId, freelancerId, coverLetter } = req.body;

      try {
        const proposal = proposalService.createNewProposal(
          gigId,
          freelancerId,
          coverLetter
        );

        res.send(proposal);
      } catch (error) {
        res.status(400).json(error);
      }
    }
  }
);

// @notice get a proposal with a given id
export const getAProposal = catchAsync(async (req: Request, res: Response) => {
  const { gigId } = req.body;
  let token = getToken({ req });
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED);
  } else {
    try {
      const gig = proposalService.getAProposal(gigId);
      res.send(gig);
    } catch (error) {
      res.json(error);
    }
  }
});

// @notice get a job proposal with a given id
export const getJobProposal = catchAsync(
  async (req: Request, res: Response) => {
    const { gigId } = req.body;
    let token = getToken({ req });
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      try {
        const proposal = proposalService.getJobProposal(gigId);
        res.send(proposal);
      } catch (error) {
        res.json(error);
      }
    }
  }
);

// @notice check if a proposal exists
export const checkIfProposalExists = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { freelancerId, gigID } = req.body;
      try {
        const proposal = proposalService.checkIfProposalExists(
          freelancerId,
          gigID
        );
        res.send(proposal);
      } catch (error) {
        res.send(error);
      }
    }
  }
);

// @notice update a proposal with a given id
export const updateProposalConversationID = catchAsync(
  async (req: Request, res: Response) => {
    const { id, conversationID } = req.body;

    let token = getToken({ req });

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      try {
        const proposal = proposalService.updateProposalConversationID(
          id,
          conversationID
        );
        res.send(proposal);
      } catch (error) {
        res.send(error);
      }
    }
  }
);

// @notice get a proposal with a given id
export const getProposalById = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { id } = req.body;
      try {
        const proposals = proposalService.getProposalById(id);
        res.send(proposals);
      } catch (error) {
        res.send(error);
      }
    }
  }
);

// @notice get proposal for a gig
export const getProposalsForGig = catchAsync(
  async (req: Request, res: Response) => {
    let token = getToken({ req });
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { gigId } = req.body;
      try {
        const proposal = proposalService.getProposalsForGig(gigId);
        res.send(proposal);
      } catch (error) {
        res.send(error);
      }
    }
  }
);

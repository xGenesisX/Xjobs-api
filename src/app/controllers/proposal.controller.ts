import { Request, Response } from "express";
import proposalService from "../services/proposal.service";

// @notice create a new proposal
export const createNewProposal = async (req: Request, res: Response) => {
  const { gigId, freelancerId, coverLetter } = req.body;

  try {
    const p = proposalService.createNewProposal(
      gigId,
      freelancerId,
      coverLetter
    );

    res.send(p);
  } catch (error) {
    res.status(400).json(error);
  }
};

// @notice get a proposal with a given id
export const getAProposal = async (req: Request, res: Response) => {
  const { gigId } = req.body;
  try {
    const gig = proposalService.getAProposal(gigId);
    res.send(gig);
  } catch (error) {
    res.json(error);
  }
};

// @notice get a job proposal with a given id
export const getJobProposal = async (req: Request, res: Response) => {
  const { gigId } = req.body;
  try {
    const proposal = proposalService.getJobProposal(gigId);
    res.send(proposal);
  } catch (error) {
    res.json(error);
  }
};

// @notice check if a proposal exists
export const checkIfProposalExists = async (req: Request, res: Response) => {
  const { freelancerId, gigID } = req.body;

  try {
    const proposal = proposalService.checkIfProposalExists(freelancerId, gigID);
    res.send(proposal);
  } catch (error) {
    res.send(error);
  }
};

// @notice update a proposal with a given id
export const updateProposalConversationID = async (
  req: Request,
  res: Response
) => {
  const { id, conversationID } = req.body;

  try {
    const proposal = proposalService.updateProposalConversationID(
      id,
      conversationID
    );
    res.send(proposal);
  } catch (error) {
    res.send(error);
  }
};

// @notice get a proposal with a given id
export const getProposalById = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const proposals = proposalService.getProposalById(id);
    res.send(proposals);
  } catch (error) {
    res.send(error);
  }
};

// @notice get proposal for a gig
export const getProposalsForGig = async (req: Request, res: Response) => {
  const { gigId } = req.body;
  try {
    const proposal = proposalService.getProposalsForGig(gigId);
    res.send(proposal);
  } catch (error) {
    res.send(error);
  }
};

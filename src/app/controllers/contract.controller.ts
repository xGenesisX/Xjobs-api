import { Request, Response } from "express";
import * as contractService from "../services/contract.service";
import ChatController from "../services/conversation.service";
import catchAsync from "../utils/catchAsync";

export const getAllContracts = catchAsync(
  async (req: Request, res: Response) => {
    contractService.default.getAllContracts();
  }
);

export const hireFreelancer = catchAsync(
  async (req: Request, res: Response) => {
    const { clientId, gigId, freelancerId, txHash, amount, conversationID } =
      req.body;

    contractService.default.hireFreelancer(
      clientId,
      gigId,
      freelancerId,
      txHash,
      amount,
      conversationID
    );
  }
);

export const getUserContracts = catchAsync(
  async (req: Request, res: Response) => {
    const { role, id } = req.body;
    // const { role, id } = req.query;
    contractService.default.getUserContracts(role, id);
  }
);

export const approveRefund = catchAsync(async (req: Request, res: Response) => {
  const {
    userId,
    conversationID,
    contractId,
    contractStatus,
    summaryText,
    gigId,
  } = req.body;

  new ChatController(req, res).summaryPostHandler(
    conversationID,
    summaryText,
    userId
  ),
    contractService.default.approveRefund(contractId, contractStatus, gigId);
});

export const acceptContract = catchAsync(
  async (req: Request, res: Response) => {
    const { gigId, freelancerId, proposalId, conversationID } = req.body;

    new ChatController(req, res).summaryPostHandler(
      conversationID,
      "accepted the offer for this project",
      freelancerId
    ),
      contractService.default.acceptContract(gigId, freelancerId, proposalId);
  }
);

export const rejectContract = catchAsync(
  async (req: Request, res: Response) => {
    const { gigId, freelancerId, conversationID, contractId } = req.body;

    new ChatController(req, res).summaryPostHandler(
      conversationID,
      "rejected the offer for this project",
      freelancerId
    );

    contractService.default.rejectContract(gigId, freelancerId, contractId);
  }
);

export const releaseFunds = catchAsync(async (req: Request, res: Response) => {
  const { conversationID, userId, gigId, contractID } = req.body;

  new ChatController(req, res).summaryPostHandler(
    conversationID,
    "initiated release of funds",
    userId
  );

  contractService.default.releaseFunds(gigId, contractID);
});

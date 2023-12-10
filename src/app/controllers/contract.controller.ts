import { Request, Response } from "express";
import httpStatus from "http-status";
import { getToken } from "next-auth/jwt";
import { IContract } from "../models/Contract";
import * as contractService from "../services/contract.service";
import ChatController from "../services/conversation.service";
import catchAsync from "../utils/catchAsync";
import { CustomRequest } from "../middleware/authHandler";

export const getAllContracts = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const contracts = contractService.default.getAllContracts();
      res.send(contracts);
    } catch (error) {
      res.send(error);
    }
  }
);

export const hireFreelancer = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { clientId, gigId, freelancerId, txHash, amount, conversationID } =
        req.body;

      try {
        const contract: IContract =
          await contractService.default.hireFreelancer(
            clientId,
            gigId,
            freelancerId,
            txHash,
            amount,
            conversationID
          );

        // add contract id to conversation
        new ChatController(req, res).addContractIdToConvo(
          conversationID,
          contract._id
        );

        // add summary
        new ChatController(req, res).summaryPostHandler(
          conversationID,
          `funded escrow contract with ${
            contract.gigId.currency === "solana"
              ? "◎"
              : contract.gigId.currency === "usd"
              ? "$"
              : "no currency"
          }${amount}`,
          clientId
        );

        res.send(contract);
      } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error);
      }
    }
  }
);

export const getUserContracts = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { role, id } = req.body;
      // const { role, id } = req.query;
      try {
        let a = contractService.default.getUserContracts(role, id);
        res.send(a);
      } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error);
      }
    }
  }
);

export const approveRefund = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
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
      );

      try {
        let a = contractService.default.approveRefund(
          contractId,
          contractStatus,
          gigId
        );
        res.send(a);
      } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error);
      }
    }
  }
);

export const acceptContract = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { gigId, freelancerId, proposalId, conversationID } = req.body;

      new ChatController(req, res).summaryPostHandler(
        conversationID,
        "accepted the offer for this project",
        freelancerId
      );
      try {
        const v = contractService.default.acceptContract(
          gigId,
          freelancerId,
          proposalId
        );
        res.send(v);
      } catch (error) {
        res.status(httpStatus.BAD_GATEWAY).send(error);
      }
    }
  }
);

export const rejectContract = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { gigId, freelancerId, conversationID, contractId } = req.body;

      new ChatController(req, res).summaryPostHandler(
        conversationID,
        "rejected the offer for this project",
        freelancerId
      );

      try {
        const a = contractService.default.rejectContract(
          gigId,
          freelancerId,
          contractId
        );
        res.send(a);
      } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error);
      }
    }
  }
);

export const releaseFunds = catchAsync(
  async (req: CustomRequest, res: Response) => {
    let auth = req.currentUser;
    if (!auth) {
      return res.status(httpStatus.UNAUTHORIZED);
    } else {
      const { conversationID, userId, gigId, contractID } = req.body;

      new ChatController(req, res).summaryPostHandler(
        conversationID,
        "initiated release of funds",
        userId
      );

      try {
        const cvs = contractService.default.releaseFunds(gigId, contractID);
        res.send(cvs);
      } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json(error);
      }
    }
  }
);

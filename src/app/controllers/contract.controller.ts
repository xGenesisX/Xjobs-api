import { Request, Response } from "express";
import ChatController from "./chat.controller";
import gigController from "./gig.controller";
import proposalController from "./proposal.controller";
import Contract from "../models/Contract";

class contractController {
  // @notice accepts a contract
  acceptContract = async (req: Request, res: Response) => {
    const { gigId, freelancerId, proposalId, conversationID } = req.body;
    try {
      const result = await Promise.all([
        new ChatController(req, res).summaryPostHandler(
          conversationID,
          "accepted the offer for this project",
          freelancerId
        ),
        proposalController.acceptProposal(proposalId),
        gigController.awardFreelancer(gigId, freelancerId, "Active"),
      ]);
      if (result) {
        res.status(200).json("Contract accepted");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice approve a refund
  approveRefund = async (req: Request, res: Response) => {
    const {
      userId,
      conversationID,
      contractId,
      contractStatus,
      summaryText,
      gigId,
    } = req.body;

    try {
      const contract = await Contract.findOneAndUpdate(
        { _id: contractId },
        {
          status: contractStatus,
        },
        {
          new: true,
        }
      );
      if (contract) {
        Promise.all([
          gigController.updateGigStatus(gigId, "Processing"),
          new ChatController(req, res).summaryPostHandler(
            conversationID,
            summaryText,
            userId
          ),
        ]);
      }
      res.send(contract);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice gets a users contracts
  getUserContracts = async (req: Request, res: Response) => {
    const { role, id } = req.query;
    try {
      let contract;
      switch (role) {
        case "client":
          contract = await Contract.find({ clientId: id })
            .populate("clientId freelancerId gigId")
            .sort({ updatedAt: -1 });
          break;
        case "freelancer":
          contract = await Contract.find({ freelancerId: id })
            .populate("clientId freelancerId gigId")
            .sort({ updatedAt: -1 });
          break;
        default:
          res.status(400).json("error getting user contracts");
      }

      res.send(contract);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice hire a freelancer
  hireFreelancer = async (req: Request, res: Response) => {
    const { clientId, gigId, freelancerId, txHash, amount, conversationID } =
      req.body;

    try {
      const newContract = new Contract({
        clientId: clientId,
        gigId: gigId,
        freelancerId: freelancerId,
        txHash: txHash,
        amount: amount,
        conversationID: conversationID,
      });

      const contract = await newContract.save();

      if (contract) {
        await Promise.all([
          new ChatController(req, res).addContractIdToConvo(
            conversationID,
            contract._id
          ),
          gigController.updateGigStatus(gigId, "Pending"),
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
          ),
        ]);
      }
      res.send(contract);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice get all contracts
  getAllContracts = async (req: Request, res: Response) => {
    // get all contracts from database
    try {
      const contracts = await Contract.find().sort({
        $natural: -1,
      });
      res.send(contracts);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice reject contract
  rejectContract = async (req: Request, res: Response) => {
    const { gigId, freelancerId, conversationID, contractId } = req.body;

    try {
      const result = await Promise.all([
        new ChatController(req, res).summaryPostHandler(
          conversationID,
          "rejected the offer for this project",
          freelancerId
        ),
        gigController.awardFreelancer(gigId, freelancerId, "listed"),
        Contract.findOneAndUpdate(
          { _id: contractId },
          {
            status: "Rejected",
          },
          {
            new: true,
          }
        ),
      ]);
      res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice release funds
  releaseFunds = async (req: Request, res: Response) => {
    const { gigId, userId, conversationID, contractId } = req.body; // Extract required data from request body

    // Create promise array to handle async functions for updating gig status and contract status
    try {
      const result = await Promise.all([
        gigController.updateGigStatus(gigId, "Processing"),
        Contract.findOneAndUpdate(
          { _id: contractId },
          {
            status: "Release",
          },
          {
            new: true,
          }
        ),
        // Send summary message data as response
        new ChatController(req, res).summaryPostHandler(
          conversationID,
          "initiated release of funds",
          userId
        ),
      ]);

      res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  };
}

export default new contractController();

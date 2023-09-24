import { Request } from "express";
import ChatController from "./chat.controller";
import gigController from "./gig.controller";
import proposalController from "./proposal.controller";
import Contract from "../models/Contract";

class contractController {
  acceptContract = async (req: Request) => {
    const { gigId, freelancerId, proposalId, conversationID } = req.body;
    try {
      const [result] = await Promise.all([
        ChatController.summaryPostHandler({
          body: {
            conversationID: conversationID,
            sender: freelancerId,
            summary: "accepted the offer for this project",
          },
        } as Request),
        proposalController.acceptProposal(proposalId),
        gigController.awardFreelancer({
          body: { id: gigId, freelancerId: freelancerId, status: "Active" },
        } as Request),
      ]);
      return result;
    } catch (error) {
      return error;
    }
  };

  approveRefund = async (req: Request) => {
    const {
      userId,
      conversationID,
      contractId,
      contractStatus,
      summaryText,
      gigId,
    } = req.body;

    await Contract.findOneAndUpdate(
      { _id: contractId },
      {
        status: contractStatus,
      },
      {
        new: true,
      }
    )
      .then(() => {
        gigController.updateGigStatus({
          body: { status: "Processing", id: gigId },
        } as Request);
        ChatController.summaryPostHandler({
          body: {
            conversationID: conversationID,
            sender: userId,
            summary: summaryText,
          },
        } as Request);
      })
      .catch((error) => {
        return error;
      });
  };

  getContractsHandler = async (req: Request) => {
    const { role, id } = req.query;
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
        return "user does not exist";
    }

    return contract;
  };

  hireFreelancer = async (req: Request) => {
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
          ChatController.addContractIdToConvo({
            body: { id: conversationID, contractId: contract._id },
          } as Request),
          gigController.updateGigStatus({
            body: { id: gigId, status: "Pending" },
          } as Request),
          ChatController.summaryPostHandler({
            body: {
              conversationID: conversationID,
              sender: clientId,
              summary: `funded escrow contract with ${
                contract.gigId.currency === "solana"
                  ? "◎"
                  : contract.gigId.currency === "usd"
                  ? "$"
                  : "no currency"
              }${amount}`,
            },
          } as Request),
        ]);
      }
      return contract;
    } catch (error) {
      return error;
    }
  };

  getHandler = async (req: Request) => {
    // get all contracts from database
    await Contract.find()
      .sort({
        $natural: -1,
      })
      .then((contracts) => {
        return contracts;
      })
      .catch((error) => {
        return error;
      });
  };

  rejectContract = async (req: Request) => {
    const { gigId, freelancerId, conversationID, contractId } = req.body;

    await Promise.all([
      ChatController.summaryPostHandler({
        body: {
          conversationID: conversationID,
          sender: freelancerId,
          summary: "rejected the offer for this project",
        },
      } as Request),
      gigController.awardFreelancer({
        body: {
          id: gigId,
          status: "listed",
        },
      } as Request),
      Contract.findOneAndUpdate(
        { _id: contractId },
        {
          status: "Rejected",
        },
        {
          new: true,
        }
      ),
    ])
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error;
      });
  };

  releaseFunds = async (req: Request) => {
    const { gigId, userId, conversationID, contractId } = req.body; // Extract required data from request body

    // Create promise array to handle async functions for updating gig status and contract status
    await Promise.all([
      gigController.updateGigStatus({
        body: {
          id: gigId,
          status: "Processing",
        },
      } as Request),
      Contract.findOneAndUpdate(
        { _id: contractId },
        {
          status: "Release",
        },
        {
          new: true,
        }
      ),
    ]);

    // Send summary message data as response
    const result = await ChatController.summaryPostHandler({
      body: {
        conversationID: conversationID,
        sender: userId,
        summary: "initiated release of funds",
      },
    } as Request);
    return result;
  };
}

export default new contractController();

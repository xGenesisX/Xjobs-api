import mongoose from "mongoose";
import Contract from "../models/Contract";
import ChatController from "./conversation.service";
import gigController from "./gig.service";
import proposalController from "./proposal.service";

class contractController {
  // @notice accepts a contract
  acceptContract = async (
    gigId: mongoose.Schema.Types.ObjectId,
    freelancerId: mongoose.Schema.Types.ObjectId,
    proposalId: mongoose.Schema.Types.ObjectId
  ) => {
    try {
      const result = await Promise.all([
        proposalController.acceptProposal(proposalId),
        gigController.awardFreelancer(gigId, freelancerId, "Active"),
      ]);
      if (result) {
        return "Contract accepted";
      }
    } catch (error) {
      return error;
    }
  };

  // @notice approve a refund
  approveRefund = async (
    contractId: mongoose.Schema.Types.ObjectId,
    contractStatus: any,
    gigId: mongoose.Schema.Types.ObjectId
  ) => {
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
        Promise.all([gigController.updateGigStatus(gigId, "Processing")]);
      }
      return contract;
    } catch (error) {
      return error;
    }
  };

  // @notice gets a users contracts
  getUserContracts = async (
    role: string,
    id: mongoose.Schema.Types.ObjectId
  ) => {
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
          return "error getting user contracts";
      }

      return contract;
    } catch (error) {
      return error;
    }
  };

  // @notice hire a freelancer
  hireFreelancer = async (
    clientId: mongoose.Schema.Types.ObjectId,
    gigId: mongoose.Schema.Types.ObjectId,
    freelancerId: mongoose.Schema.Types.ObjectId,
    txHash: any,
    amount: any,
    conversationID: mongoose.Schema.Types.ObjectId
  ) => {
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
          // new ChatController(req, res).addContractIdToConvo(conversationID, contract._id),
          gigController.updateGigStatus(gigId, "Pending"),
          //   new ChatController(req, res).summaryPostHandler(
          //     conversationID,
          //     `funded escrow contract with ${
          //       contract.gigId.currency === 'solana' ? '◎' : contract.gigId.currency === 'usd' ? '$' : 'no currency'
          //     }${amount}`,
          //     clientId
          //   ),
        ]);
      }
      return contract;
    } catch (error) {
      return error;
    }
  };

  // @notice get all contracts
  getAllContracts = async () => {
    // get all contracts from database
    try {
      const contracts = await Contract.find().sort({
        $natural: -1,
      });
      return contracts;
    } catch (error) {
      return error;
    }
  };

  // @notice reject contract
  rejectContract = async (
    gigId: mongoose.Schema.Types.ObjectId,
    freelancerId: mongoose.Schema.Types.ObjectId,
    contractId: mongoose.Schema.Types.ObjectId
  ) => {
    try {
      const result = await Promise.all([
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
      return result;
    } catch (error) {
      return error;
    }
  };

  // @notice release funds
  releaseFunds = async (
    gigId: mongoose.Schema.Types.ObjectId,
    contractId: mongoose.Schema.Types.ObjectId
  ) => {
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
      ]);

      return result;
    } catch (error) {
      return error;
    }
  };
}

export default new contractController();

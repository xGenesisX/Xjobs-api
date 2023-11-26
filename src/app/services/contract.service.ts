import mongoose from "mongoose";
import { roles } from "../config/roles";
import Contract, { IContract } from "../models/Contract";
import gigController from "./gig.service";
import proposalController from "./proposal.service";

class contractController {
  // @notice accepts a contract
  acceptContract = async (
    gigId: mongoose.Types.ObjectId,
    freelancerId: mongoose.Types.ObjectId,
    proposalId: mongoose.Types.ObjectId
  ) => {
    const result = await Promise.all([
      proposalController.acceptProposal(proposalId),
      gigController.awardFreelancer(gigId, freelancerId, "Active"),
    ]);
    if (result) {
      return "Contract accepted";
    }
  };

  // @notice approve a refund
  approveRefund = async (
    contractId: mongoose.Types.ObjectId,
    contractStatus: string,
    gigId: mongoose.Types.ObjectId
  ) => {
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
  };

  // @notice gets a users contracts
  getUserContracts = async (role: string, id: mongoose.Types.ObjectId) => {
    let contract;
    switch (role) {
      case roles[0]:
        contract = await Contract.find({ clientId: id })
          .populate("clientId freelancerId gigId")
          .sort({ updatedAt: -1 });
        break;
      case roles[1]:
        contract = await Contract.find({ freelancerId: id })
          .populate("clientId freelancerId gigId")
          .sort({ updatedAt: -1 });
        break;
      default:
        return "error getting user contracts";
    }

    return contract;
  };

  // @notice hire a freelancer
  hireFreelancer = async (
    clientId: mongoose.Types.ObjectId,
    gigId: mongoose.Types.ObjectId,
    freelancerId: mongoose.Types.ObjectId,
    txHash: string,
    amount: number,
    conversationID: mongoose.Types.ObjectId
  ): Promise<IContract> => {
    const newContract = new Contract({
      clientId: clientId,
      gigId: gigId,
      freelancerId: freelancerId,
      txHash: txHash,
      amount: amount,
      conversationID: conversationID,
    }).save();

    await gigController.updateGigStatus(gigId, "Pending");

    return newContract;
  };

  // @notice get all contracts
  getAllContracts = async () => {
    // get all contracts from database
    const contracts = await Contract.find().sort({
      $natural: -1,
    });
    return contracts;
  };

  // @notice reject contract
  rejectContract = async (
    gigId: mongoose.Types.ObjectId,
    freelancerId: mongoose.Types.ObjectId,
    contractId: mongoose.Types.ObjectId
  ) => {
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
  };

  // @notice release funds
  releaseFunds = async (
    gigId: mongoose.Types.ObjectId,
    contractId: mongoose.Types.ObjectId
  ) => {
    // Create promise array to handle async functions for updating gig status and contract status
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
  };
}

export default new contractController();

import mongoose from "mongoose";
import {
  default as Gig,
  IProposal,
  default as Proposal,
} from "../models/Proposal";
import User from "../models/User";

class proposalService {
  // @notice create a new proposal
  createNewProposal = async (
    gigId: mongoose.Types.ObjectId,
    freelancerId: mongoose.Types.ObjectId,
    coverLetter: string
  ) => {
    const gig = await Gig.findById(gigId);
    if (gig) {
      const proposal: IProposal = await Proposal.create({
        freelancerId: freelancerId,
        gigId: gigId,
        coverLetter: coverLetter,
      });

      if (proposal) {
        const propId = proposal._id.toString();

        await Promise.all([
          await Gig.findByIdAndUpdate(
            { _id: gigId },
            {
              $addToSet: { proposals: proposal },
            }
          ),
          User.findByIdAndUpdate(
            {
              _id: freelancerId,
            },
            { $addToSet: { submittedProposals: propId } }
          ),
        ]);
        return proposal;
      }
    }
  };

  // @notice get a proposal with a given id
  getAProposal = async (gigId: mongoose.Types.ObjectId) => {
    const gig = await Gig.findById(gigId).populate({
      path: "proposals",
      populate: { path: "freelancerId", model: "User" },
    });
    return gig;
  };

  // @notice get a job proposal with a given id
  getJobProposal = async (gigId: mongoose.Types.ObjectId) => {
    const proposal = await Gig.findById(gigId)
      .populate("awardedFreelancer")
      .populate({
        path: "proposals",
        populate: { path: "freelancerId", model: "User" },
      });
    return proposal;
  };

  // @notice accept a proposal with a given id
  acceptProposal = async (id: mongoose.Types.ObjectId) => {
    const proposal = await Proposal.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          accepted: true,
        },
      },
      {
        new: true,
      }
    );
    return proposal;
  };

  // @notice check if a proposal exists
  checkIfProposalExists = async (
    freelancerId: mongoose.Types.ObjectId,
    gigID: mongoose.Types.ObjectId
  ) => {
    const proposal = await Proposal.findOne({
      freelancerId: freelancerId,
      gigId: gigID,
    })
      .select("_id")
      .then((res: any) => {
        if (res._id) {
          User.findById(freelancerId).then((user: any) => {
            const propId = res._id.toString();
            const subProp = user.submittedProposals;
            if (subProp.includes(propId)) {
              return { message: "user has already applied" };
            }
          });
        }
      });
    return proposal;
  };

  // @notice update a proposal with a given id
  updateProposalConversationID = async (
    id: mongoose.Types.ObjectId,
    conversationID: mongoose.Types.ObjectId
  ) => {
    const proposal = await Proposal.findOneAndUpdate(
      { _id: id },
      { conversationID: conversationID },
      {
        new: true,
      }
    );
    return proposal;
  };

  // @notice get a proposal with a given id
  getProposalById = async (id: mongoose.Types.ObjectId) => {
    const proposals = await Proposal.find({
      freelancerId: id,
    })
      .populate("gigId")
      .sort({ $natural: -1 });
    return proposals;
  };

  // @notice get proposal for a gig
  getProposalsForGig = async (gigId: mongoose.Types.ObjectId) => {
    const proposal = await Proposal.findById(gigId).populate({
      path: "proposals",
      populate: { path: "freelancerId", model: "User" },
    });
    return proposal;
  };
}

export default new proposalService();

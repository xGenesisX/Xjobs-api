import { Request, Response } from "express";
import Gig from "../models/Gig";
import Proposal from "../models/Proposal";
import User from "../models/User";
import mongoose from "mongoose";

class proposalController {
  // @notice create a new proposal
  createNewProposal = async (req: Request, res: Response) => {
    const { gigId, freelancerId, coverLetter } = req.body;

    try {
      const gig = await Gig.findById(gigId);
      if (gig) {
        const proposal = await Proposal.create({
          freelancerId: freelancerId,
          gigId: gigId,
          coverLetter: coverLetter,
        });

        if (proposal) {
          const propId = proposal._id.toString();

          await Promise.all([
            gig.proposals.push(proposal),
            User.findByIdAndUpdate(
              {
                _id: freelancerId,
              },
              { $addToSet: { submittedProposals: propId } }
            ),
          ]);

          await gig.save();

          res.send(proposal);
        }
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };

  // @notice get a proposal with a given id
  getAProposal = async (req: Request, res: Response) => {
    const { gigId } = req.body;
    try {
      const gig = await Gig.findById(gigId).populate({
        path: "proposals",
        populate: { path: "freelancerId", model: "User" },
      });
      res.send(gig);
    } catch (error) {
      res.json(error);
    }
  };

  // @notice get a job proposal with a given id
  getJobProposal = async (req: Request, res: Response) => {
    const { gigId } = req.body;
    try {
      const proposal = await Gig.findById(gigId)
        .populate("awardedFreelancer")
        .populate({
          path: "proposals",
          populate: { path: "freelancerId", model: "User" },
        });
      res.send(proposal);
    } catch (error) {
      res.json(error);
    }
  };

  // @notice accept a proposal with a given id
  acceptProposal = async (id: mongoose.Types.ObjectId) => {
    try {
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
    } catch (error) {
      return error;
    }
  };

  // @notice check if a proposal exists
  checkIfProposalExists = async (req: Request, res: Response) => {
    const { freelancerId, gigID } = req.body;

    try {
      const proposal = await Proposal.findOne({
        freelancerId: freelancerId,
        gigId: gigID,
      })
        .select("_id")
        .then((res) => {
          if (res._id) {
            User.findById(freelancerId).then((user) => {
              const propId = res._id.toString();
              const subProp = user.submittedProposals;
              if (subProp.includes(propId)) {
                return { message: "user has already applied" };
              }
            });
          }
        });
      res.send(proposal);
    } catch (error) {
      res.send(error);
    }
  };

  // @notice update a proposal with a given id
  updateProposalConversationID = async (req: Request, res: Response) => {
    const { id, conversationID } = req.body;

    try {
      const proposal = await Proposal.findOneAndUpdate(
        { _id: id },
        { conversationID: conversationID },
        {
          new: true,
        }
      );
      res.send(proposal);
    } catch (error) {
      res.json(error);
    }
  };

  // @notice get a proposal with a given id
  getProposalById = async (req: Request, res: Response) => {
    const { id } = req.query;
    try {
      const proposals = await Proposal.find({
        freelancerId: id,
      })
        .populate("gigId")
        .sort({ $natural: -1 });
      res.send(proposals);
    } catch (error) {
      res.send(error);
    }
  };

  // @notice get proposal for a gig
  getProposalsForGig = async (req: Request, res: Response) => {
    const { gigId } = req.body;
    try {
      const proposal = await Proposal.findById(gigId).populate({
        path: "proposals",
        populate: { path: "freelancerId", model: "User" },
      });
      res.send(proposal);
    } catch (error) {
      res.send(error);
    }
  };
}

export default new proposalController();

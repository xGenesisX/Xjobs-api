import { Request, Response } from "express";
import slugify from "slugify";
import CancelGig from "../models/CancelGig";
import Gig from "../models/Gig";
import User from "../models/User";
import ChatController from "./chat.controller";
import profileController from "./profile.controller";
// import Joi from "@hapi/joi";
import mongoose from "mongoose";
import Email from "../utils/mailer";

class gigController {
  // @notice get a gig by its id
  getGigById = async (req: Request, res: Response) => {
    const { id } = req.body;
    const filter = ["listed", "Pending"]; // Define filter for gig status

    // Find and return gig object that matches the given ID and satisfies the filter criteria
    try {
      const gig = await Gig.findOne({
        _id: id,
        approvedForMenu: true,
        status: { $in: filter },
      });
      res.send(gig);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  // @notice get a gig owner by its id
  getOwnerGigById = async (req: Request, res: Response) => {
    const { id, address } = req.body;
    // Find and return gig object that matches the given ID and owner address
    try {
      const gig = await Gig.findOne({
        _id: id,
        ownerAddress: address,
      });
      res.send(gig);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  // @notice get a users gigs
  getMyJobs = async (req: Request, res: Response) => {
    const { id, status } = req.body; // Extract required data from request body

    // Find and return array of gig objects that are awarded to the given freelancer and match the given status
    try {
      const gig = await Gig.find({
        awardedFreelancer: id,
        status: status,
      }).sort({
        $natural: -1,
      });
      res.send(gig);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  // @notice get a gig by its owner
  getGigByOwner = async (req: Request, res: Response) => {
    const { address } = req.body;
    // Find and return array of gig objects that are owned by the given owner
    try {
      const gig = await Gig.find({
        ownerAddress: address,
      }).sort({ $natural: -1 });
      res.send(gig);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice update a gigs details
  updateGigDetails = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
      const gig = await Gig.findOneAndUpdate(
        { _id: id },
        {
          ...req.body,
          approvedForMenu: false,
        },
        {
          new: true,
        }
      );
      res.send(gig);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice awards a gig to a freelancer
  awardFreelancer = async (
    id: mongoose.Types.ObjectId,
    freelancerId: mongoose.Types.ObjectId,
    status: string
  ) => {
    try {
      if (status === "Active") {
        const gig = await Gig.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              awardedFreelancer: freelancerId,
              isAwarded: true,
              status: status,
            },
          },
          {
            new: true,
          }
        );

        return gig;
      } else {
        const gig = await Gig.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              status: status,
            },
          },
          {
            new: true,
          }
        );

        return gig;
      }
    } catch (error) {
      return error;
    }
  };

  // @notice update a gig status
  updateGigStatus = async (id: mongoose.Types.ObjectId, status: string) => {
    try {
      const gig = await Gig.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            status: status,
          },
        },
        {
          new: true,
        }
      );
      return gig;
    } catch (error) {
      return error;
    }
  };

  // @notice bookmark a gig
  bookmarkGig = async (req: Request, res: Response) => {
    const { id, GigId } = req.body;

    // Find and update user document with new bookmarked gig
    try {
      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $addToSet: { bookmarkedGigs: GigId },
        },
        {
          new: true,
        }
      );

      res.send(updatedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice create a new gig
  createGig = async (req: Request, res: Response) => {
    const {
      title,
      currency,
      ownerAddress,
      clientName,
      company,
      timezone,
      category,
      gig_description,
      skills_required,
      url,
      timeframe,
      status,
      owner,
    } = req.body;

    try {
      const newGig = new Gig({
        owner,
        currency,
        ownerAddress,
        clientName,
        company,
        timeframe,
        timezone,
        category,
        gig_description,
        skills_required,
        url,
        status,
        slug: slugify(title, +"_" + Date.now().toString()),
      });
      const gig = await newGig.save();

      const user = await profileController.getUserWithId(gig.owner);

      new Email(user.email_address, user.name).gigProcessing();

      res.send(gig);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  // @notice list gigs by its owner
  listGigByOwner = async (req: Request, res: Response) => {
    const { address } = req.body;
    try {
      const gig = await Gig.find({
        ownerAddress: address,
      }).sort({ $natural: -1 });
      res.send(gig);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  // @notice unbookmark a gig
  removeBookmark = async (req: Request, res: Response) => {
    const { id, GigId } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $pull: { bookmarkedGigs: GigId },
        },
        {
          new: true,
        }
      );

      res.send(updatedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // @notice gets all gigs in the system
  getAllGigs = async (req: Request, res: Response) => {
    let pageVar;
    const { page, filter } = req.body; // Set default values for page and filter

    if (page) {
      pageVar = parseInt(page);
    } else {
      pageVar = 1;
    }

    const limit = 5;
    const skip = (pageVar - 1) * limit;

    try {
      let gigs = await Gig.find({
        approvedForMenu: true,
        isAwarded: false,
        categories: { $in: filter },
      })
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      res.send(gigs);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  // @notice cancel a gig
  cancelGig = async (req: Request, res: Response) => {
    const {
      clientId,
      gigId,
      freelancerId,
      contractID,
      reason,
      conversationID,
    } = req.body;

    try {
      const newCancellationRequest = new CancelGig({
        clientId: clientId,
        gigId: gigId,
        freelancerId: freelancerId,
        contractID: contractID,
        conversationID: conversationID,
        reason: reason,
      });

      const cancel = newCancellationRequest.save();

      if (cancel) {
        await Promise.all([
          this.updateGigStatus(gigId, "Cancelled"),
          new ChatController(req, res).summaryPostHandler(
            conversationID,
            "requested a refund and to cancel this project",
            clientId
          ),
        ]);
      }

      res.status(200).json("Cancellation request sent");
    } catch (error) {
      res.status(400).send(error);
    }
  };
}

export default new gigController();

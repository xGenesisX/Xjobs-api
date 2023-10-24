import mongoose from "mongoose";
import slugify from "slugify";
import cancelGigService from "./cancelGig.service";
import Gig from "../models/Gig";
import User from "../models/User";

class gigController {
  // @notice get a gig by its id
  getGigById = async (id: mongoose.Types.ObjectId) => {
    // const { id } = req.body;
    const filter = ["listed", "Pending"]; // Define filter for gig status

    // Find and return gig object that matches the given ID and satisfies the filter criteria
    try {
      const gig = await Gig.findOne({
        _id: id,
        approvedForMenu: true,
        status: { $in: filter },
      });
      return gig;
    } catch (error) {
      return error;
    }
  };

  // @notice get a gig owner by its id
  getOwnerGigById = async (id: mongoose.Types.ObjectId, address: string) => {
    // Find and return gig object that matches the given ID and owner address
    try {
      const gig = await Gig.findOne({
        _id: id,
        ownerAddress: address,
      });
      return gig;
    } catch (error) {
      return error;
    }
  };

  // @notice get a users gigs
  getMyJobs = async (id: mongoose.Types.ObjectId, status: string) => {
    // const { id, status } = req.body; // Extract required data from request body

    // Find and return array of gig objects that are awarded to the given freelancer and match the given status
    try {
      const gig = await Gig.find({
        awardedFreelancer: id,
        status: status,
      }).sort({
        $natural: -1,
      });
      return gig;
    } catch (error) {
      return error;
    }
  };

  // @notice get a gig by its owner
  getGigByOwner = async (address: string) => {
    // Find and return array of gig objects that are owned by the given owner
    try {
      const gig = await Gig.find({
        ownerAddress: address,
      }).sort({ $natural: -1 });
      return gig;
    } catch (error) {
      // res.status(400).send(error);
      return error;
    }
  };

  // @notice update a gigs details
  updateGigDetails = async (id: mongoose.Types.ObjectId) => {
    try {
      const gig = await Gig.findOneAndUpdate(
        { _id: id },
        {
          // ...req.body,
          approvedForMenu: false,
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
  bookmarkGig = async (
    id: mongoose.Types.ObjectId,
    GigId: mongoose.Types.ObjectId
  ) => {
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

      return updatedUser;
    } catch (error) {
      return error;
    }
  };

  // @notice create a new gig
  createGig = async (
    title: string,
    currency: string,
    ownerAddress: string,
    clientName: string,
    company: string,
    timezone: any,
    category: any,
    gig_description: string,
    skills_required: any,
    url: string,
    timeframe: string,
    status: string,
    owner: mongoose.Types.ObjectId
  ) => {
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

      //   const user = await profileController.getUserWithId(gig.owner);

      //   new Email(user.email_address, user.name).gigProcessing();

      return gig;
    } catch (error) {
      // res.status(400).json(error);
      return error;
    }
  };

  // @notice list gigs by its owner
  listGigByOwner = async (address: string) => {
    try {
      const gig = await Gig.find({
        ownerAddress: address,
      }).sort({ $natural: -1 });
      return gig;
    } catch (error) {
      return error;
    }
  };

  // @notice unbookmark a gig
  removeBookmark = async (
    id: mongoose.Types.ObjectId,
    GigId: mongoose.Types.ObjectId
  ) => {
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

      return updatedUser;
    } catch (error) {
      return error;
    }
  };

  // @notice gets all gigs in the system
  getAllGigs = async (page: string, filter: any) => {
    let pageVar;
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

      return gigs;
    } catch (error) {
      return error;
    }
  };

  // @notice cancel a gig
  cancelGig = async (
    clientId: mongoose.Types.ObjectId,
    gigId: mongoose.Types.ObjectId,
    freelancerId: mongoose.Types.ObjectId,
    contractID: mongoose.Types.ObjectId,
    reason: string,
    conversationID: mongoose.Types.ObjectId
  ) => {
    try {
      await cancelGigService.cancelGig(
        clientId,
        gigId,
        freelancerId,
        contractID,
        conversationID,
        reason
      );

      await Promise.all([this.updateGigStatus(gigId, "Cancelled")]);

      return "cancel request sent";
    } catch (error) {
      return error;
    }
  };
}

export default new gigController();

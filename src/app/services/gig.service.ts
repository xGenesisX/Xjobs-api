import mongoose from "mongoose";
import slugify from "slugify";
import cancelGigService from "./cancelGig.service";
import Gig from "../models/Gig";
import User from "../models/User";
import { freelancerNotification, gigProcessing } from "./email.service";
import userService from "./user.service";

class gigController {
  // @notice get a gig by its id
  getGigById = async (id: mongoose.Types.ObjectId) => {
    const filter = ["listed", "Pending"]; // Define filter for gig status

    // Find and return gig object that matches the given ID and satisfies the filter criteria
    const gig = await Gig.findOne({
      _id: id,
      approvedForMenu: true,
      status: { $in: filter },
    });
    return gig;
  };

  // @notice get a gig owner by its id
  getOwnerGigById = async (id: mongoose.Types.ObjectId, address: string) => {
    // Find and return gig object that matches the given ID and owner address
    const gig = await Gig.findOne({
      _id: id,
      ownerAddress: address,
    });
    return gig;
  };

  // @notice get a users gigs
  getMyJobs = async (id: mongoose.Types.ObjectId, status: string) => {
    // Find and return array of gig objects that are awarded to the given freelancer and match the given status
    const gig = await Gig.find({
      awardedFreelancer: id,
      status: status,
    }).sort({
      $natural: -1,
    });
    return gig;
  };

  // @notice get a gig by its owner
  getGigByOwner = async (address: string) => {
    // Find and return array of gig objects that are owned by the given owner
    const gig = await Gig.find({
      ownerAddress: address,
    }).sort({ $natural: -1 });
    return gig;
  };

  // @notice update a gigs details
  updateGigDetails = async (id: mongoose.Types.ObjectId) => {
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
  };

  // @notice awards a gig to a freelancer
  awardFreelancer = async (
    id: mongoose.Types.ObjectId,
    freelancerId: mongoose.Types.ObjectId,
    status: string
  ) => {
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
  };

  // @notice update a gig status
  updateGigStatus = async (id: mongoose.Types.ObjectId, status: string) => {
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
  };

  // @notice bookmark a gig
  bookmarkGig = async (
    id: mongoose.Types.ObjectId,
    GigId: mongoose.Types.ObjectId
  ) => {
    // Find and update user document with new bookmarked gig
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

    const user = await userService.getUserProfileWithId(newGig.owner);

    const gig = await Promise.all([
      newGig.save(),
      freelancerNotification(user?.email_address, user?.name),
      gigProcessing(user?.email_address, user?.name),
    ]);

    return gig;
  };

  // @notice list gigs by its owner
  listGigByOwner = async (address: string) => {
    const gig = await Gig.find({
      ownerAddress: address,
    }).sort({ $natural: -1 });
    return gig;
  };

  // @notice unbookmark a gig
  removeBookmark = async (
    id: mongoose.Types.ObjectId,
    GigId: mongoose.Types.ObjectId
  ) => {
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
  };
}

export default new gigController();

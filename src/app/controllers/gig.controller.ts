import { Request } from "express";
import slugify from "slugify";
import CancelGig from "../models/CancelGig";
import Gig from "../models/Gig";
import User from "../models/User";
import ChatController from "./chat.controller";
import { Query } from "../interfaces/Query";
import Joi from "@hapi/joi";

class gigController {
  constructor() {}

  // @notice get a gig by its id
  getGigById = async (req: Request) => {
    const { id } = req.body;
    const filter = ["listed", "Pending"]; // Define filter for gig status

    // Find and return gig object that matches the given ID and satisfies the filter criteria
    return await Gig.findOne({
      _id: id,
      approvedForMenu: true,
      status: { $in: filter },
    });
  };

  // @notice get a gig owner by its id
  getOwnerGigById = async (req: Request) => {
    const { id, address } = req.body;
    // Find and return gig object that matches the given ID and owner address
    return await Gig.findOne({
      _id: id,
      ownerAddress: address,
    });
  };

  // @notice get a users gigs
  getMyJobs = async (req: Request) => {
    const { id, status } = req.body; // Extract required data from request body

    // Find and return array of gig objects that are awarded to the given freelancer and match the given status
    return await Gig.find({
      awardedFreelancer: id,
      status: status,
    }).sort({
      $natural: -1,
    });
  };

  // @notice get a gig by its owner
  getGigByOwner = async (req: Request) => {
    const { address } = req.body;
    // Find and return array of gig objects that are owned by the given owner
    return await Gig.find({
      ownerAddress: address,
    }).sort({ $natural: -1 });
  };

  // @notice update a gigs details
  updateGigDetails = async (req: Request) => {
    const { id } = req.body;
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
    if (!gig) {
      return { message: "gig not found" };
    } else {
      return { message: "gig updated success" };
    }
  };

  // @notice awards a gig to a freelancer
  awardFreelancer = async (req: Request) => {
    const { id, freelancerId, status } = req.body;
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
    } catch (e) {
      return e;
    }
  };

  // @notice update a gig status
  updateGigStatus = async (req: Request) => {
    const { id, status } = req.body;

    await Gig.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: status,
        },
      },
      {
        new: true,
      }
    )
      .then((gig) => {
        return gig;
      })
      .catch((error) => {
        return error;
      });
  };

  // @notice bookmark a gig
  bookmarkGig = async (req: Request) => {
    const { id, GigId } = req.body;

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
  createGig = async (req: Request) => {
    const { title } = req.body;

    const schema = Joi.object().keys({
      name: Joi.string().required(),
      street_address: Joi.string().required(),
      number_address: Joi.number().required(),
      city_address: Joi.string().required(),
      state_address: Joi.string().required(),
      country_address: Joi.string().required(),
      file_id: Joi.number(),
      is_closed: Joi.boolean(),
    });
    // Create new gig document and save to database
    const newGig = new Gig({
      ...req.body,
      slug: slugify(title, +"_" + Date.now().toString()),
    });
    const gig = await newGig.save();

    return gig;
  };

  // @notice list gigs by its owner
  listGigByOwner = async (req: Request) => {
    const { address } = req.body;
    let gig = await Gig.find({
      ownerAddress: address,
    }).sort({ $natural: -1 });
    return gig;
  };

  // @notice unbookmark a gig
  removeBookmark = async (req: Request) => {
    const { id, GigId } = req.body;

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
  getAllGigs = async (req: Request) => {
    let pageVar;
    const { page = 1, filter = [] } = req.body; // Set default values for page and filter

    if (page) {
      pageVar = parseInt(page);
    } else {
      pageVar = 1;
    }

    const limit = 5;
    const skip = (pageVar - 1) * limit;

    const query: Query = {
      approvedForMenu: true,
      isAwarded: false,
    };

    // if (filter.length) query.category?.value = { $in: filter };
    // if (filter.length) query["category.value"] = { $in: filter };

    const gigs = await Gig.find(query)
      .sort({ $natural: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { gigs };
  };

  // @notice cancel a gig
  cancelGig = async (req: Request) => {
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

      const cancel = await newCancellationRequest.save();

      if (cancel) {
        await this.updateGigStatus({
          body: {
            id: gigId,
            status: "Refund",
          },
        } as Request)
          .then(() => {
            ChatController.summaryPostHandler({
              body: {
                conversationID: conversationID,
                summary: "requested a refund and to cancel this project",
                sender: clientId,
              },
            } as Request);
            cancel();
          })
          .catch((error) => {
            return error;
          });
      }
      return { message: "Project failed to cancel" };
    } catch (error) {
      return error;
    }
  };
}

export default new gigController();

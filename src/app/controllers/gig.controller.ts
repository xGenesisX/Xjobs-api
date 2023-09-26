import { Request, Response } from "express";
import slugify from "slugify";
import CancelGig from "../models/CancelGig";
import Gig from "../models/Gig";
import User from "../models/User";
import ChatController from "./chat.controller";
import { Query } from "../interfaces/Query";
import Joi from "@hapi/joi";

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
      res.status(400).json("error getting gig by id");
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
      res.status(400).json("error getting gig by id");
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
      res.status(400).json("error getting my jobs");
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
      res.status(400).json("error getting gigs by owner");
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
      res.status(400).json("error updating gig");
    }
  };

  // @notice awards a gig to a freelancer
  awardFreelancer = async (
    id: string,
    freelancerId: string,
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
    } catch (e) {
      return "error awarding freelancer gig";
    }
  };

  // @notice update a gig status
  updateGigStatus = async (id: string, status: string) => {
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
      return "error updating gig status";
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
      res.status(400).json("error bookmarking gig");
    }
  };

  // @notice create a new gig
  createGig = async (req: Request, res: Response) => {
    const { title } = req.body;

    // populate the rest of the gig body
    //* validate the body as well

    // const schema = Joi.object().keys({
    //   name: Joi.string().required(),
    //   street_address: Joi.string().required(),
    //   number_address: Joi.number().required(),
    //   city_address: Joi.string().required(),
    //   state_address: Joi.string().required(),
    //   country_address: Joi.string().required(),
    //   file_id: Joi.number(),
    //   is_closed: Joi.boolean(),
    // });

    try {
      // Create new gig document and save to database
      const newGig = new Gig({
        ...req.body,
        slug: slugify(title, +"_" + Date.now().toString()),
      });
      const gig = await newGig.save();

      //* send a confirmation mail to ther user
      // that its gig has been created succesfully

      res.send(gig);
    } catch (error) {
      res.status(400).json("error creating gig");
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
      res.status(400).json("error listing gig by owner");
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
      res.status(400).json("error removing bookmark");
    }
  };

  // @notice gets all gigs in the system
  getAllGigs = async (req: Request, res: Response) => {
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

    try {
      const gigs = await Gig.find(query)
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      res.send(gigs);
    } catch (error) {
      res.status(400).json("error getting gig");
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

      const cancel = await newCancellationRequest.save();

      if (cancel) {
        await this.updateGigStatus(gigId, "Refund")
          .then(() => {
            new ChatController(req, res).summaryPostHandler(
              conversationID,
              "requested a refund and to cancel this project",
              clientId
            );
            cancel();
          })
          .catch((error) => {
            res.send(error);
          });
      }
    } catch (error) {
      res.status(400).json("error cancelling gig");
    }
  };
}

export default new gigController();

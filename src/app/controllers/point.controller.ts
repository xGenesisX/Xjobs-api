import User from "../models/User";
// send mail to receiver of tokens

class pointController {
  constructor() {}

  sendPointsToAUser = async (address: string, points: number) => {
    User.findOneAndUpdate(
      { address: address },
      { $inc: { points: points } },
      { new: true }
    );
  };

  createFreelancerAccount = async (userId: string) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { points: 5 } },
      { new: true }
    );
  };

  createClientAccount = async (userId: string) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { points: 7 } },
      { new: true }
    );
  };

  referNewUser = async (userId: string) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { points: 10 } },
      { new: true }
    );
  };

  completingAJob = async (userId: string) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { points: 30 } },
      { new: true }
    );
  };

  leavingReviews = async (userId: string) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { points: 10 } },
      { new: true }
    );
  };

  tweetingAboutXjobs = async (userId: string) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { points: 15 } },
      { new: true }
    );
  };

  VotingOnProposals = async (userId: string) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { points: 25 } },
      { new: true }
    );
  };

  GettingAGoodReview = async (userId: string) => {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { points: 20 } },
      { new: true }
    );
  };
}

export default new pointController();

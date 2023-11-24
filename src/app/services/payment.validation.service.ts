// validate payment coming form the frontend
import Gig from "../models/Gig";
import User from "../models/User";

// using the transaction hash
export class paymentValidation {
  validatePayment = async () => {
    User.findOne({ txHash: "" });
  };
}

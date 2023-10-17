import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  referralId: {
    type: String,
    unique: true,
  },
  referralLink: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Referral = mongoose.model('Referral', ReferralSchema);
export default Referral;

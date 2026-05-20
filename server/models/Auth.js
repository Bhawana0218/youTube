import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  name: String,
  channelname: String,
  description: String,
  image: String,
  phone: {
    type: String,
    default: null,
  },

  plan: {
    type: String,
    enum: ["free", "bronze", "silver", "gold"],
    default: "free",
  },

  watchLimitMinutes: {
    type: Number,
    default: 5,
  },

  premiumActivatedAt: {
    type: Date,
    default: null,
  },

  premiumPaymentId: {
    type: String,
    default: null,
  },

  joinedon: {
    type: Date,
    default: Date.now,
  },

  otp: {
    type: String,
    default: null,
  },

  otpExpiresAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("User", UserSchema);
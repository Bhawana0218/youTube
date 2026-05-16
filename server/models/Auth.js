import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String },
    channelname: { type: String },
    description: { type: String },
    image: { type: String },
    isPremium: { type: Boolean, default: false },
    premiumPlan: { type: String, default: "free" },
    premiumActivatedAt: { type: Date, default: null },
    premiumPaymentId: { type: String, default: null },
    joinedon: { type: Date, default: Date.now },

})

export default mongoose.model("User", UserSchema);

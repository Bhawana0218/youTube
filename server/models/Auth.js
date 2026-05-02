import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String },
    channelName: { type: String },
    description: { type: String },
    image: { tyepe: String },
    joinedon: { type: Date, default: Date.now },

})

export default mongoose.model("User", UserSchema);
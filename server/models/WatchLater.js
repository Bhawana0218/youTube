import mongoose from "mongoose";

const watchlaterSchema = new mongoose.Schema(
    {
        viewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        videoid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videofiles",
            required: true,
        },

        likedon: {
            type: Date, default: Date.now(),

        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("watchlater", watchlaterSchema);
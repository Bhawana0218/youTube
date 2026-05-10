import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
    {
        viewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        videoid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Videofiles",
            required: true,
        },

        likedon: {
            type: Date, deault: Date.now(),

        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("history", historySchema);
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        videoid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videofiles",
            required: true,
        },

        commnetbody: {
            type: String,
            trim: true,
        },
        commentbody: {
            type: String,
            trim: true,
        },
        usercommented: {
            type: String
        },
        city: {
            type: String,
            default: "Unknown City",
            trim: true,
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        dislikedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        commentedon: {
            type: Date,
            default: Date.now,

        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("comment", commentSchema);

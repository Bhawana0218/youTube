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
        },
        usercommented: {
            type: String
        },
        
        commentedon: {
            type: Date, deault: Date.now(),

        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("comment", commentSchema);
import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
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
    planAtDownload: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("download", downloadSchema);

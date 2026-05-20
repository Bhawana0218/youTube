import mongoose from "mongoose";
import Download from "../models/Download.js";
import User from "../models/Auth.js";
import Video from "../models/Video.js";

const FREE_DAILY_LIMIT = 1;

const getTodayRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};
export const requestDownload = async (req, res) => {
  try {
    const { userId, videoId } = req.body || {};

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(String(userId || ""))) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(String(videoId || ""))) {
      return res.status(400).json({
        message: "Invalid video ID",
      });
    }

    // Find user + video
    const [user, video] = await Promise.all([
      User.findById(userId),
      Video.findById(videoId),
    ]);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Premium check
    const isPremium = Boolean(user.isPremium);

    // Already downloaded check
    const existingDownload = await Download.findOne({
      viewer: userId,
      videoid: videoId,
    });

    if (existingDownload) {
      return res.status(200).json({
        success: true,
        alreadyDownloaded: true,
        message: "Video already downloaded",
        downloadUrl: `/uploads/${String(video.filepath || "")
          .split(/[\\/]/)
          .pop()}`,
      });
    }

    // Free limit check
    if (!isPremium) {
      const { start, end } = getTodayRange();

      const todayCount = await Download.countDocuments({
        viewer: userId,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      if (todayCount >= FREE_DAILY_LIMIT) {
        return res.status(403).json({
          message:
            "Free download limit reached. Upgrade to Premium.",
          requiresPremium: true,
          remainingToday: 0,
        });
      }
    }

    // Save download
    await Download.create({
      viewer: userId,
      videoid: videoId,
      planAtDownload: isPremium ? "premium" : "free",
    });

    // Count remaining downloads
    const { start, end } = getTodayRange();

    const todayCountAfter = await Download.countDocuments({
      viewer: userId,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Download allowed",
      downloadUrl: `/uploads/${String(video.filepath || "")
        .split(/[\\/]/)
        .pop()}`,
      fileName: video.videotitle || "video",
      isPremium,
      remainingToday: isPremium
        ? null
        : Math.max(
            FREE_DAILY_LIMIT - todayCountAfter,
            0
          ),
    });
  } catch (error) {
    console.log("Download request error:", error);

    return res.status(500).json({
      message:
        "Something went wrong while processing download.",
    });
  }
};

export const getDownloadsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(String(userId || ""))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const downloads = await Download.find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "Videofiles",
        select: "videotitle videochannel views createdAt filepath",
      })
      .sort({ createdAt: -1 });

    const validDownloads = downloads.filter((item) => Boolean(item.videoid));
    const staleIds = downloads.filter((item) => !item.videoid).map((item) => item._id);

    if (staleIds.length > 0) {
      await Download.deleteMany({ _id: { $in: staleIds } });
    }

    return res.status(200).json(validDownloads);
  } catch (error) {
    console.log("Get downloads error:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching downloads.",
    });
  }
};

import WatchLater from "../models/WatchLater.js";

export const handleWatchLater = async (req, res) => {

    const { userId } = req.body;
    const { videoId } = req.params;

    try {

        const existingWatchLater = await WatchLater.findOne({
            viewer: userId,
            videoid: videoId
        });

        if (existingWatchLater) {

            await WatchLater.findByIdAndDelete(
                existingWatchLater._id
            );

            return res.json({
                saved: false
            });

        } else {

            await WatchLater.create({
                viewer: userId,
                videoid: videoId
            });

            return res.json({
                saved: true
            });
        }

    } catch (error) {

        console.log("Error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
};

export const checkWatchLater = async (req, res) => {

    const { videoId } = req.params;
    const { userId } = req.query;

    try {

        const existing = await WatchLater.findOne({
            viewer: userId,
            videoid: videoId
        });

        return res.status(200).json({
            saved: !!existing
        });

    } catch (error) {

        console.log("Error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
};

export const getallWatchLaterVideo = async (req, res) => {

    const { userId } = req.params;

    try {

        const watchLaterVideos = await WatchLater.find({
            viewer: userId
        })
            .populate({
                path: "videoid",
                model: "Videofiles",
                select: "videotitle videochannel views createdAt filepath"
            });

        return res.status(200).json(watchLaterVideos);

    } catch (error) {

        console.log("Error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
};
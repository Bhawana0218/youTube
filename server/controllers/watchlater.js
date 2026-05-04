import Video from "../models/Video.js";
import WatchLater from "../models/WatchLater.js";

export const handleWatchLater = async (req, res) => {

    const { userId } = req.body;
    const { videoId } = req.params;

    try {
        const existingWatchLater = await WatchLater.findOne({
            viewer: userId,
            videoid: videoId
        });
        if (existingLike) {
            await WatchLater.findByIdAndDelete(existingWatchLater._id);

            return res.json({
                liked: false
            });
        } else {
            await Like.create({
                viewer: userId,
                videoid: videoId
            });

            return res.json({
                liked: true
            });
        }
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
};



export const getallWatchLaterVideo = async (req, res) => {
    const { userId } = req.params;
    try {
        const WatchLatervideo = await WatchLater.find({ viewer: userId })
            .populate({
                path: "videoid",
                model: "Videofiles",
            })
            .exec()
        return res.status(200).json(WatchLatervideo);
    } catch (error) {
        console.log("Error:", error)
        return res.status(500).json({ message: "Something went wrong. Please try again." });

    }
} 

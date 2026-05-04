import Video from "../models/Video.js";
import Like from "../models/Like.js";

export const handleLike = async (req, res) => {

    const { userId } = req.body;
    const { videoId } = req.params;

    try {
        const existingLike = await Like.findOne({
            viewer: userId,
            videoid: videoId
        });
        if (existingLike) {
         await Like.findByIdAndDelete(existingLike._id);
            await Video.findByIdAndUpdate(
                videoId,
                {
                    $inc: { like: -1 }
                }
            );
            return res.json({
                liked: false
            });
        } else {
         await Like.create({
                viewer: userId,
                videoid: videoId
            });
            await Video.findByIdAndUpdate(
                videoId,
                {
                    $inc: { like: 1 }
                }
            );
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



export const getallLikedVideo = async (req, res) => {
    const { userId } = req.params;
    try {
        const likevideo = await Like.find({ viewer: userId })
            .populate({
                path: "videoid",
                model: "Videofiles",
            })
            .exec()
        return res.status(200).json(likevideo);
    } catch (error) {
        console.log("Error:", error)
        return res.status(500).json({ message: "Something went wrong. Please try again." });

    }
} 

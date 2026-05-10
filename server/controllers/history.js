import Video from "../models/Video.js";
import History from "../models/History.js";

export const handlehistory = async (req, res) => {

    const { userId } = req.body;
    const { videoId } = req.params;

    try {
        const existinghistory = await History.findOne({
            viewer: userId,
            videoid: videoId
        });
        if (existinghistory) {
         await History.findByIdAndDelete(existinghistory._id);
            await Video.findByIdAndUpdate(
                videoId,
                {
                    $inc: { History: -1 }
                }
            );
            return res.json({
                history: false
            });
        } else {
         await History.create({
                viewer: userId,
                videoid: videoId
            });
            await Video.findByIdAndUpdate(
                videoId,
                {
                    $inc: { History: 1 }
                }
            );
            return res.json({
                history: true
            });
        }
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
};

export const handleviews= async (req, res) =>{
    const { videoId } = req.params;
    try{
         await WatchLater.findByIdAndUpdate(videoId, {$inc: {views: 1}});
    }catch(error){
        console.log("Error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
} 

export const getallHistoryVideo = async (req, res) => {

    const { userId } = req.params;
    if (!userId || userId === "undefined") {
        return res.status(400).json({
            message: "Invalid userId"
        });
    }
    try {
        const historyvideo = await History.find({ viewer: userId })
            .populate({
                path: "videoid",
                model: "Videofiles",
                select: "videotitle videochannel views createdAt filepath"
            })
            .sort({ createdAt: -1 });
        return res.status(200).json(historyvideo);
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
};
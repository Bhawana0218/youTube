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
            return res.json({
                history: false
            });
        } else {
         await History.create({
                viewer: userId,
                videoid: videoId
            });
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

        const validHistory = historyvideo.filter((item) => Boolean(item.videoid));
        const staleHistoryIds = historyvideo
            .filter((item) => !item.videoid)
            .map((item) => item._id);

        if (staleHistoryIds.length > 0) {
            await History.deleteMany({ _id: { $in: staleHistoryIds } });
        }

        return res.status(200).json(validHistory);
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
};

export const deleteHistory = async (req, res) => {
    const { historyId } = req.params;
    try {
        const historyItem = await History.findById(historyId);
        if (!historyItem) {
            return res.status(404).json({
                message: "History item not found"
            });
        }

        await History.findByIdAndDelete(historyId);
        return res.status(200).json({
            message: "History item removed successfully"
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
};

import mongoose from "mongoose";
import Video from "../models/Video.js";

export const uploadvideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload a valid video file." });
    }

    try {
        const file = new Video({
            videotitle: req.body.videotitle,
            filename: req.file.originalname,
            filepath: req.file.path,
            filetype: req.file.mimetype,
            filesize: req.file.size,
            videochannel: req.body.videochannel,
            uploader: req.body.uploader,
        });

        await file.save();
        return res.status(201).json({ message: "Video file uploaded successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

export const getallvideo = async (req, res) => {
    try {
        const files = await Video.find();
        return res.status(200).send(files);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

export const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video id" });
        }

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        return res.status(200).json(video);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getVideosByChannel = async (req, res) => {
    try {
        const { channelId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ message: "Invalid channel id" });
        }

        const videos = await Video.find({ uploader: channelId }).sort({ createdAt: -1 });

        return res.status(200).json(videos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

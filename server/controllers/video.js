import video from '../models/Video.js';

export const uploadvideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload a valid video file." });
    }

    try {
        const file = new video({
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
        const files = await video.find();
        return res.status(200).send(files);

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong. Please try again." });

    }
};

export const getVideoById = async (req, res) => {
    const { videoId } = req.params;
    try {
        const videoFile = await video.findById(videoId);
        if (!videoFile) {
            return res.status(404).json({ message: "Video not found" });
        }
        return res.status(200).json(videoFile);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};
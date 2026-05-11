import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

export const postcomment = async (req, res) => {
    const commentdata = req.body;
    const postcomment = new Comment(commentdata);
    try {
        await postcomment.save();
        return res.status(200).json({ comment: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" })

    }
}

export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }
    const comments = await Comment.find({ videoid })
      .populate("userid", "channelname profilepicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error while fetching comments",
    });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { commentid } = req.params;
    const comment = await Comment.findById(commentid);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    if (comment.userid.toString() !== req.userid) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    await Comment.findByIdAndDelete(commentid);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting comment",
    });
  }
};
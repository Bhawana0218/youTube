import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

const PLAIN_TEXT_REGEX = /^[\p{L}\p{N}\s]+$/u;

const isPlainCommentText = (value = "") => {
  const text = String(value).trim();
  return Boolean(text) && PLAIN_TEXT_REGEX.test(text);
};

const toCommentPayload = (commentDoc) => {
  const comment = commentDoc?.toObject ? commentDoc.toObject() : commentDoc;
  const likes = Array.isArray(comment?.likedBy) ? comment.likedBy.length : 0;
  const dislikes = Array.isArray(comment?.dislikedBy) ? comment.dislikedBy.length : 0;

  return {
    ...comment,
    likes,
    dislikes,
  };
};

export const postcomment = async (req, res) => {
  const commentdata = req.body || {};
  const rawBody = String(commentdata.commentbody ?? commentdata.commnetbody ?? "").trim();

  if (!isPlainCommentText(rawBody)) {
    return res.status(400).json({
      success: false,
      message: "Special characters are not allowed in comments.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(String(commentdata.userid || ""))) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(String(commentdata.videoid || ""))) {
    return res.status(400).json({
      success: false,
      message: "Invalid video ID",
    });
  }

  const nextComment = new Comment({
    ...commentdata,
    commentbody: rawBody,
    commnetbody: rawBody,
    city: String(commentdata.city || "Unknown City").trim() || "Unknown City",
    likedBy: [],
    dislikedBy: [],
    commentedon: commentdata.commentedon || new Date().toISOString(),
  });

  try {
    await nextComment.save();
    const created = await Comment.findById(nextComment._id).populate("userid", "channelname profilepicture image");

    return res.status(200).json({
      success: true,
      comment: toCommentPayload(created),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

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
      .populate("userid", "channelname profilepicture image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments: comments.map(toCommentPayload),
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
    const { userId } = req.body || {};

    const comment = await Comment.findById(commentid);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.userid.toString() !== String(userId || "")) {
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

export const updateComment = async (req, res) => {
  try {
    const { commentid } = req.params;
    const { commentbody, commnetbody, userId } = req.body || {};

    const nextBody = String(commentbody ?? commnetbody ?? "").trim();

    if (!isPlainCommentText(nextBody)) {
      return res.status(400).json({
        success: false,
        message: "Special characters are not allowed in comments.",
      });
    }

    const comment = await Comment.findById(commentid);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.userid.toString() !== String(userId || "")) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    comment.commentbody = nextBody;
    comment.commnetbody = nextBody;
    await comment.save();

    const updated = await Comment.findById(commentid).populate("userid", "channelname profilepicture image");

    return res.status(200).json({
      success: true,
      comment: toCommentPayload(updated),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating comment",
    });
  }
};

export const reactToComment = async (req, res) => {
  try {
    const { commentid } = req.params;
    const { userId, reaction } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(String(commentid || ""))) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(String(userId || ""))) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!["like", "dislike"].includes(String(reaction || ""))) {
      return res.status(400).json({
        success: false,
        message: "Invalid reaction type",
      });
    }

    const comment = await Comment.findById(commentid);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const ownerId = String(comment.userid || "");
    const viewerId = String(userId || "");

    if (reaction === "dislike" && ownerId === viewerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot dislike your own comment.",
      });
    }

    const likedSet = new Set((comment.likedBy || []).map((id) => String(id)));
    const dislikedSet = new Set((comment.dislikedBy || []).map((id) => String(id)));

    if (reaction === "like") {
      if (likedSet.has(viewerId)) {
        likedSet.delete(viewerId);
      } else {
        likedSet.add(viewerId);
        dislikedSet.delete(viewerId);
      }
    } else {
      if (dislikedSet.has(viewerId)) {
        dislikedSet.delete(viewerId);
      } else {
        dislikedSet.add(viewerId);
        likedSet.delete(viewerId);
      }
    }

    comment.likedBy = Array.from(likedSet);
    comment.dislikedBy = Array.from(dislikedSet);

    if (comment.dislikedBy.length >= 2) {
      await Comment.findByIdAndDelete(commentid);
      return res.status(200).json({
        success: true,
        deleted: true,
        message: "Comment removed after reaching 2 dislikes.",
      });
    }

    await comment.save();
    const updated = await Comment.findById(commentid).populate("userid", "channelname profilepicture image");

    return res.status(200).json({
      success: true,
      deleted: false,
      comment: toCommentPayload(updated),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while reacting to comment",
    });
  }
};

export const translateComment = async (req, res) => {
  try {
    const { commentid } = req.params;
    const targetLang = String(req.body?.targetLang || "en").trim().toLowerCase();

    if (!mongoose.Types.ObjectId.isValid(String(commentid || ""))) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    if (!/^[a-z]{2,5}(-[a-z]{2,5})?$/i.test(targetLang)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target language code",
      });
    }

    const comment = await Comment.findById(commentid);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const text = String(comment.commentbody || comment.commnetbody || "").trim();
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is empty",
      });
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Translation service is unavailable right now.",
      });
    }

    const data = await response.json();
    const translatedText = Array.isArray(data?.[0])
      ? data[0].map((item) => item?.[0] || "").join("")
      : "";

    if (!translatedText) {
      return res.status(502).json({
        success: false,
        message: "Unable to translate this comment right now.",
      });
    }

    return res.status(200).json({
      success: true,
      translatedText,
      targetLang,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while translating comment",
    });
  }
};

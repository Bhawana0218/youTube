import express from "express";
import {
  postcomment,
  getCommentsByVideo,
  deleteComment,
} from "../controllers/comment.js";
const router = express.Router();
router.post("/post", postcomment);
router.get("/video/:videoid", getCommentsByVideo);
router.delete("/delete/:commentid", deleteComment);

export default router;
import express from "express";
import {
  postcomment,
  getCommentsByVideo,
  deleteComment,
  updateComment,
  reactToComment,
  translateComment,
} from "../controllers/comment.js";
const router = express.Router();
router.post("/post", postcomment);
router.get("/video/:videoid", getCommentsByVideo);
router.delete("/delete/:commentid", deleteComment);
router.put("/update/:commentid", updateComment);
router.post("/react/:commentid", reactToComment);
router.post("/translate/:commentid", translateComment);

export default router;

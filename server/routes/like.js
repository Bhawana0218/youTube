import express from "express";
import { getallLikedVideo, handleLike } from "../controllers/like.js";


const routes = express.Router();

routes.get("/:userId",getallLikedVideo);
routes.post("/:videoId", handleLike);

export default routes;
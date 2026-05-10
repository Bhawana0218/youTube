import express from "express";
import {
    handleWatchLater,
    getallWatchLaterVideo,  checkWatchLater
} from "../controllers/watchlater.js";
const routes = express.Router();
routes.get("/check/:videoId", checkWatchLater);
routes.post("/:videoId", handleWatchLater);
routes.get("/user/:userId", getallWatchLaterVideo);

export default routes;
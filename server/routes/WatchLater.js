import express from "express";
import { handleWatchLater, getallWatchLaterVideo} from "../controllers/watchlater.js";

const routes = express.Router();

routes.post("/:userId", getallWatchLaterVideo);
routes.get("/:videoId", handleWatchLater);

export default routes;
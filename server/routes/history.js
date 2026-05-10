import express from "express";
import { getallHistoryVideo, handlehistory, handleviews } from "../controllers/history.js";


const routes = express.Router();

routes.get("/:userId",getallHistoryVideo);
routes.post("/views/:userId", handleviews);
routes.post("/:videoId", handlehistory);

export default routes;
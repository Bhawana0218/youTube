import express from "express";
import { getallHistoryVideo, handlehistory, handleviews, deleteHistory } from "../controllers/history.js";


const routes = express.Router();

routes.get("/:userId",getallHistoryVideo);
routes.post("/views/:userId", handleviews);
routes.post("/:videoId", handlehistory);
routes.delete("/:historyId", deleteHistory);

export default routes;
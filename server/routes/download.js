import express from "express";
import { getDownloadsByUser, requestDownload } from "../controllers/download.js";

const routes = express.Router();

routes.post("/request", requestDownload);
routes.get("/:userId", getDownloadsByUser);

export default routes;

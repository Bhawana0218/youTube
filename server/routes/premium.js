import express from "express";
import {
  createPremiumOrder,
  getPremiumStatus,
  verifyPremiumPayment,
} from "../controllers/premium.js";

const routes = express.Router();

routes.post("/create-order", createPremiumOrder);
routes.post("/verify", verifyPremiumPayment);
routes.get("/status/:userId", getPremiumStatus);

export default routes;

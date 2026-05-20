import express from "express";
import {
  login,
  updateprofile,
  sendOTP,
  verifyOTP,
} from "../controllers/auth.js";

const routes = express.Router();

routes.post("/login", login);
routes.post("/update/:id", updateprofile);
routes.post("/send-otp", sendOTP);
routes.post("/verify-otp", verifyOTP);

export default routes;
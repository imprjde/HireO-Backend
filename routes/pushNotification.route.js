import express from "express";
import isAuthenticated from "../auth/isAuthenticated.js";
import {
  postToken,
  sendPushNotification,
} from "../controllers/pushNotification.controller.js";

const router = express.Router();

router.route("/postToken").post(postToken);
router.route("/send-notification").post(sendPushNotification);

export default router;

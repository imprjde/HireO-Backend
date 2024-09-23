import express from "express";
import {
  postToken,
  sendPushNotification,
} from "../controllers/pushNotification.controller.js";

const router = express.Router();

router.route("/postToken").post(postToken);
router.route("/send-notification").post(sendPushNotification);

export default router;

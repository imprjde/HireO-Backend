import express from "express";
import {
  getNotification,
  getNotificationCount,
  postNotification,
  updateHasSeen,
} from "../controllers/notification.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";

const router = express.Router();

router.route("/post-notification").post(postNotification);
router.route("/get-notification").get(getNotification);
router
  .route("/get-notification-count")
  .get(isAuthenticated, getNotificationCount);
router.route("/update-notification").put(isAuthenticated, updateHasSeen);

export default router;

import express from "express";
import {
  login,
  logout,
  register,
  resetPassword,
  sendEmail,
  submitNewPassword,
  updateOnBoarded,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/get-link").post(sendEmail);
router.get("/resetpassword/:id/:token", resetPassword);
router.post("/resetpassword/:id/:token", submitNewPassword);
router.put("/:id/update-onboard", updateOnBoarded);

export default router;

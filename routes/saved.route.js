import express from "express";
import {
  getSavedJobs,
  removeSaved,
  saveJob,
} from "../controllers/saved.controller.js";

const router = express.Router();

router.route("/saveJob").post(saveJob);
router.route("/getSavedJobs").get(getSavedJobs);
router.route("/removeSaved").delete(removeSaved);

export default router;

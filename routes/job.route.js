import express from "express";
import isAuthenticated from "../auth/isAuthenticated.js";
import {
  deleteJob,
  filterJobs,
  getAllJobs,
  getJobById,
  getJobByLoggedAdminUser,
  postJob,
  searchJob,
  updateJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/postjob").post(isAuthenticated, postJob);
router.route("/getjob").get(getAllJobs);
router.route("/searchJob").get(searchJob);
router.route("/filterJobs").get(filterJobs);
router.route("/getadminjobs").get(isAuthenticated, getJobByLoggedAdminUser);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);
router.route("/updateJob/:id").put(isAuthenticated, updateJob);
router.route("/getjob/:id").get(getJobById);

export default router;

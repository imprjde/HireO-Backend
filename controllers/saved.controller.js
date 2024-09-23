import { Saved } from "../models/saved.model.js";

export const saveJob = async (req, res) => {
  const { jobId, created_by } = req.query;
  try {
    const savedItem = await Saved.create({ jobId, created_by });
    return res.status(201).json({
      message: "Job Saved successfully.",
      savedItem,
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(400).json({ message: "Failed To Save This Job." });
  }
};
export const getSavedJobs = async (req, res) => {
  const { created_by } = req.query;
  try {
    const savedJobs = await Saved.find({ created_by }).populate({
      path: "jobId",
      populate: {
        path: "company",
      },
    });
    return res.status(201).json({
      savedJobs,
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res
      .status(500)
      .json({ message: "Error Retrieving Your Saved Jobs" });
  }
};

export const removeSaved = async (req, res) => {
  const { Id } = req.query;
  try {
    await Saved.findByIdAndDelete(Id);
    return res.status(201).json({
      message: "Job Removed from Your Saved",
      Id,
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: "Failed To Remove This Job" });
  }
};

import { Job } from "../models/job.model.js";
import random from "random";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let randomApplicant = random.int(521, 976);
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      dummyApplicants: randomApplicant,
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to creating a new job." });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    // Get the total count of jobs matching the query
    const totalJobs = await Job.countDocuments(query);

    // Fetch the jobs with pagination
    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Check if there are more jobs to fetch
    const hasMore = page * limit < totalJobs;

    // If no jobs are returned, send an appropriate response
    if (!jobs.length) {
      return res.status(200).json({
        message: "No More Jobs To Display!",
        success: false,
        jobs: [],
        hasMore: false,
      });
    }

    return res.status(200).json({ jobs, success: true, hasMore });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: "Failed to get jobs" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({
        path: "applications",
      })
      .populate({ path: "company" });
    if (!job)
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get job" });
  }
};

export const getJobByLoggedAdminUser = async (req, res) => {
  const { page } = req.query;
  const limit = 7;
  let skip = (page - 1) * limit;
  try {
    const userId = req.id;

    const totalCount = await Job.countDocuments({ created_by: userId });
    const jobs = await Job.find({ created_by: userId })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "company",
        createdAt: -1,
      });
    const totalPages = Math.ceil(totalCount / limit);

    if (!jobs)
      return res
        .status(404)
        .json({ message: "Jobs are not found", success: false });

    return res.status(200).json({
      jobs,
      success: true,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: error?.message });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    await Job.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Job deleted successfully", success: true });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: "Failed to delete this job" });
  }
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    experienceLevel,
    position,
    companyId,
  } = req.body;

  try {
    let requirementsArray = [];
    if (typeof requirements === "string") {
      requirementsArray = requirements
        .split(",")
        .map((req) => req.trim())
        .filter((req) => req);
    } else if (Array.isArray(requirements)) {
      requirementsArray = requirements
        .map((req) => (typeof req === "string" ? req.trim() : ""))
        .filter((req) => req);
    }
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        description,
        requirements: requirementsArray,
        salary,
        location,
        jobType,
        experienceLevel,
        position,
        company: companyId,
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    return res.status(200).json({
      data: updatedJob,
      message: "Job updated successfully",
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: error?.message });
  }
};

export const searchJob = async (req, res) => {
  const { query, carouselQuery } = req.query;

  try {
    if (query) {
      const searchRegex = new RegExp(query, "i");

      let filteredData = await Job.find({
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { requirements: { $regex: searchRegex } },
        ],
      }).populate({
        path: "company",
      });

      return res.status(200).json({ filteredData, query, success: true });
    }
    if (carouselQuery) {
      let jobs = await Job.find({ title: new RegExp(carouselQuery, "i") })
        .populate({
          path: "company",
        })
        .sort({ createdAt: -1 });
      return res.status(200).json({ jobs, query, success: true });
    }
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: "Search Failed" });
  }
};

export const filterJobs = async (req, res) => {
  try {
    const { industry, location, salary, experience } = req.query;

    const filter = {};

    if (industry) {
      const industries = industry.split(",").map((ind) => ind.trim());
      filter.title = { $in: industries.map((ind) => new RegExp(ind, "i")) };
    }

    if (location) {
      const locations = location.split(",").map((loc) => loc.trim());
      filter.location = { $in: locations.map((loc) => new RegExp(loc, "i")) };
    }

    if (salary) {
      filter.salary = { $gte: Number(salary) };
    }

    if (experience) {
      const experienceRanges = experience
        .split(",")
        .map((range) => range.trim());

      filter.$or = experienceRanges.map((range) => {
        const [minExp, maxExp] = range
          .split("-")
          .map((exp) => Number(exp.trim()));

        return {
          experienceLevel: {
            $gte: minExp,
            $lte: maxExp,
          },
        };
      });
    }

    let jobs;

    if (Object.keys(filter).length === 0) {
      jobs = await Job.aggregate([{ $sample: { size: 9 } }]);

      jobs = await Job.populate(jobs, { path: "company" });
    } else {
      jobs = await Job.find(filter).populate("company");
    }

    return res.status(200).json({
      message: "Jobs fetched successfully.",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch jobs.",
      success: false,
    });
  }
};

import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import nodemailer from "nodemailer";
import axios from "axios";
import { Fcm } from "../models/fcm.model.js";
import { User } from "../models/user.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const { id: jobId } = req.params;
    const { fullname, companyId, created_by } = req.body;

    if (!jobId)
      return res
        .status(400)
        .json({ message: "Job Id required", success: false });

    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    await Job.findByIdAndUpdate(jobId, { $inc: { dummyApplicants: 1 } });

    // Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    await axios.post(
      `http://localhost:8000/api/v1/notification/post-notification`,
      {
        userId: req?.body?.created_By,
        jobId,
        fullname,
        companyId,
        type: "applicant",
      }
    );

    return res.status(201).json({
      message: "Job Applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Failed to apply for the job.",
      success: false,
    });
  }
};
export const getAppliedJobs = async (req, res) => {
  const { page } = req.query;
  const limit = 5;
  let skip = (page - 1) * limit;
  try {
    const userId = req.id;

    const totalApplications = await Application.countDocuments({
      applicant: userId,
    });
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application)
      return res
        .status(404)
        .json({ message: "No Application Found", success: false });

    const hasMore = totalApplications > skip + application.length;

    return res.status(200).json({
      application,
      success: true,
      hasMore,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get applied jobs" });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Failed to get job applicants",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const {
      userId,
      status,
      applicantEmail,
      applicantName,
      belongsToUserId,
      jobId,
      type,
      companyId,
    } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    const jobInfo = await Job.findById(application.job).populate("company");
    const companyInfo = jobInfo?.company;

    application.status = status.toLowerCase();
    await application.save();

    const emailContent =
      status.toLowerCase() === "accepted"
        ? `
        <p>Dear <strong>${applicantName}</strong>,</p>
        <p>Thank you for applying for the <strong>${jobInfo?.title}</strong> at <strong>${companyInfo?.name}</strong>. We’re thrilled to inform you that we would like to move forward with your application!.</p>
        <p>Your skills and experience impressed us, and we believe you’d be a great fit for our team. Our next step will be to provide details about the next steps, such as scheduling an interview, providing additional information, etc.</p>
        <p>Please look out for further instructions from us soon. We’re excited about the possibility of you joining <strong>${companyInfo?.name}</strong>!</p>
        <p>Best regards,<br>Team <strong>HireO</strong></p>
      `
        : `
        <p>Dear <strong>${applicantName}</strong>,</p>
        <p>Thank you for applying for the <strong>${jobInfo?.title}</strong> at <strong>${companyInfo?.name}</strong>. We appreciate your interest and the effort you put into your application.</p>
        <p>After careful review, we’ve decided to move forward with other candidates. This decision was difficult given the high quality of applications we received.</p>
        <p>We encourage you to apply for future openings that match your skills. Best of luck in your job search!</p>
        <p>Best regards,<br>Team <strong>HireO</strong></p>
      `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: applicantEmail,
      subject: "Job Application Status Update",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    // Sending In-App Notification to Applicant
    await axios.post(
      `${process.env.API_BASE_URL}/notification/post-notification`,
      { userId: belongsToUserId, jobId, type, companyId },
      { withCredentials: true }
    );

    // Sending Push Notification to Applicant
    const notificationMessage =
      status.toLowerCase() === "accepted"
        ? `Congratulations! Your application for ${jobInfo?.title} at ${companyInfo?.name} has been accepted`
        : `We're sorry to inform you that your application for ${jobInfo?.title} at ${companyInfo?.name} has been rejected`;

    const fcmData = await User.findById(belongsToUserId);

    if (fcmData) {
      const notifyConfig = {
        token: fcmData?.fcmToken,
        title: `Application ${status}`,
        body: notificationMessage,
      };

      try {
        await axios.post(
          `${process.env.API_BASE_URL}/pushNotification/send-notification`,
          notifyConfig
        );
      } catch (error) {
        console.log("ERROR:", error);
      }
    }

    return res.status(200).json({
      message:
        "The status was updated successfully. The applicant has been notified via email and received a notification.",
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Failed to update status",
      success: false,
    });
  }
};

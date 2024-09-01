// import mongoose from "mongoose";

// const notificationSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     jobId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Job",
//     },
//     companyId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//     },
//     type: {
//       type: String,
//       required: true,
//     },
//     fullname: {
//       type: String,
//     },
//     hasSeen: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// export const Notification = mongoose.model("Notification", notificationSchema);

/////////////////////////////////////////////////////////////////////////////////////////////
// import mongoose from "mongoose";

// const notificationSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     jobId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Job",
//     },
//     companyId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//     },
//     type: {
//       type: String,
//       required: true,
//     },
//     fullname: {
//       type: String,
//     },
//     hasSeen: {
//       type: Boolean,
//       default: false,
//     },
//     expireAt: {
//       type: Date,
//       default: () => Date.now() + 3 * 60 * 1000, // 3 minutes from now
//       index: { expires: 180 } // TTL index set to 180 seconds (3 minutes)
//     }
//   },
//   { timestamps: true }
// );

// export const Notification = mongoose.model("Notification", notificationSchema);

/////////////////////////////////////////////////////////////////////////////////////////////////

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    type: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
    },
    hasSeen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a TTL index on the createdAt field to expire documents after 24 hours
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 }); // 86400 seconds = 24 hours

export const Notification = mongoose.model("Notification", notificationSchema);

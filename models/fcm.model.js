import mongoose from "mongoose";

const fcmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestampss: true }
);
export const Fcm = mongoose.model("Fcm", fcmSchema);

import { User } from "../models/user.model.js";
import admin from "../utils/firebase.js";

export const postToken = async (req, res) => {
  const { userId, token } = req.body;

  try {
    if (!userId || !token) {
      return res.status(400).json({ message: "Missing userId or token" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fcmToken = token;
    user.isFcmPosted = true;

    const updatedUser = await user.save();
    return res.status(200).json({
      data: {
        updatedUser,
      },
      message: "FCM Token Updated Successfully and isFcmPosted Updated",
    });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const sendPushNotification = async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    return res.status(200).json({
      message: "Push Notification sent successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(400).json({
      message: "Failed to send Push Notification",
      data: error,
      success: false,
    });
  }
};

import { Fcm } from "../models/fcm.model.js";
import admin from "../utils/firebase.js";

export const postToken = async (req, res) => {
  console.log("POST FCM TOKEN API Running");
  const { userId, token } = req.body;

  try {
    if (!userId || !token) {
      return res.status(400).json({
        error: {
          message: "userId or Token is Missing",
        },
      });
    }

    let fcmToken = await Fcm.findOne({ userId });

    if (!fcmToken) {
      fcmToken = new Fcm({
        userId,
        token,
      });
      await fcmToken.save();
    } else {
      fcmToken.token = token;
      await fcmToken.save();
    }

    return res.status(200).json({
      data: {
        userId,
        token,
      },
      message: "FCM Token Updated Successfully",
    });
  } catch (error) {
    console.error("Error in postToken API:", error);
    return res.status(500).json({
      error: {
        message: "Server Error",
        details: error.message,
      },
    });
  }
};

export const sendPushNotification = async (req, res) => {
  console.log("sendNotification API RUNNING");
  const { token, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    return res.status(200).json({
      message: "Push Notification sent successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to send Push Notification",
      data: error,
      success: false,
    });
  }
};

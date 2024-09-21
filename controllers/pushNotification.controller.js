import axios from "axios";
import { Fcm } from "../models/fcm.model.js";
import { User } from "../models/user.model.js";
import admin from "../utils/firebase.js";

// export const postToken = async (req, res) => {
//   console.log("POST FCM TOKEN API Running");
//   const { userId, token } = req.body;

//   console.log("userId:", userId);
//   console.log("token:", token);

//   try {
//     if (!userId || !token) {
//       console.log("Something went wrong in FCM TOKEN");
//       return res.status(400).json({
//         error: {
//           message: "userId or Token is Missing",
//         },
//       });
//     }

//     let fcmToken = await Fcm.findOne({ userId });
//     let user = await User.findOne({ _id: userId });

//     // console.log("Mande BEchha:", user);

//     if (!fcmToken) {
//       fcmToken = new Fcm({
//         userId,
//         token,
//       });
//       await fcmToken.save();
//     } else {
//       fcmToken.token = token;
//       await fcmToken.save();
//     }

//     user.isFcmPosted = true;
//     await user.save();

//     const updatedUser = await User.findOne({ _id: userId });

//     console.log("DONEEE");

//     return res.status(200).json({
// data: {
//   updatedUser,
//   userId,
//   token,
// },
//       message: "FCM Token Updated Successfully and isFcmPosted Updated",
//     });
//   } catch (error) {
//     console.error("Error in postToken API:", error);
//     return res.status(500).json({
//       error: {
//         message: "Server Error",
//         details: error.message,
//       },
//     });
//   }
// };

export const postToken = async (req, res) => {
  console.log("POST FCM TOKEN API Running");

  const { userId, token } = req.body;

  try {
    // Check if both userId and token are provided
    if (!userId || !token) {
      return res.status(400).json({ message: "Missing userId or token" });
    }

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's FCM token and mark as posted
    user.fcmToken = token;
    user.isFcmPosted = true;

    // Save the updated user
    const updatedUser = await user.save();
    // Send success response
    return res.status(200).json({
      data: {
        updatedUser,
      },
      message: "FCM Token Updated Successfully and isFcmPosted Updated",
    });
  } catch (error) {
    console.error("Error posting FCM token:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// export const sendPushNotification = async (req, res) => {
//   console.log("send-PUSH-Notification API RUNNING");
//   const { token, title, body } = req.body;
//   console.log("REQWBODY:", req.body);

//   const message = {
//     notification: {
//       title: title,
//       body: body,
//       token: token,
//     },
//   };

//   console.log("message:::", message);

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("PUSH-NOTIFICATION SENT--------------");
//     return res.status(200).json({
//       message: "Push Notification sent successfully",
//       data: response,
//       success: true,
//     });
//   } catch (error) {
//     console.log("PUSHI ERROR:", error);
//     return res.status(400).json({
//       message: "Failed to send Push Notification",
//       data: error,
//       success: false,
//     });
//   }
// };

////////////////////////////////////////////////////////

// export const sendPushNotification = async (req, res) => {
//   console.log("send-PUSH-Notification API RUNNING");
//   const { token, title, body } = req.body;
//   console.log("REQBODY:", req.body);

//   const message = {
//     token: token,
//     notification: {
//       title: title,
//       body: body,
//     },
//   };

//   console.log("message:::", message);
//   console.log("process.env.SERVER_KEY", process.env.SERVER_KEY);

//   try {
//     // const response = await admin.messaging().send(message);
//     let resp = await axios.post(
//       `https://fcm.googleapis.com/fcm/send`,
//       {
//         to: "ca6AEf6_M jQZcGolQXUPfx:APA91bEc0CnxzYTNy8clepVhZYy-0TDEaqLULdO5_62FDjU4L5WShaqNF-6sdjlnLd2LODBMahXnG_wc7_V8VT2frIvfLyrhI2Yj7vxoiEKNYZApipW1k_yaaz6Y6gjbm1ZFFo7L0Epr",
//         content_available: true,
//         mutable_content: true,
//         priority: "high",
//         notification: {
//           title: "Nangu Pangu",
//           body: "Test Body",
//         },
//       },
//       {
//         headers: {
//           Authorization: `key=${process.env.SERVER_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("PUSH-NOTIFICATION SENT--------------", resp);
//     return res.status(200).json({
//       message: "Push Notification sent successfully",
//       data: response,
//       success: true,
//     });
//   } catch (error) {
//     console.log("PUSH ERROR:", error);
//     return res.status(400).json({
//       message: "Failed to send Push Notification",
//       data: error,
//       success: false,
//     });
//   }
// };

export const sendPushNotification = async (req, res) => {
  console.log("send-PUSH-Notification API RUNNING");
  const { token, title, body } = req.body;

  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  console.log("message:", message);

  try {
    const response = await admin.messaging().send(message);
    console.log("---PUSH-NOTIFICATION SENT---");
    return res.status(200).json({
      message: "Push Notification sent successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    console.log("PUSHI ERROR:", error);
    return res.status(400).json({
      message: "Failed to send Push Notification",
      data: error,
      success: false,
    });
  }
};

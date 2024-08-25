// import admin from "../utils/firebase.js";

// export const sendNotification = async (req, res) => {
//   console.log("sendNotification API RUNNING");
//   const { token, title, body } = req.body;

//   const message = {
//     notification: {
//       title: title,
//       body: body,
//     },
//     token: token,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     return res.status(200).json({
//       message: "Push Notification sent successfully",
//       data: response,
//       success: true,
//     });
//   } catch (error) {
//     return res.status(200).json({
//       message: "Failed to send Push Notification",
//       data: error,
//       success: false,
//     });
//   }
// };

import { Notification } from "../models/notification.model.js";

export const postNotification = async (req, res) => {
  const { userId, jobId, companyId, type, fullname } = req.body;

  if (!userId || !userId) {
    return res.status(400).json({
      message: "userId or userId is missing.",
      success: false,
    });
  }

  try {
    const notification = new Notification({
      userId,
      jobId,
      companyId,
      fullname,
      type: type.toLowerCase(),
    });

    await notification.save();

    return res.status(201).json({
      message: "Notification sent to user!",
      success: true,
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to notify user.",
      success: false,
    });
  }
};

export const getNotification = async (req, res) => {
  console.log("GET NOTIFICATON API RUNNING");
  const { userId } = req.query;

  try {
    let notifications = await Notification.find({ userId })
      .populate({
        path: "companyId",
      })
      .populate({
        path: "jobId",
      })
      .sort({ createdAt: -1 });

    if (notifications?.length === 0) {
      return res.status(200).json({
        message: "No new notifications to display",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({
      message: "Failed to fetch your notifications.",
      success: false,
    });
  }
};

export const getNotificationCount = async (req, res) => {
  console.log("getNotificationCount API RUNNING");
  const { userId } = req.query;

  try {
    let totalNotifications = await Notification.find({ userId });

    const unseenNotifications = totalNotifications.filter(
      (notification) => notification.hasSeen === false
    )?.length;

    return res.status(200).json({
      success: true,
      data: unseenNotifications,
    });
  } catch (error) {
    console.log("error=", error);
    return res.status(500).json({
      message: "Failed to fetch your notifications.",
      success: false,
    });
  }
};

export const updateHasSeen = async (req, res) => {
  console.log("UPDATE HAS SEEN RUNNING");
  const { userId } = req.body;
  console.log("userId====", userId);

  try {
    await Notification.updateMany(
      { userId, hasSeen: false },
      { hasSeen: true }
    );
    res.status(200).json({
      message: "Notification Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to Update Notification",
    });
  }
};

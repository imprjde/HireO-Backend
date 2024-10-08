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
  const { userId } = req.query;

  try {
    let notifications = await Notification.find({ userId })
      .populate({
        path: "companyId",
      })
      .populate({
        path: "jobId",
      })
      .sort({ createdAt: -1 })
      .limit(10);

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
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch your notifications.",
      success: false,
    });
  }
};

export const getNotificationCount = async (req, res) => {
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
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch your notifications.",
      success: false,
    });
  }
};

export const updateHasSeen = async (req, res) => {
  const { userId } = req.body;

  try {
    await Notification.updateMany(
      { userId, hasSeen: false },
      { hasSeen: true }
    );
    res.status(200).json({
      message: "Notification Updated Successfully",
    });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Failed to Update Notification",
    });
  }
};

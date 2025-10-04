const notificationModel = require("../Models/notification.model");

const createNotification = async (req, res) => {
  try {
    const { recipient_type, recipient_id, message, type } = req.body;
    const { userid } = req.user;

    const notificationData = {
      recipient_type,
      recipient_id,
      message,
      type,
      sender_id: userid,
    };

    const result = await notificationModel.createNotification(notificationData);

    res.status(201).json({
      success: true,
      message: "Tạo thông báo thành công",
      data: { notification_id: result.insertId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    // Kiểm tra quyền truy cập
    if (req.user.userid !== parseInt(user_id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    const notifications = await notificationModel.getNotificationsByUserId(
      user_id,
      parseInt(limit),
      offset
    );

    const unreadCount = await notificationModel.getUnreadNotificationCount(
      user_id
    );

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unread_count: unreadCount,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const { userid } = req.user;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const notifications = await notificationModel.getNotificationsByUserId(
      userid,
      parseInt(limit),
      offset
    );

    const unreadCount = await notificationModel.getUnreadNotificationCount(
      userid
    );

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unread_count: unreadCount,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const { userid } = req.user;

    const result = await notificationModel.markNotificationAsRead(
      notification_id,
      userid
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đánh dấu thông báo đã đọc thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { userid } = req.user;

    await notificationModel.markAllNotificationsAsRead(userid);

    res.status(200).json({
      success: true,
      message: "Đánh dấu tất cả thông báo đã đọc thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const { userid } = req.user;

    const result = await notificationModel.deleteNotification(
      notification_id,
      userid
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa thông báo thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const sendBroadcast = async (req, res) => {
  try {
    const { recipient_type, message, type } = req.body;
    const { userid } = req.user;

    // Chỉ admin mới được gửi broadcast
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền gửi thông báo broadcast",
      });
    }

    await notificationModel.sendBroadcastNotification(
      recipient_type,
      message,
      type,
      userid
    );

    res.status(200).json({
      success: true,
      message: "Gửi thông báo broadcast thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const { userid } = req.user;

    const unreadCount = await notificationModel.getUnreadNotificationCount(
      userid
    );

    res.status(200).json({
      success: true,
      data: { unread_count: unreadCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendBroadcast,
  getUnreadCount,
};

class NotificationService {
  // Gửi thông báo khi xe bắt đầu tuyến
  static async notifyRouteStart(route_name, driver_name, estimated_time) {
    const message = `Xe buýt tuyến ${route_name} đã khởi hành. Tài xế: ${driver_name}. Dự kiến đến điểm đón: ${estimated_time}`;

    await notificationModel.sendBroadcastNotification(
      "parent",
      message,
      "route_start",
      null
    );
  }

  // Gửi thông báo khi học sinh được đón
  static async notifyStudentPickup(student_id, pickup_location, time) {
    const message = `Con bạn đã được đón tại ${pickup_location} lúc ${time}`;

    await notificationModel.createNotification({
      recipient_type: "parent",
      recipient_id: student_id,
      message: message,
      type: "pickup",
      sender_id: null,
    });
  }

  // Gửi thông báo khi học sinh được trả
  static async notifyStudentDropoff(student_id, dropoff_location, time) {
    const message = `Con bạn đã được trả tại ${dropoff_location} lúc ${time}`;

    await notificationModel.createNotification({
      recipient_type: "parent",
      recipient_id: student_id,
      message: message,
      type: "dropoff",
      sender_id: null,
    });
  }

  // Gửi thông báo khi có sự cố
  static async notifyEmergency(route_name, message, driver_id) {
    const emergencyMessage = `KHẨN CẤP - Tuyến ${route_name}: ${message}`;

    await notificationModel.sendBroadcastNotification(
      "parent",
      emergencyMessage,
      "emergency",
      driver_id
    );
  }

  // Gửi thông báo về lịch trình thay đổi
  static async notifyScheduleChange(student_id, old_time, new_time, reason) {
    const message = `Lịch trình xe buýt đã thay đổi. Từ ${old_time} thành ${new_time}. Lý do: ${reason}`;

    await notificationModel.createNotification({
      recipient_type: "parent",
      recipient_id: student_id,
      message: message,
      type: "schedule_change",
      sender_id: null,
    });
  }
}

module.exports = NotificationService;

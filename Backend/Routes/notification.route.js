const express = require("express");
const router = express.Router();
const {
    getMyNotifications, 
    getUserNotifications, 
    createNotification, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    getUnreadCount, 
    sendBroadcast
} = require("../Services/notification.service");

// Routes cho người dùng (cần xác thực)
router.get(
  "/my",
  getMyNotifications
);
router.get(
  "/unread-count",
  getUnreadCount
);
router.put(
  "/:notification_id/read",
    markAsRead
);
router.put(
  "/read-all",
  markAllAsRead
);
router.delete(
  "/:notification_id",
  deleteNotification
);

// Routes cho admin
router.post(
  "/create",
  createNotification
);
router.post(
  "/broadcast",
  sendBroadcast
);
router.get(
  "/user/:user_id",
 getUserNotifications
);

module.exports = router;

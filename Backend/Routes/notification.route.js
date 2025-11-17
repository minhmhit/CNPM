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

const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");
// Routes cho người dùng (cần xác thực)
// Routes cho admin
router.use(authMiddleware);
router.delete("/delete/:userid/:notification_id",deleteNotification);
router.post("/sendAll",isAdmin, sendBroadcast);
router.get("/my/:userid",getMyNotifications);
router.put("/readAll/:userid",markAllAsRead);
router.get("/user/:user_id",getUserNotifications);
router.post("/create",createNotification);
router.post("/read",markAsRead);
module.exports = router;

const { pool } = require("../config/connection_mysql");

const createNotification = async (notificationData) => {
  try {
    const { recipient_type, recipient_id, message, type, sender_id } =
      notificationData;
    const [result] = await pool.query(
      "INSERT INTO notifications (recipient_type, recipient_id, message, type, sender_id, timestamp, is_read) VALUES (?, ?, ?, ?, ?, NOW(), 0)",
      [recipient_type, recipient_id, message, type, sender_id]
    );
    return result;
  } catch (error) {
    console.error("Lỗi khi tạo thông báo:", error);
    throw error;
  }
};

const getNotificationsByUserId = async (user_id, limit = 20, offset = 0) => {
  try {
    const [rows] = await pool.query(
      `
            SELECT 
                n.notification_id, 
                n.message, 
                n.type, 
                n.timestamp, 
                n.is_read,
                sender.username as sender_name
            FROM notifications n
            LEFT JOIN users sender ON n.sender_id = sender.userid
            WHERE n.recipient_id = ?
            ORDER BY n.timestamp DESC
            LIMIT ? OFFSET ?
        `,
      [user_id, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    throw error;
  }
};

const markNotificationAsRead = async (notification_id, user_id) => {
  try {
    const [result] = await pool.query(
      "UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND recipient_id = ?",
      [notification_id, user_id]
    );
    return result;
  } catch (error) {
    console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    throw error;
  }
};

const markAllNotificationsAsRead = async (user_id) => {
  try {
    const [result] = await pool.query(
      "UPDATE notifications SET is_read = 1 WHERE recipient_id = ? AND is_read = 0",
      [user_id]
    );
    return result;
  } catch (error) {
    console.error("Lỗi khi đánh dấu tất cả thông báo đã đọc:", error);
    throw error;
  }
};

const getUnreadNotificationCount = async (user_id) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as unread_count FROM notifications WHERE recipient_id = ? AND is_read = 0",
      [user_id]
    );
    return rows[0].unread_count;
  } catch (error) {
    console.error("Lỗi khi đếm thông báo chưa đọc:", error);
    throw error;
  }
};

const deleteNotification = async (notification_id, user_id) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM notifications WHERE notification_id = ? AND recipient_id = ?",
      [notification_id, user_id]
    );
    return result;
  } catch (error) {
    console.error("Lỗi khi xóa thông báo:", error);
    throw error;
  }
};

const sendBroadcastNotification = async (
  recipient_type,
  message,
  type,
  sender_id
) => {
  try {
    let query;
    if (recipient_type === "student") {
      query = `
                INSERT INTO notifications (recipient_type, recipient_id, message, type, sender_id, timestamp, is_read)
                SELECT 'student', s.student_id, ?, ?, ?, NOW(), 0
                FROM students s
                JOIN users u ON s.userid = u.userid
                WHERE u.isActive = 1
            `;
    } else if (recipient_type === "driver") {
      query = `
                INSERT INTO notifications (recipient_type, recipient_id, message, type, sender_id, timestamp, is_read)
                SELECT 'driver', d.driver_id, ?, ?, ?, NOW(), 0
                FROM drivers d
                JOIN users u ON d.userid = u.userid
                WHERE u.isActive = 1
            `;
    } else if (recipient_type === "parent") {
      query = `
                INSERT INTO notifications (recipient_type, recipient_id, message, type, sender_id, timestamp, is_read)
                SELECT 'parent', s.student_id, ?, ?, ?, NOW(), 0
                FROM students s
                JOIN users u ON s.userid = u.userid
                WHERE u.isActive = 1
            `;
    }

    const [result] = await pool.query(query, [message, type, sender_id]);
    return result;
  } catch (error) {
    console.error("Lỗi khi gửi thông báo broadcast:", error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  deleteNotification,
  sendBroadcastNotification,
};

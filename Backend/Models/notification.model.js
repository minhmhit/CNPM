const { pool } = require("../config/connection_mysql");

const createNotification = async (notificationData) => {
  try {
    const {
      recipient_type,
      recipient_user_id,
      message,
      sender_id,
      schedule_id,
    } = notificationData;
    const [result] = await pool.query(
      `INSERT INTO notifications (
        recipient_type,
        recipient_user_id, 
        message, 
        sender_id,
        schedule_id,
        is_read,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, 0, NOW())`,
      [recipient_type, recipient_user_id, message, sender_id, schedule_id]
    );
    const data = { notification_id: result.insertId, ...notificationData };
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo thông báo:", error);
    throw error;
  }
};

const getNotificationsByUserId = async (user_id, limit = 20, offset = 0) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        n.notification_id,
        n.recipient_type,
        n.recipient_user_id,
        n.message,
        n.is_read,
        n.timestamp,
        n.schedule_id,
        sender.username as sender_name,
        sender.role as sender_role,
        s.date as schedule_date,
        s.start_time as schedule_time,
        s.status as schedule_status,
        CASE 
          WHEN n.recipient_type = 'student' THEN st.name
          WHEN n.recipient_type = 'driver' THEN d.name 
        END as recipient_name
      FROM notifications n
      LEFT JOIN users sender ON n.sender_id = sender.userid
      LEFT JOIN schedules s ON n.schedule_id = s.schedule_id
      LEFT JOIN students st ON (n.recipient_type = 'student' AND st.userid = n.recipient_user_id)
      LEFT JOIN drivers d ON (n.recipient_type = 'driver' AND d.userid = n.recipient_user_id)
      WHERE n.recipient_user_id = ?
      ORDER BY n.timestamp DESC
      LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    throw error;
  }
};

const sendBroadcastNotification = async (
  recipient_type,
  message,
  sender_id,
  schedule_id
) => {
  try {
    let query;
    if (recipient_type === "student") {
      query = `
        INSERT INTO notifications (
          recipient_type, 
          recipient_user_id, 
          message, 
          sender_id, 
          schedule_id,
          is_read, 
          timestamp
        )
        SELECT 
          'student',
          s.userid,
          ?,
          ?,
          ?,
          0,
          NOW()
        FROM schedule_students ss
        JOIN students s ON ss.student_id = s.student_id
        JOIN users u ON s.userid = u.userid
        WHERE ss.schedule_id = ? 
        AND u.isActive = 1 
        AND u.role = 'student'
      `;
    }

    const [result] = await pool.query(query, [
      message,
      sender_id,
      schedule_id,
      schedule_id,
    ]);
    return result;
  } catch (error) {
    console.error("Lỗi khi gửi thông báo broadcast:", error);
    throw error;
  }
};

const markNotificationAsRead = async (notification_id, user_id) => {
  try {
    const [result] = await pool.query(
      `UPDATE notifications 
       SET is_read = 1 
       WHERE notification_id = ? AND recipient_user_id = ?`,
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
      `UPDATE notifications 
       SET is_read = 1 
       WHERE recipient_user_id = ?`,
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
      `SELECT COUNT(*) as unread_count 
       FROM notifications
       WHERE recipient_user_id = ? AND is_read = 0`,
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
      `DELETE FROM notifications 
       WHERE notification_id = ? AND recipient_user_id = ?`,
      [notification_id, user_id]
    );
    return result;
  } catch (error) {
    console.error("Lỗi khi xóa thông báo:", error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  sendBroadcastNotification,
  deleteNotification,
};

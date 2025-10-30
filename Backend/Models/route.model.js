const { pool } = require("../config/connection_mysql");

// Thêm chuyến đường kèm điểm dừng
const addRoute = async (routeData) => {
  try {
    const { route_name, description, stop_points } = routeData;
    const sql = "INSERT INTO routes (name, description) VALUES (?, ?)";
    const [result] = await pool.query(sql, [route_name, description]);
    const route_id = result.insertId;
    // Thêm các điểm dừng nếu có
     if (Array.isArray(stop_points) && stop_points.length > 0) {
      for (let i = 0; i < stop_points.length; i++) {
        const stop = stop_points[i];
        // Check if stop is an object with coordinates
        if (stop && typeof stop === "object") {
          const sql = `
            INSERT INTO stop_points 
            (route_id, stop_name, latitude, longitude, stop_order) 
            VALUES (?, ?, ?, ?, ?)
          `;
          const params = [
            route_id,
            stop.stop_name ||  "",
            stop.latitude ||  null,
            stop.longitude ||  null,
            stop.stop_order ||  i + 1
          ];
          await pool.query(sql, params);
        };
      }
    }
    //return the new route data
    return { route_id: route_id, route_name, description, stop_points };
  } catch (error) {
    console.error("Error adding route:", error);
    throw error;
  }
};

// Sửa chuyến đường và điểm dừng
const updateRoute = async (route_id, routeData) => {
  try {
    const fields = [];
    const values = [];
    if (routeData.name) {
      fields.push("name = ?");
      values.push(routeData.name);
    }
    if (routeData.description) {
      fields.push("description = ?");
      values.push(routeData.description);
    }
    if (fields.length > 0) {
      values.push(route_id);
      const sql = `UPDATE routes SET ${fields.join(", ")} WHERE route_id = ?`;
      await pool.query(sql, values);
    }
	
    // Cập nhật điểm dừng nếu có
    if (Array.isArray(routeData.stop_points)) {
      // Xoá điểm dừng cũ
      const deleteStopPointSql = "DELETE FROM stop_points WHERE route_id = ?";
      await pool.query(deleteStopPointSql, [route_id]);
      // Thêm lại điểm dừng mới
      for (let i = 0; i < routeData.stop_points.length; i++) {
        const stopSql =
          "INSERT INTO stop_points (route_id, stop_name, stop_order) VALUES (?, ?, ?)";
        await pool.query(stopSql, [route_id, routeData.stop_points[i], i + 1]);
      }
    }
	//return the updated route data
    return { id: route_id, route_name: routeData.route_name, description: routeData.description, stop_points: routeData.stop_points };
  } catch (error) {
    console.error("Error updating route:", error);
    throw error;
  }
};

// Xoá chuyến đường và điểm dừng
const deleteRoute = async (route_id) => {
  try {
    // Xoá điểm dừng trước
    const deleteStopPointSql = "DELETE FROM stop_points WHERE route_id = ?";
    await pool.query(deleteStopPointSql, [route_id]);
    // Xoá chuyến đường
    const deleteRouteSql = "DELETE FROM routes WHERE route_id = ?";
    const [result] = await pool.query(deleteRouteSql, [route_id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting route:", error);
    throw error;
  }
};

// Xem danh sách chuyến đường kèm điểm dừng
const getAllRoutes = async () => {
  try {
    const sql = "SELECT * FROM routes";
    const [routes] = await pool.query(sql);
    for (let route of routes) {
      const stopSql =
        "SELECT stop_name, stop_order FROM stop_points WHERE route_id = ? ORDER BY stop_order";
      const [stops] = await pool.query(stopSql, [route.route_id]);
      route.stop_points = stops;
    }
    return routes;
  } catch (error) {
    console.error("Error getting routes:", error);
    throw error;
  }
};

// Thêm điểm dừng vào chuyến đường
const addStopPoints = async (route_id, stop_points) => {
  try {
    if (Array.isArray(stop_points) && stop_points.length > 0) {
      for (let i = 0; i < stop_points.length; i++) {
        const stop = stop_points[i];
        // Nếu phần tử là object chứa lat/lng, chèn 5 cột, ngược lại chèn 3 cột
        if (stop && typeof stop === "object") {
          const stopName = stop.stop_name || stop.name || "";
          const lat = stop.latitude ?? stop.lat ?? null;
          const lng = stop.longitude ?? stop.lng ?? null;
          const order = stop.stop_order ?? stop.order ?? i + 1;
          const stopSql =
            "INSERT INTO stop_points (route_id, stop_name, latitude, longitude, stop_order) VALUES (?, ?, ?, ?, ?)";
          await pool.query(stopSql, [route_id, stopName, lat, lng, order]);
        } else {
          // stop là chuỗi tên điểm dừng
          const stopSql =
            "INSERT INTO stop_points (route_id, stop_name, stop_order) VALUES (?, ?, ?)";
          await pool.query(stopSql, [route_id, stop, i + 1]);
        }
      }
    }
    return { route_id, stop_points };
  } catch (error) {
    console.error("Error adding stop points:", error);
    throw error;
  }
};

//lấy các điểm dừng theo schedule_id
const getStopPointsByScheduleId = async (schedule_id) => {
  try {
    const sql = `
      SELECT sp.stop_id, sp.stop_name, sp.stop_order, r.name AS route_name
      FROM stop_points sp
      JOIN schedules s ON sp.route_id = s.route_id
      JOIN routes r ON sp.route_id = r.route_id
      WHERE s.schedule_id = ?
      ORDER BY sp.stop_order
    `;
    const [stop_points] = await pool.query(sql, [schedule_id]);
    return stop_points;
  } catch (error) {
    console.error("Error getting stop points by schedule ID:", error);
    throw error;
  }
};

module.exports = {
  addRoute,
  updateRoute,
  deleteRoute,
  getStopPointsByScheduleId,
  addStopPoints,
  getAllRoutes,
};

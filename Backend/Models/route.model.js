
// Thêm chuyến đường kèm điểm dừng
const addRoute = async (routeData) => {
	try {
		const { name, description, stop_points } = routeData;
		const sql = 'INSERT INTO routes (name, description) VALUES (?, ?)';
		const [result] = await pool.query(sql, [name, description]);
		const route_id = result.insertId;
		// Thêm các điểm dừng nếu có
		if (Array.isArray(stop_points) && stop_points.length > 0) {
			for (let i = 0; i < stop_points.length; i++) {
				const stopSql = 'INSERT INTO stop_points (route_id, stop_name, stop_order) VALUES (?, ?, ?)';
				await pool.query(stopSql, [route_id, stop_points[i], i + 1]);
			}
		}
		return route_id;
	} catch (error) {
		console.error('Error adding route:', error);
		throw error;
	}
};

// Sửa chuyến đường và điểm dừng
const updateRoute = async (route_id, routeData) => {
	try {
		const fields = [];
		const values = [];
		if (routeData.name) {
			fields.push('name = ?');
			values.push(routeData.name);
		}
		if (routeData.description) {
			fields.push('description = ?');
			values.push(routeData.description);
		}
		if (fields.length > 0) {
			values.push(route_id);
			const sql = `UPDATE routes SET ${fields.join(', ')} WHERE route_id = ?`;
			await pool.query(sql, values);
		}
		// Cập nhật điểm dừng nếu có
		if (Array.isArray(routeData.stop_points)) {
			// Xoá điểm dừng cũ
            const deleteStopPointSql = 'DELETE FROM stop_points WHERE route_id = ?';
			await pool.query(deleteStopPointSql, [route_id]);
			// Thêm lại điểm dừng mới
			for (let i = 0; i < routeData.stop_points.length; i++) {
				const stopSql = 'INSERT INTO stop_points (route_id, stop_name, stop_order) VALUES (?, ?, ?)';
				await pool.query(stopSql, [route_id, routeData.stop_points[i], i + 1]);
			}
		}
		return true;
	} catch (error) {
		console.error('Error updating route:', error);
		throw error;
	}
};

// Xoá chuyến đường và điểm dừng
const deleteRoute = async (route_id) => {
	try {
		// Xoá điểm dừng trước
        const deleteStopPointSql = 'DELETE FROM stop_points WHERE route_id = ?';
		await pool.query(deleteStopPointSql, [route_id]);
		// Xoá chuyến đường
        const deleteRouteSql = 'DELETE FROM routes WHERE route_id = ?';
		const [result] = await pool.query(deleteRouteSql, [route_id]);
		return result.affectedRows > 0;
	} catch (error) {
		console.error('Error deleting route:', error);
		throw error;
	}
};

// Xem danh sách chuyến đường kèm điểm dừng
const getAllRoutes = async () => {
	try {
		const sql = 'SELECT * FROM routes';
		const [routes] = await pool.query(sql);
		for (let route of routes) {
            const stopSql = 'SELECT stop_name, stop_order FROM stop_points WHERE route_id = ? ORDER BY stop_order';
			const [stops] = await pool.query(stopSql, [route.route_id]);
			route.stop_points = stops;
		}
		return routes;
	} catch (error) {
		console.error('Error getting routes:', error);
		throw error;
	}
};

module.exports = {
	addRoute,
	updateRoute,
	deleteRoute,
	getAllRoutes
};

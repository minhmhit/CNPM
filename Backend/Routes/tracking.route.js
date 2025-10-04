const express = require("express");
const router = express.Router();
const {
        getBusHistory,
        getBusLocation,
        updateBusLocation
    } = require("../Controllers/tracking.controller");
// Lấy vị trí xe buýt theo thời gian thực
router.get("/bus/:bus_id", getBusLocation);
// Lấy lịch sử di chuyển của xe
router.get("/history/:bus_id", getBusHistory);
// Lấy lịch sử di chuyển của tài xế
router.get("/history/driver/:driver_id", getDriverHistory);
// Cập nhật vị trí xe buýt (driver gửi lên)
router.post("/update", updateBusLocation);

module.exports = router;

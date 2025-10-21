const express = require("express");
const router = express.Router();
const {addRoute, updateRoute, deleteRoute, getAllRoutes, addStopPoints, getStopPointsByScheduleId} = require("../Controllers/route.controller");

router.post("/add", addRoute);
router.put("/update/:route_id", updateRoute);
router.delete("/delete/:route_id", deleteRoute);
router.get("/getAllRoutes", getAllRoutes);
router.post("/addStopPoint", addStopPoints);
router.get("/getStopPointsByScheduleId/:schedule_id", getStopPointsByScheduleId);


module.exports = router;

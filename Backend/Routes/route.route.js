const express = require("express");
const router = express.Router();
const {addRoute, updateRoute, deleteRoute, getAllRoutes} = require("../Controllers/route.controller");

router.post("/add", addRoute);
router.put("/update/:route_id", updateRoute);
router.delete("/delete/:route_id", deleteRoute);
router.get("/", getAllRoutes);


module.exports = router;

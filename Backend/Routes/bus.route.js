const express = require('express');
const router = express.Router();
const { addBus, updateBus, deleteBus, getAllBuses } = require('../controllers/bus.controller');
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// Apply authentication and admin authorization middleware to all bus routes
router.use(authMiddleware);
router.use(isAdmin);
router.post('/add', addBus);
router.put('/update/:bus_id', updateBus);
router.delete('/delete/:bus_id', deleteBus);
router.get('/', getAllBuses);

module.exports = router;

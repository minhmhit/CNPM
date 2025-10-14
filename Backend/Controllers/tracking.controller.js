const trackingService = require("../Services/tracking.service");

//getbuslocation
const getBusLocation = async (req, res) => {
    const { bus_id } = req.params;
    const data = await trackingService.getBusLocationService(bus_id);
    res.status(200).json(data);
};

const getBusHistory = async (req, res) => {
    const { bus_id } = req.params;
    const data = await trackingService.getBusHistoryService(bus_id);
    res.status(200).json(data);
};

const getDriverHistory = async (req, res) => {
    const { driver_id } = req.params;
    const data = await trackingService.getDriverHistoryService(driver_id);
    res.status(200).json(data);
};

const updateBusLocation = async (req, res) => {
    const { bus_id, driver_id, latitude, longitude } = req.body;
    const data = await trackingService.updateBusLocationService(bus_id, driver_id, latitude, longitude);
    res.status(200).json(data);
};

module.exports = {
    getBusLocation,
    getBusHistory,
    getDriverHistory,
    updateBusLocation,
};

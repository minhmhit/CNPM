const busService = require("../Services/bus.service");

const addBus = async (req, res) => {
    try {
        const busData = req.body;
        const result = await busService.addBus(busData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBus = async (req, res) => {
    try {
        const bus_id = req.params.bus_id;
        const busData = req.body;
        const result = await busService.updateBus(bus_id, busData);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBus = async (req, res) => {
    try {
        const bus_id = req.params.bus_id;
        const result = await busService.deleteBus(bus_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBuses = async (req, res) => {
    try {
        const result = await busService.getAllBuses();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addBus,
    updateBus,
    deleteBus,
    getAllBuses
};

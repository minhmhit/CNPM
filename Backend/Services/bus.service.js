const bus = require('../Models/bus.model');
const addBus = async (busData) => {
    try {
       let result = await bus.addBus(busData);
       return result;
    } catch (error) {
       throw error;
    }
};

const updateBus = async (bus_id, busData) => {
    try {
       let result = await bus.updateBus(bus_id, busData);
       return result;
    } catch (error) {
       throw error;
    }
};

const deleteBus = async (bus_id) => {
    try {
       let result = await bus.deleteBus(bus_id);
       return result;
    } catch (error) {
       throw error;
    }
};

const getAllBuses = async () => {
    try {
       let result = await bus.getAllBuses();
       return result;
    } catch (error) {
       throw error;
    }
};

module.exports = {
    addBus,
    updateBus,
    deleteBus,
    getAllBuses
};

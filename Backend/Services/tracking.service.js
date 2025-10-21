const tracking = require("../Models/livetracking.model");

const getBusLocationService = async (bus_id) => {
    try {
        let result = await tracking.getBusLocation(bus_id);
        return result;
    } catch (error) {
        throw error;
    }
};
const saveLocationService = async (locationData) => {
    try {
      // Lưu vị trí mới vào database
      const locationId = await tracking.saveLocation(locationData);
      
      // Trả về dữ liệu đã lưu kèm id
      return {
        tracking_id: locationId,
        ...locationData,
        timestamp: new Date()
      };
    } catch (error) {
      throw error;
    }
  }
const getBusHistoryService = async (bus_id) => {
    try {
        let result = await tracking.getBusHistory(bus_id);
        return result;
    } catch (error) {
        throw error;
    }
};

const getDriverHistoryService = async (driver_id) => {
    try {
        let result = await tracking.getDriverHistory(driver_id);
        return result;
    } catch (error) {
        throw error;
    }
};

const updateBusLocationService = async (bus_id, driver_id, latitude, longitude) => {
    try {
        let result = await tracking.updateBusLocation(bus_id, driver_id, latitude, longitude);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
  getBusLocationService,
  getBusHistoryService,
  getDriverHistoryService,
  updateBusLocationService,
  saveLocationService,
};

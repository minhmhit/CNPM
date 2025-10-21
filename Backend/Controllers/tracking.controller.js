const trackingService = require("../Services/tracking.service");

//getbuslocation
const getBusLocation = async (req, res) => {
    const { bus_id } = req.params;
    const data = await trackingService.getBusLocationService(bus_id);
    res.status(200).json(data);
};
const getLatestLocation = async (req, res) => {
    try {
      const { busId } = req.params;
      
      if (!busId) {
        return res.status(400).json({ success: false, message: 'Bus ID is required' });
      }
      
      const location = await trackingService.getLatestLocation(busId);
      
      if (!location) {
        return res.status(404).json({ success: false, message: 'No location data found' });
      }
      
      return res.status(200).json({ success: true, data: location });
    } catch (error) {
      console.error('Error getting latest location:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  
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
     try {
      const { bus_id, driver_id, latitude, longitude } = req.body;
      
      if (!bus_id || !driver_id || !latitude || !longitude) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      
      const locationData = { bus_id, driver_id, latitude, longitude };
      const savedLocation = await trackingService.saveLocationService(locationData);
      
    //   // Phát sóng cập nhật vị trí qua Socket.IO
    //   const io = req.app.get('io');
    //   if (io) {
    //     io.emit('locationUpdate', savedLocation);
    //   }
      
      return res.status(200).json({ success: true, data: savedLocation });
    } catch (error) {
      console.error('Error updating location:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getBusLocation,
    getBusHistory,
    getDriverHistory,
    updateBusLocation,
    getLatestLocation
};

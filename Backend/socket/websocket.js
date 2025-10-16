const socketIo = require("socket.io");
const trackingService = require("../Services/tracking.service");
const { getMyStudents, getMySchedules } = require("../Services/driver.service");

function setupWebSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket.IO connection handling
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Handle bus location updates
    socket.on("updateLocation", async (data) => {
      try {
        // Lưu vị trí mới vào database mỗi 10 phút

        const savedLocation = await trackingService.saveLocationService(data);
        // Broadcast location to all connected clients
        io.to(`schedule-${schedule_id}`).emit("locationUpdate", savedLocation);
      } catch (error) {
        console.error("Error updating location:", error);
      }
    });
    
    socket.on("joinScheduleRoom", async (schedule_id) => {
      socket.join(`schedule-${schedule_id}`);
      // Lấy danh sách học sinh từ DB

      const scheduleInfo = {
        schedule_id: schedule_id,
        userid: null,
      }
      const students = await getMyStudents(scheduleInfo);
      socket.emit("studentList", students);
    });

    // Join a specific bus tracking room
    socket.on("joinBusTrackingRoom", (busId) => {
      socket.join(`bus-${busId}`);
      console.log(`Client ${socket.id} joined tracking room for bus ${busId}`);
    });

    // Leave a specific bus tracking room
    socket.on("leaveBusTrackingRoom", (busId) => {
      socket.leave(`bus-${busId}`);
      console.log(`Client ${socket.id} left tracking room for bus ${busId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  return io;
}

module.exports = setupWebSocket;

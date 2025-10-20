const socketIo = require("socket.io");

function setupWebSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // dữ liệu xe bus (demo)
  const busPositions = {
    1: { bus_id: 1, lat: 10.762622, lng: 106.660172, speed: 30 },
    2: { bus_id: 2, lat: 10.772622, lng: 106.670172, speed: 25 },
  };

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Khi client vào theo dõi lịch
    socket.on("joinScheduleRoom", (scheduleId) => {
      console.log(`Client ${socket.id} joined room: ${scheduleId}`);
      socket.join(`schedule_${scheduleId}`);

      // Gửi danh sách sinh viên giả lập
      socket.emit("studentList", [
        { id: 1, name: "Nguyen Van A" },
        { id: 2, name: "Tran Thi B" },
      ]);

      // Gửi liên tục dữ liệu vị trí giả lập mỗi 2 giây
      const interval = setInterval(() => {
        Object.values(busPositions).forEach((bus) => {
          // random nhẹ vị trí cho xe “chạy”
          bus.lat += (Math.random() - 0.5) * 0.001;
          bus.lng += (Math.random() - 0.5) * 0.001;
          io.to(`schedule_${scheduleId}`).emit("locationUpdate", bus);
        });
      }, 2000);

      socket.on("leaveBusTrackingRoom", () => {
        console.log(`Client ${socket.id} left room: ${scheduleId}`);
        socket.leave(`schedule_${scheduleId}`);
        clearInterval(interval);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
        clearInterval(interval);
      });
    });
  });

  return io;
}

module.exports = setupWebSocket;

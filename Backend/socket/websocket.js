const socketIo = require("socket.io");
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
  });

  return io;
}

module.exports = setupWebSocket;

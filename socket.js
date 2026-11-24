const { Server } = require("socket.io");

// Single Socket.io server instance - will be initialized in server.js
let io = null;

function setupChat(server) {
  if (!io) {
    const allowedOrigins = (process.env.SOCKET_CORS_ORIGIN || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
    io = new Server(server, {
      cors: { origin: allowedOrigins.length > 0 ? allowedOrigins : true }
    });
  }

  // Chat namespace
  const chatIo = io.of("/chat");

  chatIo.on("connection", (socket) => {
    console.log(`Chat: Client connected: ${socket.id}`);

    socket.on("message", (text, acknowledge) => {
      if (typeof text !== "string" || !text.trim() || text.trim().length > 3000) {
        const error = "Message must be not empty or not more that 3000";
        if (typeof acknowledge === "function") {
          acknowledge({ success: false, error });
        } else {
          socket.emit("message:error", { success: false, error });
        }
        return;
      }
      chatIo.emit("message", {
        text: text.trim(),
        senderId: socket.id,
        sentAt: new Date().toISOString()
      });
      if (typeof acknowledge === "function") { acknowledge({ success: true }); }
    });

    socket.on("disconnect", () => {
      console.log(`Chat: Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { setupChat, getIo: () => io };
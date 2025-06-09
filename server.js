const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectDB = require("./src/config/database");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});


// socket.on("connect", () => {
//   console.log("✅ Socket connected!", socket.id);
// });
// Real-time communication
io.on("connect", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

socket.on("send-interest", ({ fromUser, toUserId, status }) => {
  console.log('>>>>>>>>>>>', fromUser, toUserId, status)
  io.to(toUserId).emit("new-notification", {
    message: `You have a new ${status} notification`,
    sender: fromUser,
    type: status,
  });
});

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

app.set("io", io);

connectDB().then(() => {
  server.listen(3000, () =>
    console.log("🚀 Server is running on http://localhost:3000")
  );
});

import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { bindSocket } from "./controllers/tracking.controller.js";
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});
io.on("connection", (socket) => {
    bindSocket(socket);
    socket.emit("server:ready", {
        message: "Connected to plant tracking updates",
    });
});
server.listen(env.PORT, () => {
    console.log(`Urban Farming API running on port ${env.PORT}`);
});

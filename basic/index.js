import {WebSocketServer, WebSocket} from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, request) => {
  console.log("Client connected");

  // Listen for messages from the client
  socket.on("message", (data) => {
    console.log("Message from client:", data.toString());

    // Optional: send a response back
    wss.clients.forEach((client) =>{
      if(client.readyState === WebSocket.OPEN) client.send(`${data.toString()}`);
    })
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

console.log("WebSocket server started on ws://localhost:8080");

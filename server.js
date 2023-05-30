const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fetch = require("node-fetch");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
var voiceServers = {};

app.get("/v/:server/:channel", function (req, res) {
  res.json(voiceServers[req.params.server][req.params.channel]);
});
app.get("/v/:server", function (req, res) {
  res.json(voiceServers[req.params.server]);
});

io.on("connection", (socket) => {
  socket.on("joinChannel", (data) => {
    console.log(data)
    if (voiceServers[data.server][data.channel]) {
      voiceServers[data.server][data.channel].push(data.userData)
    } else {
      voiceServers[data.server][data.channel] = []
      voiceServers[data.server][data.channel].push(data.userData)
    }
    io.in(socket.id).socketsJoin(data.server + data.channel);
  })
});

httpServer.listen(5000, console.log("LISTENING"));

setInterval(async () => {
  fetch("https://misty-sideways-okra.glitch.me/").then(
    console.log("PING!")
  );
}, 40000);
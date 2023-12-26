const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("login", (username, VIP) => {
    socket.username = username;
    socket.VIP = VIP;
  });

  socket.on("get username", () => {
    console.log(socket.username, socket.VIP);
  });
});

http.listen(8080, () => console.log("Listening at http://localhost:8080"));

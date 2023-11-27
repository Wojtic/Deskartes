const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("A new connection");
});

http.listen(8080, () => console.log("Listening at http://localhost:8080"));

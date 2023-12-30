const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

const bets = [{ game: "tictac", bets: [] }];

io.on("connection", (socket) => {
  socket.on("login", (username, VIP) => {
    socket.username = username;
    socket.VIP = VIP;
  });

  socket.on("get username", () => {
    console.log(socket.username, socket.VIP);
  });

  socket.on("create bet", (game, bet) => {
    for (let i = 0; i < bets.length; i++) {
      if (bets[i].game == game) {
        bets[i].bets.push({ value: bet, player: socket.username });
        break;
      }
    }
    console.log(bets);
  });
});

http.listen(8080, () => console.log("Listening at http://localhost:8080"));

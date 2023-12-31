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
        bets[i].bets.push({ value: bet, players: [socket.username] });
        socket.broadcast.emit("bets updated", game);
        break;
      }
    }
  });

  socket.on("get bets", (game, callback) => {
    for (let i = 0; i < bets.length; i++) {
      if (bets[i].game == game) {
        callback(bets[i].bets);
        break;
      }
    }
  });

  socket.on("closed menu", (game) => {
    for (let i = 0; i < bets.length; i++) {
      if (bets[i].game == game) {
        for (let j = 0; j < bets[i].bets.length; j++) {
          if (bets[i].bets[j].players.includes(socket.username)) {
            bets[i].bets[j].players.splice(
              bets[i].bets[j].players.indexOf(socket.username),
              1
            );
            if (bets[i].bets[j].players.length == 0) {
              bets[i].bets.splice(j, 1);
              j--;
            }
            socket.broadcast.emit("bets updated", game);
          }
        }
      }
    }
  });
});

http.listen(8080, () => console.log("Listening at http://localhost:8080"));

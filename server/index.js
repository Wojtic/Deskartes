const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});
app.use(express.static(path.join(__dirname, "app")));

const bets = [{ game: "tictac", bets: [] }];
const games = [{ game: "tictac", games: [] }]; // Must have same order as bets

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

  socket.on("start game", (game, index) => {
    for (let i = 0; i < bets.length; i++) {
      if (bets[i].game == game) {
        bets[i].bets[index].players.push(socket.username);
        if (bets[i].bets[index].players.length == 2) {
          // Tohle bude potreba zmenit!
          io.emit(
            "force game start",
            game,
            bets[i].bets[index].players,
            bets[i].bets[index].bet
          );
          games[i].games.push({
            players: bets[i].bets[index].players,
            bet: bets[i].bets[index].bet,
          });
          bets[i].bets.splice(index, 1);
          socket.broadcast.emit("bets updated", game);
        } else {
        }
        break;
      }
    }
  });

  socket.on("start tictac", (callback) => {
    for (let i = 0; i < games.length; i++) {
      if (games[i].game == "tictac") {
        for (let j = 0; j < games[i].games.length; j++) {
          if (games[i].games[j].players.includes(socket.username)) {
            if (games[i].games[j].initialized) {
              const isFirstX = games[i].games[j].firstIsX;
              const isSocketFirst =
                games[i].games[j].players.indexOf(socket.username) == 0;
              const isSocketX = isSocketFirst ? isFirstX : !isFirstX;
              return callback(
                isSocketX,
                games[i].games[j].players[isSocketFirst ? 1 : 0]
              );
            }
            games[i].games[j].initialized = true;
            let isFirstX = Math.random() < 0.5;
            games[i].games[j].firstIsX = isFirstX;
            let isSocketFirst =
              games[i].games[j].players.indexOf(socket.username) == 0;
            let isSocketX = isSocketFirst ? isFirstX : !isFirstX;
            callback(
              isSocketX,
              games[i].games[j].players[isSocketFirst ? 1 : 0]
            );
            return;
          }
        }
        break;
      }
    }
  });

  socket.on("tictac turn", (index) => {
    console.log("here");
    socket.broadcast.emit("tictac turned", socket.username, index);
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
      break;
    }
  });
});

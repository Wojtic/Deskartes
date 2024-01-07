import { vw, vh, tictac_textury, socket, hrac } from "../main.js";
import { simpleText } from "../utils/utils.js";

let online = true;
let isX = true; // Proti pocitaci musi byt true, jinak pocitac pocita za svoje oba symboly
let opponentName = "";
let grid;
let gridLHeight, gridLWidth;
let opaque;

let game = [0, 0, 0, 0, 0, 0, 0, 0, 0];

export const tictac = {
  name: "Piškvorky",
  id: "tictac",
  menu_items: [
    {
      texture: "tictac_three",
      game: createTicTacThree,
    },
    {
      texture: "tictac_infinity",
      game: createTicTacInfinity,
    },
  ],
};

export async function createTicTacThree(isOnline) {
  async function opponent() {
    if (isGameOver(game)) return endGame();
    if (online) {
      socket.on("tictac turned", async (oppName, index) => {
        if (oppName != opponentName) return;
        const char = await getChar(!isX ? "X" : "Y");
        char.x = (((index % 3) - 1) * gridLWidth) / 3;
        char.y = (((index - (index % 3)) / 3 - 1) * gridLHeight) / 3;
        game[index] = isX ? -1 : 1;
        grid.addChild(char);
        if (isGameOver(game)) return endGame();
        turn();
        socket.off("tictac turned");
      });
    } else {
      let bestMoveIndex = findBestMove(game);
      game[bestMoveIndex] = -1;
      const char = await getChar(!isX ? "X" : "Y");
      char.x = (((bestMoveIndex % 3) - 1) * gridLWidth) / 3;
      char.y =
        (((bestMoveIndex - (bestMoveIndex % 3)) / 3 - 1) * gridLHeight) / 3;
      grid.addChild(char);
      if (isGameOver(game)) return endGame();
      turn();
    }
  }
  // Function to check if a move is valid in the current board configuration
  function isValidMove(board, index) {
    return board[index] === 0;
  }

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];
  function isGameOver(board) {
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c])
        return true;
    }
    return !board.includes(0);
  }

  function evaluate(board) {
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c])
        return board[a];
    }
    return 0;
  }

  function minimax(board, depth, maximizingPlayer) {
    if (isGameOver(board)) return evaluate(board);

    if (maximizingPlayer) {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (isValidMove(board, i)) {
          board[i] = -1;
          best = Math.min(best, minimax(board, depth + 1, false));
          board[i] = 0;
        }
      }
      return best;
    } else {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (isValidMove(board, i)) {
          board[i] = 1;
          best = Math.max(best, minimax(board, depth + 1, true));
          board[i] = 0; // Undo move
        }
      }
      return best;
    }
  }

  function findBestMove(board) {
    let bestVal = Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (board[i] === 0) {
        board[i] = -1;
        let moveVal = minimax(board, 1, false);
        board[i] = 0;

        if (moveVal < bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  function endGame() {
    socket.off("tictac turned");

    let line = new PIXI.Graphics();

    for (let i = 0; i < 3; i++) {
      if (
        game[3 * i] != 0 &&
        game[3 * i] == game[3 * i + 1] &&
        game[3 * i + 1] == game[3 * i + 2]
      ) {
        let startPoint = { x: 0, y: 0 };
        startPoint.x = gridLWidth / -3;
        startPoint.y = ((i - 1) * gridLHeight) / 3;
        let endPoint = { x: 0, y: 0 };
        endPoint.x = gridLWidth / 3;
        endPoint.y = ((i - 1) * gridLHeight) / 3;

        line
          .lineStyle(10, 0xff0000)
          .moveTo(startPoint.x, startPoint.y)
          .lineTo(endPoint.x, endPoint.y);
        grid.addChild(line);
      }
    }
    for (let i = 0; i < 3; i++) {
      if (game[i] != 0 && game[i] == game[3 + i] && game[6 + i] == game[i]) {
        let startPoint = { x: 0, y: 0 };
        startPoint.x = ((i - 1) * gridLWidth) / 3;
        startPoint.y = gridLHeight / -3;
        let endPoint = { x: 0, y: 0 };
        endPoint.x = ((i - 1) * gridLWidth) / 3;
        endPoint.y = gridLHeight / 3;

        line
          .lineStyle(10, 0xff0000)
          .moveTo(startPoint.x, startPoint.y)
          .lineTo(endPoint.x, endPoint.y);
        grid.addChild(line);
      }
    }
    if (game[0] != 0 && game[0] == game[4] && game[4] == game[8]) {
      line
        .lineStyle(10, 0xff0000)
        .moveTo(gridLWidth / -3, gridLHeight / -3)
        .lineTo(gridLWidth / 3, gridLHeight / 3);
      grid.addChild(line);
    }
    if (game[2] != 0 && game[2] == game[4] && game[4] == game[6]) {
      line
        .lineStyle(10, 0xff0000)
        .moveTo(gridLWidth / 3, gridLHeight / -3)
        .lineTo(gridLWidth / -3, gridLHeight / 3);
      grid.addChild(line);
    }
  }

  function turn() {
    const getPos = (local) => {
      const temp = local / (744 / 2);
      if (temp < -1 / 3) return -1;
      if (temp > 1 / 3) return 1;
      return 0;
    };

    function beginTurn(e) {
      let pos = e.data.getLocalPosition(grid); // Nejake pocitani s maticemi, mozna se tomu vyhnout
      let coords = { x: getPos(pos["x"]), y: getPos(pos["y"]) };
      if (game[(coords.y + 1) * 3 + coords.x + 1] == 0) {
        opaque.alpha = 0.5;
        opaque.x = (coords.x * gridLWidth) / 3;
        opaque.y = (coords.y * gridLHeight) / 3;
      }
    }
    let lastEmitedIndex = undefined;
    function endTurn(index) {
      grid.removeAllListeners();
      if (online && lastEmitedIndex != index) {
        lastEmitedIndex = index;
        socket.emit("tictac turn", index);
      }
      opponent();
    }

    async function click(e) {
      let pos = e.data.getLocalPosition(grid); // Nejake pocitani s maticemi, mozna se tomu vyhnout
      let coords = { x: getPos(pos["x"]), y: getPos(pos["y"]) };
      let index = (coords.y + 1) * 3 + coords.x + 1;
      if (game[index] == 0) {
        const char = await getChar(isX ? "X" : "Y");
        char.x = (coords.x * gridLWidth) / 3;
        char.y = (coords.y * gridLHeight) / 3;
        grid.addChild(char);

        game[index] = isX ? 1 : -1;

        endTurn((coords.y + 1) * 3 + coords.x + 1);
      }
    }

    grid.on("mouseleave", (e) => {
      opaque.alpha = 0;
    });

    grid.on("mousemove", beginTurn);
    grid.on("pointerdown", click);
  }

  async function getChar(letter) {
    const char = new PIXI.Sprite(tictac_textury[letter]);
    char.scale.set((20 * vh) / char.height);
    char.anchor.set(0.5);
    return char;
  }

  async function initOnline() {
    return new Promise((resolve) => {
      return socket.emit("start tictac", (X, opponentUnsetName) => {
        isX = X;
        opponentName = opponentUnsetName;
        resolve();
      });
    });
  }

  async function createPlayersHUD() {
    const HUD = new PIXI.Graphics();
    const X = await getChar("X");
    const Y = await getChar("Y");
    HUD.beginFill(0x999999);
    HUD.drawRect(0, 0, 20 * vw, 20 * vh);
    X.x = 2 * vw;
    X.y = 5 * vh;
    X.scale.set((3 * vh) / X.height);
    Y.x = 2 * vw;
    Y.y = 14 * vh;
    Y.scale.set((3 * vh) / Y.height);
    HUD.addChild(X);
    HUD.addChild(Y);

    HUD.addChild(simpleText(5, 2, 40, isX ? hrac.jmeno : opponentName));
    HUD.addChild(
      simpleText(
        5,
        12,
        40,
        online ? (isX ? opponentName : hrac.jmeno) : "Počítač"
      )
    );
    return HUD;
  }

  // Here it begins
  online = isOnline;
  if (online) await initOnline();
  const Game = new PIXI.Container();
  const white = new PIXI.Graphics();
  const HUD = await createPlayersHUD();
  white.beginFill(0xffffff);
  white.drawRect(0, 0, 100 * vw, 100 * vh);
  white.alpha = 1;

  grid = new PIXI.Sprite(tictac_textury["three_grid"]);
  grid.scale.set((80 * vh) / grid.height);
  grid.anchor.set(0.5);
  grid.x = 50 * vw;
  grid.y = 50 * vh;
  grid.interactive = true;
  gridLHeight = grid.getLocalBounds().height;
  gridLWidth = grid.getLocalBounds().width;

  opaque = await getChar(isX ? "X" : "Y");
  opaque.alpha = 0; // ještě nastavit scale

  if (online ? isX : true) turn();
  else opponent();

  Game.addChild(white);
  grid.addChild(opaque);
  Game.addChild(grid);
  Game.addChild(HUD);
  return Game;
}

export async function createTicTacInfinity(online) {
  const Game = new PIXI.Container();
  const white = new PIXI.Graphics();
  white.beginFill(0x222222);
  white.drawRect(0, 0, 100 * vw, 100 * vh);
  white.alpha = 1;

  console.log("nekonečné tady", online);
  Game.addChild(white);
  return Game;
}

import { vw, vh, hlavy_textury, app } from "../main.js";

export const chess = {
  name: "Šachy",
  menu_items: [
    {
      texture: "chess",
      game: createChess,
      online: false,
    },
  ],
};

let callOnEnd;

export async function createChess(online, onEnd) {
  callOnEnd = onEnd;

  var board = null;
  var game = new Chess();

  function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false;

    // only pick up pieces for White
    if (piece.search(/^b/) !== -1) return false;
  }

  function makeRandomMove() {
    var possibleMoves = game.moves();

    // game over
    if (possibleMoves.length === 0) return;

    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
    updateStatus();
  }

  function onDrop(source, target) {
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return "snapback";

    // make random legal move for black
    updateStatus();

    window.setTimeout(makeRandomMove, 250);
  }

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  function onSnapEnd() {
    board.position(game.fen());
  }
  function updateStatus() {
    var status = "";

    var moveColor = "White";
    if (game.turn() === "b") {
      moveColor = "Black";
    }

    // checkmate?
    if (game.in_checkmate()) {
      status = "Game over, " + moveColor + " is in checkmate.";
      setTimeout(() => {
        board.destroy();
        onEnd(game.turn() === "b");
      }, 5000);
    }

    // draw?
    else if (game.in_draw()) {
      status = "Game over, drawn position";
      setTimeout(() => {
        board.destroy();
        onEnd(false);
      }, 5000);
    }

    // game still on
    else {
      status = moveColor + " to move";

      // check?
      if (game.in_check()) {
        status += ", " + moveColor + " is in check";
      }
    }
  }

  var config = {
    draggable: true,
    position: "start",
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
  };
  board = Chessboard("myBoard", config);
  return "chess";
}

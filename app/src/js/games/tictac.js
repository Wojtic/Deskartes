import { vw, vh, tictac_textury } from "../main.js";

let onTurn = true;
let grid;

export const tictac = {
  name: "Piškvorky",
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

function turn() {
  grid.on("mousemove", (e) => {
    let pos = e.data.getLocalPosition(grid);
    console.log(pos["x"] / grid.width);
  });
}

export async function createTicTacThree(online) {
  const Game = new PIXI.Container();
  const white = new PIXI.Graphics();
  white.beginFill(0xffffff);
  white.drawRect(0, 0, 100 * vw, 100 * vh);
  white.alpha = 1;

  grid = new PIXI.Sprite(tictac_textury["three_grid"]);
  grid.scale.set((80 * vh) / grid.height);
  grid.anchor.set(0.5);
  grid.x = 50 * vw;
  grid.y = 50 * vh;
  grid.interactive = true;

  if (onTurn) turn();

  console.log("tady", online);
  Game.addChild(white);
  Game.addChild(grid);
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

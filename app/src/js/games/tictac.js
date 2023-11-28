import { vw, vh } from "../main.js";

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
export async function createTicTacThree(online) {
  const Game = new PIXI.Container();
  const white = new PIXI.Graphics();
  white.beginFill(0xffffff);
  white.drawRect(0, 0, 100 * vw, 100 * vh);
  white.alpha = 1;

  console.log("tady", online);
  Game.addChild(white);
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

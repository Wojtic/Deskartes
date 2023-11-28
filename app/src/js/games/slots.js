import { vw, vh } from "../main.js";

export const slots = {
  name: "Sloty?",
  menu_items: [
    {
      texture: "slots",
      game: createSlots,
    },
  ],
};
export async function createSlots(online) {
  const Game = new PIXI.Container();
  const white = new PIXI.Graphics();
  white.beginFill(0xffffff);
  white.drawRect(0, 0, 100 * vw, 100 * vh);
  white.alpha = 1;

  console.log("tady", online);
  Game.addChild(white);
  return Game;
}

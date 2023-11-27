import { vw, vh } from "../main.js";

export function getWidthHeight() {
  let width, height;
  if (window.innerWidth * (9 / 16) > window.innerHeight) {
    height = window.innerHeight;
    width = height * (16 / 9);
  } else {
    width = window.innerWidth;
    height = width * (9 / 16);
  }
  return [width, height];
}

export function getDarkener() {
  const dark = new PIXI.Graphics();
  dark.beginFill(0x000000);
  dark.drawRect(0, 0, 100 * vw, 100 * vh);
  dark.alpha = 0.3;
  return dark;
}

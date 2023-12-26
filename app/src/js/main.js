import { createBubble } from "./utils/talk_bubble.js";
import { getWidthHeight } from "./utils/utils.js";
import { createEnterance } from "./utils/enterance.js";
import { createLobby } from "./utils/lobby.js";
import { createTicTacThree } from "./games/tictac.js";

export let hrac = {
  jmeno: "",
  VIP: false,
};
export const socket = io("ws://localhost:8080");

let [width, height] = getWidthHeight();
export let [vw, vh] = [width / 100, height / 100];
let app = new PIXI.Application({
  background: "#015876",
  width: width,
  height: height,
});
document.querySelector("#game").appendChild(app.view);

window.onresize = () => {
  // Na tohle bych se asi vykašlal, prostě jaké to načteš, takové to máš
  let [newWidth, newHeight] = getWidthHeight();
  if (newWidth != app.view.width) app.renderer.resize(newWidth, newHeight);
  [vw, vh] = [app.view.width / 100, app.view.height / 100];
};

let hlavy_textury;
let hlavy_okraje_textury;
let hlasky;
export let enterance_textury;
export let lobby_textury;

export let tictac_textury;

async function load() {
  await PIXI.Assets.init({ manifest: "src/data/manifest.json" });
  enterance_textury = await PIXI.Assets.loadBundle("welcome_screen");
}

async function load_hlavy() {
  hlavy_textury = await PIXI.Assets.loadBundle("hlavy");
  hlavy_okraje_textury = await PIXI.Assets.loadBundle("hlavy_okraje");
  hlasky = await fetch("src/data/hlasky.json");
  hlasky = await hlasky.json();
}

async function main() {
  await load();

  /* Smazat!
  tictac_textury = await PIXI.Assets.loadBundle("tictac");
  await load_hlavy();
  let piskovrky = await createTicTacThree(true);
  app.stage.addChild(piskovrky);
  */

  const vstup = await createEnterance(async (jmeno, VIP) => {
    hrac.jmeno = jmeno;
    hrac.VIP = VIP;
    socket.emit("login", hrac.jmeno, hrac.VIP);

    const lobby = await createLobby(async (game, online) => {
      const hra = await game(online);
      lobby.destroy();
      app.stage.addChild(hra);
    });

    vstup.destroy();
    app.stage.addChild(lobby);
  });
  app.stage.addChild(vstup);
  lobby_textury = await PIXI.Assets.loadBundle("lobby_screen");
  tictac_textury = await PIXI.Assets.loadBundle("tictac");
  await load_hlavy();
}

main();

import { createBubble } from "./utils/talk_bubble.js";
import { getWidthHeight } from "./utils/utils.js";
import { createEnterance } from "./utils/enterance.js";
import { createLobby } from "./utils/lobby.js";
import { createTicTacThree } from "./games/tictac.js";
import { getMoneyHUD, updateMoney } from "./utils/money.js";

export let hrac = {
  jmeno: "",
  VIP: false,
  money: 100,
};
export const socket = io();

let [width, height] = getWidthHeight();
export let [vw, vh] = [width / 100, height / 100];
let app = new PIXI.Application({
  background: "#015876",
  width: width,
  height: height,
});
document.querySelector("#game").appendChild(app.view);

let hlavy_textury;
let hlavy_okraje_textury;
let hlasky;
export let enterance_textury;
export let lobby_textury;
export let tlacitka_textury;

export let tictac_textury;

async function load() {
  await PIXI.Assets.init({ manifest: "src/data/manifest.json" });
  enterance_textury = await PIXI.Assets.loadBundle("welcome_screen");
  tlacitka_textury = await PIXI.Assets.loadBundle("tlacitka");
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
    const moneyHUD = getMoneyHUD();

    async function startAll() {
      const lobby = await createLobby(async (game, online, bet) => {
        updateMoney(-bet);
        const hra = await game(online, (winner) => {
          if (winner) updateMoney(bet);
          hra.eventMode = "static";
          hra.on("pointerdown", (e) => {
            app.stage.removeChildren();
            startAll();
          });
        });
        lobby.destroy();
        app.stage.removeChild(moneyHUD);
        app.stage.addChild(hra);
        app.stage.addChild(moneyHUD);
      });
      app.stage.addChild(lobby);
      app.stage.addChild(moneyHUD);
    }

    vstup.destroy();
    startAll();
  });
  app.stage.addChild(vstup);

  lobby_textury = await PIXI.Assets.loadBundle("lobby_screen");
  tictac_textury = await PIXI.Assets.loadBundle("tictac");
  await load_hlavy();
}

main();

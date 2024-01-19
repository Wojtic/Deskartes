import { createBubble } from "./utils/talk_bubble.js";
import { getWidthHeight } from "./utils/utils.js";
import { createEnterance } from "./utils/enterance.js";
import { createLobby } from "./utils/lobby.js";
import { createTicTacThree } from "./games/tictac.js";
import { getMoneyHUD, updateMoney } from "./utils/money.js";
import { mergeP5 } from "./games/merge.js";

export let hrac = {
  jmeno: "",
  VIP: false,
  money: 100,
};
export const socket = io();

let [width, height] = getWidthHeight();
export let [vw, vh] = [width / 100, height / 100];
export let app = new PIXI.Application({
  background: "#ffffff",
  width: width,
  height: height,
});
document.querySelector("#game").appendChild(app.view);

export let hlavy_textury;
export let hlavy_okraje_textury;
export let ovoce_textury;
export let hlasky;
export let enterance_textury;
export let lobby_textury;
export let tlacitka_textury;

export let tictac_textury;

async function load() {
  await PIXI.Assets.init({ manifest: "src/data/manifest.json" });
  enterance_textury = await PIXI.Assets.loadBundle("welcome_screen");
  tlacitka_textury = await PIXI.Assets.loadBundle("tlacitka");
  ovoce_textury = await PIXI.Assets.loadBundle("ovoce");
}

async function load_hlavy() {
  hlavy_textury = await PIXI.Assets.loadBundle("hlavy");
  hlavy_okraje_textury = await PIXI.Assets.loadBundle("hlavy_okraje");
  hlasky = await fetch("src/data/hlasky.json");
  hlasky = await hlasky.json();
}

var audio1 = new Audio("../media/audio/kasino.mp3");
var audio2 = new Audio("../media/audio/dvojka.mp3");
function zahraj1() {
  audio1.play();
  setTimeout(zahraj2, 40000);
}

function zahraj2() {
  audio2.play();
  setTimeout(zahraj1, 45000);
}

async function main() {
  await load();

  const vstup = await createEnterance(async (jmeno, VIP) => {
    hrac.jmeno = jmeno;
    hrac.VIP = VIP;
    socket.emit("login", hrac.jmeno, hrac.VIP);
    const moneyHUD = getMoneyHUD();
    zahraj1();

    async function startAll() {
      const lobby = await createLobby(async (game, online, bet) => {
        updateMoney(-bet);
        const hra = await game(online, (winner) => {
          if (winner) updateMoney(2 * bet);
          if (hra != "merge" && hra != "chess") {
            hra.eventMode = "static";
            hra.on("pointerdown", (e) => {
              app.stage.removeChildren();
              startAll();
            });
          } else {
            document.querySelector("#game").style.display = "inherit";
            document.querySelector("#game").firstElementChild.style.display =
              "inherit";
          }
        });
        if (hra == "merge") {
          // Strašná prasárna

          document.querySelector("#game").firstElementChild.style.display =
            "none";
          new p5(mergeP5, "game");
        } else if (hra == "chess") {
          document.querySelector("#game").style.display = "none";
        } else {
          lobby.destroy();
          app.stage.removeChild(moneyHUD);
          app.stage.addChild(hra);
          app.stage.addChild(moneyHUD);
        }
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

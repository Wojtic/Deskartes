import { createBubble } from "./utils/talk_bubble.js";
import { getWidthHeight } from "./utils/utils.js";
import { createEnterance } from "./utils/enterance.js";
import { createLobby } from "./utils/lobby.js";

export let hrac = {
  jmeno: "",
  VIP: false,
};

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
  const vstup = await createEnterance((jmeno, VIP) => {
    hrac.jmeno = jmeno;
    hrac.VIP = VIP;
    vstup.destroy();
    createLobby();
  });
  app.stage.addChild(vstup);
  await load_hlavy();

  // Testovací věci

  //const socket = io("ws://localhost:8080");
  /*
  const hlaska = hlasky[Math.floor(Math.random() * hlasky.length)];
  let bublina = createBubble(
    hlavy_okraje_textury[hlaska.person + "_okraj"],
    hlaska.text,
    ""
  );
  app.stage.addChild(bublina);*/
}

main();

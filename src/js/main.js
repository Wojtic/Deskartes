let [width, height] = getWidthHeight();
[vw, vh] = [width / 100, height / 100];
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
let hlasky;

async function load() {
  /*postavy.forEach((element) => {
    PIXI.Assets.add(element, `media/hlavy/${element}.png`);
  });*/

  await PIXI.Assets.init({ manifest: "src/data/manifest.json" });

  hlavy_textury = await PIXI.Assets.loadBundle("hlavy");
  console.log(hlavy_textury);
  hlasky = await fetch("src/data/hlasky.json");
  hlasky = await hlasky.json();
}

load().then(main);

// Testovací věci

function main() {
  const hlaska = hlasky[Math.floor(Math.random() * hlasky.length)];
  let bublina = createBubble(hlavy_textury[hlaska.person], hlaska.text, "");
  app.stage.addChild(bublina);
}

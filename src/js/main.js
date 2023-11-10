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

const postavy = [
  "beckova",
  "bustova",
  "filipik",
  "hovorka",
  "hruba",
  "janisova",
  "kocianova",
  "korbeliusova",
  "matousek",
  "molt",
  "pulec",
  "ruzicka",
  "velensky",
  "zdarek",
];

const loader = PIXI.loader;

postavy.forEach((element) => {
  PIXI.Assets.add(element, `media/hlavy/${element}.png`);
});

PIXI.Assets.load(postavy).then(main);

// Testovací věci

function main(textures) {
  const hlaska = HLASKY[3];
  let bublina = createBubble(textures[hlaska.person], hlaska.text, "");
  app.stage.addChild(bublina);
}

let [width, height] = getWidthHeight();
[vw, vh] = [width / 100, height / 100];
let app = new PIXI.Application({
  background: "#015876",
  width: width,
  height: height,
});
document.querySelector("#game").appendChild(app.view);

createBubble(app, "", "", "");

window.onresize = () => {
  // Na tohle bych se asi vykašlal, prostě jaké to načteš, takové to máš
  let [newWidth, newHeight] = getWidthHeight();
  if (newWidth != app.view.width) app.renderer.resize(newWidth, newHeight);
  [vw, vh] = [app.view.width / 100, app.view.height / 100];
};

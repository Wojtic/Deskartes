import { vw, vh, hrac, ovoce_textury } from "../main.js";

let textBox;

export function getMoneyHUD() {
  const HUD = new PIXI.Container();
  const icon = new PIXI.Sprite(ovoce_textury["coin"]);
  icon.x = 97.5 * vw;
  icon.y = 0.2 * vh;
  icon.scale.set(0.09);

  textBox = new PIXI.Text(hrac.jmeno + ": " + hrac.money, {
    fontFamily: "Arial",
    fontSize: 30,
    fill: 0x000000,
    align: "center",
  });
  textBox.x = 85.5 * vw;
  textBox.y = 0.5 * vh;

  let rect = new PIXI.Graphics();
  rect.beginFill(0xffffff);
  rect.drawRect(85 * vw, 0, 15 * vw, 5 * vh);
  rect.alpha = 1;

  HUD.addChild(rect);
  HUD.addChild(textBox);
  HUD.addChild(icon);

  return HUD;
}

export function updateMoney(delta) {
  hrac.money += delta;
  textBox.text = hrac.jmeno + ": " + hrac.money;
}

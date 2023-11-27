import { enterance_textury, vw, vh } from "../main.js";
import { createBubble } from "./talk_bubble.js";

export async function createEnterance(onEnterance) {
  const Enterance = new PIXI.Container();

  const background = new PIXI.Sprite(enterance_textury["backdrop"]);
  background.scale.set((100 * vw) / background.width);
  background.x = 0;
  background.y = 0;

  const btn_enter = new PIXI.Sprite(enterance_textury["btn_enter"]);
  btn_enter.anchor.set(0.5);
  btn_enter.scale.set((30 * vw) / btn_enter.width);
  btn_enter.x = 50 * vw;
  btn_enter.y = 60 * vh;

  Enterance.addChild(background);
  Enterance.addChild(btn_enter);

  btn_enter.eventMode = "static";
  btn_enter.cursor = "pointer";
  btn_enter.on("pointerdown", () =>
    authenticate(Enterance, (jmeno) => {
      let isVIP = true;
      onEnterance(jmeno, isVIP);
    })
  );
  return Enterance;
}

function authenticate(stage, ondone) {
  const bublina = createBubble(
    enterance_textury["filipik"],
    "Nebuďte slušnej, řekněte jméno! (TODO)",
    {
      type: "input",
      darken: true,
      text_auth: (text) => {
        ondone(text);
        return text == "ZADANY TEXT (TODO)";
      },
    }
  );
  stage.addChild(bublina);
}

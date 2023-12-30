import { enterance_textury, vw, vh } from "../main.js";
import { createBubble } from "./talk_bubble.js";
import { textButton } from "./utils.js";

export async function createEnterance(onEnterance) {
  const Enterance = new PIXI.Container();

  const background = new PIXI.Sprite(enterance_textury["backdrop"]);
  background.scale.set((100 * vw) / background.width);
  background.x = 0;
  background.y = 0;

  /*const btn_enter = new PIXI.Sprite(enterance_textury["btn_enter"]);
  btn_enter.anchor.set(0.5);
  btn_enter.scale.set((30 * vw) / btn_enter.width);
  btn_enter.x = 50 * vw;
  btn_enter.y = 60 * vh;*/
  const btn_enter = textButton(
    50,
    60,
    "Vstoupit",
    () =>
      authenticate(Enterance, (jmeno) => {
        let isVIP = jmeno == "abc";
        onEnterance(jmeno, isVIP);
      }),
    true,
    3
  );

  Enterance.addChild(background);
  Enterance.addChild(btn_enter);

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
        if (text.length > 1) {
          ondone(text);
          return true;
        }
        return false;
      },
    }
  );
  stage.addChild(bublina);
}

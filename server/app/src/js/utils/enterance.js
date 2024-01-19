import { enterance_textury, vw, vh } from "../main.js";
import { createBubble } from "./talk_bubble.js";
import { textButton } from "./utils.js";

export async function createEnterance(onEnterance) {
  const Enterance = new PIXI.Container();

  const background = new PIXI.Sprite(enterance_textury["backdrop"]);
  background.scale.set((100 * vw) / background.width);
  background.x = 0;
  background.y = 0;

  const btn_enter = textButton(
    50,
    60,
    "Vstoupit",
    () =>
      authenticate(Enterance, (jmeno) => {
        let isVIP =
          jmeno[0] == jmeno[0].toUpperCase() &&
          jmeno[jmeno.length - 1] == jmeno[jmeno.length - 1].toUpperCase();
        onEnterance(jmeno, isVIP);
      }),
    true,
    1
  )[0];

  Enterance.addChild(background);
  Enterance.addChild(btn_enter);

  return Enterance;
}

function authenticate(stage, ondone) {
  const bublina = createBubble(
    enterance_textury["filipik"],
    "Hlavně se nezapomeňte podepsat!",
    {
      type: "input",
      darken: true,
      text_auth: (text) => {
        if (text.length > 2) {
          ondone(text);
          return true;
        }
        return false;
      },
    }
  );
  stage.addChild(bublina);
}

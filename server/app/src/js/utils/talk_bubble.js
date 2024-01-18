import { vw, vh, tlacitka_textury } from "../main.js";
import { getDarkener } from "./utils.js";

const charsPerLine = 70;
const BORDER = 40;

let hasInput = false;
let input_text = "";

export function createBubble(head_texture, text, type) {
  const Bubble = new PIXI.Container();

  const rectHeight = 2 * BORDER + 35 * Math.ceil(text.length / charsPerLine);
  const hlava = new PIXI.Sprite(head_texture);
  hlava.scale.set((20 * vw) / hlava.width);
  hlava.x = BORDER / 2;
  hlava.y = 100 * vh - hlava.height - BORDER;

  // https://pixijs.com/examples/text/pixi-text
  const textBox = new PIXI.Text(text, {
    fontFamily: "Arial",
    fontSize: 30,
    fill: 0x000000,
    align: "center",
    wordWrap: true,
    wordWrapWidth: 80 * vw - BORDER * 2,
  });
  textBox.x = 25 * vw;
  textBox.y = 100 * vh - rectHeight + BORDER;

  const bublina = new PIXI.Sprite(tlacitka_textury["bublina"]);
  bublina.anchor.set(1, 1);
  bublina.x = 100 * vw;
  bublina.y = 100 * vh;
  bublina.scale.set((90 * vw) / bublina.width, rectHeight / bublina.height);

  if (type && type.darken) Bubble.addChild(getDarkener());

  Bubble.addChild(bublina);
  Bubble.addChild(textBox);
  Bubble.addChild(hlava);

  Bubble.eventMode = "static";
  Bubble.cursor = "pointer";
  Bubble.on("pointerdown", () => {
    if (type) {
      if (type.type == "input") {
        if (!hasInput) {
          bindInput(textBox, 50, checkInput);
        } else {
          window.removeEventListener("keydown", handleKeydown);
          checkInput(input_text);
        }
      }
    } else {
      Bubble.destroy();
    }
  });

  function checkInput(name) {
    if (type.text_auth(name)) {
      window.removeEventListener("keydown", handleKeydown);
      return Bubble.destroy();
    } else {
      bindInput(textBox, 50, checkInput);
    }
  }

  return Bubble;
}

async function bindInput(textBox, maxLength = 50, onenter) {
  input_text = "";
  hasInput = true;
  textBox.text = input_text;
  window.remo;
  function onCall(e) {
    handleKeydown(e, textBox, onenter, maxLength);
  }
  window.addEventListener("keydown", onCall);
}
function handleKeydown(e, textBox, onenter, maxLength = 50) {
  if (e.key.length == 1 && input_text.length < maxLength) {
    input_text += e.key;
    textBox.text = input_text;
  } else if (e.key == "Backspace") {
    input_text = input_text.slice(0, -1);
    textBox.text = input_text;
  } else if (e.key == "Enter") {
    window.removeEventListener("keydown", handleKeydown);
    return onenter(input_text);
  }
}

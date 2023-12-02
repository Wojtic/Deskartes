import { vw, vh } from "../main.js";
import { getDarkener } from "./utils.js";

const charsPerLine = 100;
const BORDER = 40;

let hasInput = false;

export function createBubble(head_texture, text, type) {
  const Bubble = new PIXI.Container();

  const rectHeight = 2 * BORDER + 35 * Math.ceil(text.length / charsPerLine);
  const hlava = new PIXI.Sprite(head_texture);
  hlava.scale.set((20 * vw) / hlava.width);
  hlava.x = BORDER / 2;
  hlava.y = 100 * vh - rectHeight - hlava.height - BORDER / 2;

  // https://pixijs.com/examples/text/pixi-text
  const textBox = new PIXI.Text(text, {
    fontFamily: "Arial",
    fontSize: 30,
    fill: 0x000000,
    align: "center",
    wordWrap: true,
    wordWrapWidth: 100 * vw - BORDER * 2,
  });
  textBox.x = BORDER;
  textBox.y = 100 * vh - rectHeight + BORDER;

  let rect = new PIXI.Graphics();
  rect.beginFill(0xffffff);
  rect.drawRect(0, 100 * vh - rectHeight, 100 * vw, rectHeight);
  rect.alpha = 1;

  if (type && type.darken) Bubble.addChild(getDarkener());

  Bubble.addChild(rect);
  Bubble.addChild(textBox);
  Bubble.addChild(hlava);

  Bubble.eventMode = "static";
  Bubble.cursor = "pointer";
  Bubble.on("pointerdown", () => {
    if (type) {
      if (type.type == "input") {
        if (!hasInput) {
          bindInput(textBox, 50, checkInput);
        }
      }
    } else {
      Bubble.destroy();
    }
  });

  function checkInput(name) {
    if (type.text_auth(name)) return Bubble.destroy();
    else bindInput(textBox, 50, checkInput);
  }

  return Bubble;
}

async function bindInput(textBox, maxLength = 50, onenter) {
  let input_text = "";
  hasInput = true;
  textBox.text = input_text;
  window.addEventListener("keydown", handleKeydown);
  function handleKeydown(e) {
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
}

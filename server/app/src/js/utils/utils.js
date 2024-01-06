import { vw, vh, tlacitka_textury } from "../main.js";

export function getWidthHeight() {
  let width, height;
  if (window.innerWidth * (9 / 16) > window.innerHeight) {
    height = window.innerHeight;
    width = height * (16 / 9);
  } else {
    width = window.innerWidth;
    height = width * (9 / 16);
  }
  return [width, height];
}

export function getDarkener() {
  const dark = new PIXI.Graphics();
  dark.beginFill(0x000000);
  dark.drawRect(0, 0, 100 * vw, 100 * vh);
  dark.alpha = 0.3;
  return dark;
}

export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export function simpleText(x, y, fontSize, text) {
  const textBox = new PIXI.Text(text, {
    fontFamily: "Arial",
    fontSize: fontSize,
    fill: 0x000000,
    align: "center",
    wordWrap: false,
  });
  textBox.x = x * vw;
  textBox.y = y * vh;

  return textBox;
}

export function textButton(x, y, text, onClick, toggle = false, scale = 1) {
  const btn = new PIXI.Container();
  let on = false;
  const newSprite = new PIXI.Sprite(tlacitka_textury["btn_normalni"]);
  newSprite.scale.set((0.3 * Math.max(text.length, 6)) / 6, 0.3);

  const textBox = simpleText(20 / vh, 20 / vh, 100, text);
  textBox.eventMode = "passive";
  btn.addChild(newSprite);
  btn.addChild(textBox);

  newSprite.eventMode = "static";
  newSprite.cursor = "pointer";
  btn.x = x * vw - newSprite.width / 2;
  btn.y = y * vh - newSprite.height / 2;
  newSprite
    .on("pointerdown", () => {
      if (toggle) {
        on = !on;
        if (!on) {
          newSprite.texture = tlacitka_textury["btn_modre"];
          onClick(on);
        } else {
          newSprite.texture = tlacitka_textury["btn_cervene"];
          onClick(on);
        }
      } else {
        newSprite.texture = tlacitka_textury["btn_cervene"];
        onClick(on);
      }
    })
    .on("pointerenter", () => {
      if (!toggle || (toggle && !on)) {
        newSprite.texture = tlacitka_textury["btn_modre"];
      }
    })
    .on("pointerleave", () => {
      if (!toggle || (toggle && !on)) {
        newSprite.texture = tlacitka_textury["btn_normalni"];
      }
    });
  btn.scale.set(scale);
  return [
    btn,
    (state) => {
      if (toggle) {
        on = state;
        newSprite.texture =
          tlacitka_textury[on ? "btn_cervene" : "btn_normalni"];
      }
    },
  ];
}

export function getSlider(x, y, width, sprite, min, max, onUpdate) {
  const slider = new PIXI.Graphics()
    .beginFill(0x272d37)
    .drawRect(0, 0, width, 4);

  slider.x = x;
  slider.y = y;

  // Draw the handle
  const handle = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 8);

  handle.y = slider.height / 2;
  handle.x = 0;
  handle.eventMode = "static";
  handle.cursor = "pointer";

  handle
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd);

  slider.addChild(handle);

  function onDragStart() {
    sprite.addEventListener("pointermove", onDrag);
  }

  function onDragEnd(e) {
    sprite.removeEventListener("pointermove", onDrag);
  }

  function onDrag(e) {
    const halfHandleWidth = handle.width / 2;
    // Set handle y-position to match pointer, clamped to (4, screen.height - 4).

    handle.x = Math.max(
      halfHandleWidth - 8,
      Math.min(slider.toLocal(e.global).x, width - halfHandleWidth + 8)
    );
    // Normalize handle position between 0 and 1.
    const t = handle.x / width;

    onUpdate(clamp(t * (max - min) + min, min, max));
  }

  return slider;
}

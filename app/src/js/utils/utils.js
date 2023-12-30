import { vw, vh } from "../main.js";

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

export function getSlider(x, y, width, sprite, min, max, onUpdate) {
  const slider = new PIXI.Graphics()
    .beginFill(0x272d37)
    .drawRect(0, 0, width, 4);

  slider.x = x;
  slider.y = y;

  // Draw the handle
  const handle = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 8);

  handle.y = slider.height / 2;
  handle.x = width / 2;
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
      halfHandleWidth,
      Math.min(slider.toLocal(e.global).x, width - halfHandleWidth)
    );
    // Normalize handle position between 0 and 1.
    const t = handle.x / width;

    onUpdate(clamp(t * (max - min) + min, min, max));
  }

  return slider;
}

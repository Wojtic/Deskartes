const charsPerLine = 150;
const BORDER = 40;

function createBubble(head, text, type) {
  head = `./media/hlavy/${head}.png`;

  const Bubble = new PIXI.Container();

  const rectHeight = 2 * BORDER + 35 * Math.ceil(text.length / charsPerLine);
  const texture = PIXI.Texture.from(head);
  const hlava = new PIXI.Sprite(texture);
  console.log(hlava.width, hlava.height);
  const scale = (20 * vw) / hlava.width;
  hlava.width *= scale;
  hlava.height *= scale;
  hlava.x = BORDER / 2;
  hlava.y = 100 * vh - rectHeight - hlava.height;

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

  Bubble.addChild(rect);
  Bubble.addChild(textBox);
  Bubble.addChild(hlava);

  Bubble.eventMode = "static";
  Bubble.cursor = "pointer";
  Bubble.on("pointerdown", () => {
    Bubble.destroy();
  });

  return Bubble;
}

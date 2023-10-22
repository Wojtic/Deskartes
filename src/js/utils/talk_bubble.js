function createBubble(app, head, text, type) {
  //text =
  //"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Fusce suscipit libero eget elit. Proin pede metus, vulputate nec, fermentum fringilla, vehicula vitae, justo. Praesent vitae arcu tempor neque lacinia pretium. Quis autem vel eum iure reprehenderit";
  const text = new PIXI.Text("This is a PixiJS text", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xff1010,
    align: "center",
    width: 90 * vw,
  });
  let rect = new PIXI.Graphics();
  rect.beginFill(0xffffff);
  rect.drawRect(0, 0, 100 * vh, 100);
  rect.alpha = 1;
  app.stage.addChild(rect);
  app.stage.addChild(rect);
}

import { vw, vh, hlavy_textury, app } from "../main.js";

export const merge = {
  name: "Mergefruit",
  menu_items: [
    {
      texture: "merge",
      game: createMerge,
      online: false,
    },
  ],
};

export const mergeTest = (p) => {
  const canvasBox = document.getElementById("game");

  let fruitsdata = [
    { level: 0, size: 20 },
    { level: 1, size: 30 },
    { level: 2, size: 40 },
    { level: 3, size: 50 },
    { level: 4, size: 60 },
    { level: 5, size: 70 },
    { level: 6, size: 80 },
    { level: 7, size: 90 },
    { level: 8, size: 100 },
    { level: 9, size: 150 },
  ];

  // module aliases
  var Engine = Matter.Engine,
    //   Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Detector = Matter.Detector,
    Query = Matter.Query,
    Composite = Matter.Composite;
  var engine;
  let leftWall;
  let rightWall;

  var ground;
  let fruitinhand;
  let fruits = [];
  let score = 0;

  let handpos = [canvasBox.offsetWidth / 2, 70];

  let playing = true;

  p.preload = function () {
    fruitsdata[0].image = p.loadImage("./media/hlavy/matousek.png");
    fruitsdata[1].image = p.loadImage("./media/hlavy/hruba.png");
    fruitsdata[2].image = p.loadImage("./media/hlavy/filipik.png");
    fruitsdata[3].image = p.loadImage("./media/hlavy/korbeliusova.png");
    fruitsdata[4].image = p.loadImage("./media/hlavy/velensky.png");
    fruitsdata[5].image = p.loadImage("./media/hlavy/akolar.png");
    fruitsdata[6].image = p.loadImage("./media/hlavy/bustova.png");
    fruitsdata[7].image = p.loadImage("./media/hlavy/janisova.png");
    fruitsdata[8].image = p.loadImage("./media/hlavy/beckova.png");
    fruitsdata[9].image = p.loadImage("./media/hlavy/filipik.png");
  };

  p.setup = function () {
    p.createCanvas(50 * vh, 100 * vh);

    engine = Engine.create();

    // add ground
    ground = new Ground(p.width / 2, p.height, 60, engine.world);
    leftWall = Matter.Bodies.rectangle(0, p.height / 2, 10, p.height, {
      isStatic: true,
    });
    rightWall = Matter.Bodies.rectangle(p.width, p.height / 2, 10, p.height, {
      isStatic: true,
    });

    Composite.add(engine.world, [leftWall, rightWall]);

    assignfruitinhand();

    var runner = Runner.create();

    Runner.run(runner, engine);
  };

  p.draw = function () {
    p.clear();

    ground.display();

    movehand();
    p.ellipse(handpos[0], handpos[1], 10, 10);

    if (fruitinhand) {
      fruitinhand.display();
    }

    for (let index = 0; index < fruits.length; index++) {
      fruits[index].display();
    }

    if (fruits.length >= 2) {
      checkCollisions(fruits);
    }

    displayscore();

    if (findObjectWithLowestY(fruits) < 200) {
      drawDashedLine();
    }

    if (findObjectWithLowestY(fruits) < 150) {
      // gameover
      // disable controls
      // playing = false
      // show gae over message
    }
  };

  function movehand() {
    if (playing) {
      if (p.keyIsDown(p.LEFT_ARROW)) {
        handpos[0] -= 10;
      }

      if (p.keyIsDown(p.RIGHT_ARROW)) {
        handpos[0] += 10;
      }

      handpos[0] = p.constrain(handpos[0], 50, p.width - 50); // Adjust the 25 as needed
    }
  }

  p.keyPressed = function () {
    if (playing) {
      if (p.key === " ") {
        fruitinhand.isfixed = false;
        fruits.push(fruitinhand);
        assignfruitinhand();
      }
    }
  };

  function assignfruitinhand() {
    let rannum = p.floor(p.random(4));
    fruitinhand = new Fruit(engine.world, rannum);
  }

  function checkCollisions(circles) {
    const fruitsToRemove = [];
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const circleA = circles[i];
        const circleB = circles[j];

        if (
          circleA.level === circleB.level &&
          circleA.level < fruitsdata.length - 1 &&
          Query.collides(circleA.body, [circleB.body]).length > 0
        ) {
          let templevel = circleA.level;

          let tempx = circleA.body.position.x;
          let tempy = circleA.body.position.y;

          let tempx2 = circleB.body.position.x;
          let tempy2 = circleB.body.position.y;

          score += circleA.level * 10;

          fruitsToRemove.push(circleA, circleB);

          for (const fruit of fruitsToRemove) {
            const index = fruits.indexOf(fruit);
            if (index !== -1) {
              fruits.splice(index, 1);
              Matter.World.remove(engine.world, fruit.body);
            }
          }

          let newhigherlevelfruit = new Fruit(engine.world, templevel + 1);
          newhigherlevelfruit.isfixed = false;

          let middle = findMiddlePoint(tempx, tempy, tempx2, tempy2);

          Matter.Body.setPosition(newhigherlevelfruit.body, {
            x: middle.x,
            y: middle.y,
          });

          fruits.push(newhigherlevelfruit);
        }
      }
    }
  }

  function findMiddlePoint(x1, y1, x2, y2) {
    const middleX = (x1 + x2) / 2;
    const middleY = (y1 + y2) / 2;
    return { x: middleX, y: middleY };
  }

  function displayscore() {
    p.stroke("#765827");
    p.strokeWeight(4);

    p.textSize(40);
    p.fill("yellow");

    p.textAlign(p.LEFT, p.CENTER);
    p.text(score, 50, 70);
  }

  function drawDashedLine() {
    p.stroke("#D90631");
    p.strokeWeight(5);
    const y = 150; // Y-coordinate of the dashed line
    const dashLength = 20; // Length of each dash
    const gapLength = 20; // Length of each gap between dashes
    const lineLength = p.width; // Length of the entire line

    for (let x = 0; x < lineLength; x += dashLength + gapLength) {
      p.line(x, y, x + dashLength, y);
    }
  }

  function findObjectWithLowestY(fruits) {
    if (fruits.length === 0) {
      return null;
    }

    let lowestYObject = fruits[0];

    for (let i = 1; i < fruits.length; i++) {
      const currentObject = fruits[i];

      if (currentObject.body.position.y < lowestYObject.body.position.y) {
        lowestYObject = currentObject;
      }
    }

    return lowestYObject.body.position.y;
  }

  class Fruit {
    constructor(world, rannum) {
      this.level = fruitsdata[rannum].level;
      this.size = fruitsdata[rannum].size;

      this.isfixed = true;
      this.radus = this.size;
      this.x = handpos[0];
      this.y = handpos[1];
      this.body = Bodies.circle(this.x, this.y, this.radus);
      Composite.add(world, [this.body]);
    }

    display() {
      this.x = handpos[0];
      this.y = handpos[1];

      if (this.isfixed) {
        Matter.Body.setPosition(this.body, { x: this.x, y: this.y });
      }

      let pos = this.body.position;
      const angle = this.body.angle;
      const radius = this.body.circleRadius;

      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(angle);
      p.noStroke();
      p.image(
        fruitsdata[this.level].image,
        -radius,
        -radius,
        radius * 2,
        radius * 2
      );

      p.pop();
    }
  }

  class Ground {
    constructor(x, y, h, world) {
      this.x = x;
      this.y = y - h / 2;
      this.h = h;

      this.body = Bodies.rectangle(this.x, this.y, p.width, this.h, {
        isStatic: true,
      });
      Composite.add(world, [this.body]);
    }

    display() {
      const pos = this.body.position;
      const angle = this.body.angle;

      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(angle);
      p.rectMode(p.CENTER);
      p.fill("#765827");
      p.noStroke();
      p.rect(0, 0, p.width, this.h);
      p.pop();
    }
  }
};

export async function createMerge(online, onEnd) {
  const Game = new PIXI.Container();
  return "merge";
}

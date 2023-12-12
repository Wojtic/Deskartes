import { vw, vh, tictac_textury } from "../main.js";

let onTurn = true;
let isX = true;
let grid;
let X, Y;
let opaque;

let game = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export const tictac = {
  name: "Piškvorky",
  menu_items: [
    {
      texture: "tictac_three",
      game: createTicTacThree,
    },
    {
      texture: "tictac_infinity",
      game: createTicTacInfinity,
    },
  ],
};

function turn() {
  const getPos = (local) => {
    const temp = local / (grid.width / 2);
    if (temp < -1 / 3) return -1;
    if (temp > 1 / 3) return 1;
    return 0;
  };

  function beginTurn(e) {
    let pos = e.data.getLocalPosition(grid); // Nejake pocitani s maticemi, mozna se tomu vyhnout
    let coords = { x: getPos(pos["x"]), y: getPos(pos["y"]) };
    if (game[coords.y + 1][coords.x + 1] == 0) {
      opaque.alpha = 0.5;
      console.log(grid.width);
      opaque.x = coords.x * (744 / 3); // Musí se používat velikost před scale.set, je to na nic
      opaque.y = coords.y * (548 / 3);
      /*opaque.x = (coords.x * grid.width) / 3;
      opaque.y = (coords.y * grid.height) / 3;*/
    }
  }

  function endTurn(e) {
    grid.off("mousemove", beginTurn);
    onTurn = false;
  }

  async function click(e) {
    let pos = e.data.getLocalPosition(grid); // Nejake pocitani s maticemi, mozna se tomu vyhnout
    let coords = { x: getPos(pos["x"]), y: getPos(pos["y"]) };
    if (game[coords.y + 1][coords.x + 1] == 0) {
      const char = await getChar(isX ? "X" : "Y");
      char.x = (coords.x * grid.width) / 3;
      char.y = (coords.y * grid.height) / 3;
      grid.addChild(char);

      game[coords.y + 1][coords.x + 1] = isX ? 1 : -1;

      endTurn();
      grid.off("pointerdown", click);
    }
  }

  grid.on("mouseleave", (e) => {
    opaque.alpha = 0;
  });

  grid.on("mousemove", beginTurn);
  grid.on("pointerdown", click);
}

async function getChar(letter) {
  const char = new PIXI.Sprite(tictac_textury[letter]);
  char.scale.set((20 * vh) / char.height);
  char.anchor.set(0.5);
  return char;
}

export async function createTicTacThree(online) {
  const Game = new PIXI.Container();
  const white = new PIXI.Graphics();
  white.beginFill(0xffffff);
  white.drawRect(0, 0, 100 * vw, 100 * vh);
  white.alpha = 1;

  grid = new PIXI.Sprite(tictac_textury["three_grid"]);
  console.log(grid.width, grid.height);
  grid.scale.set((80 * vh) / grid.height);
  grid.anchor.set(0.5);
  grid.x = 50 * vw;
  grid.y = 50 * vh;
  grid.interactive = true;

  opaque = await getChar(isX ? "X" : "Y");
  opaque.alpha = 0; // ještě nastavit scale

  if (onTurn) turn();

  Game.addChild(white);
  grid.addChild(opaque);
  Game.addChild(grid);
  return Game;
}

export async function createTicTacInfinity(online) {
  const Game = new PIXI.Container();
  const white = new PIXI.Graphics();
  white.beginFill(0x222222);
  white.drawRect(0, 0, 100 * vw, 100 * vh);
  white.alpha = 1;

  console.log("nekonečné tady", online);
  Game.addChild(white);
  return Game;
}

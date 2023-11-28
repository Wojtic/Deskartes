import { lobby_textury, vw, vh } from "../main.js";
import { getDarkener } from "./utils.js";
import { tictac } from "../games/tictac.js";
import { slots } from "../games/slots.js";

function textureToSprite(name, x, y, scale_x, clickable = false) {
  const newSprite = new PIXI.Sprite(lobby_textury[name]);
  newSprite.scale.set((scale_x * vw) / newSprite.width);
  newSprite.anchor.set(0.5);
  newSprite.x = x * vw;
  newSprite.y = y * vh;

  if (clickable) {
    newSprite.eventMode = "static";
    newSprite.cursor = "pointer";
  }
  return newSprite;
}

export async function createLobby(onGameEntry) {
  const Lobby = new PIXI.Container();

  const background = textureToSprite("lobby", 50, 50, 100);

  const tbl_tictac = textureToSprite("tbl_tictac", 20, 60, 30, true);
  const tbl_roulette = textureToSprite("tbl_roulette", 60, 70, 30, true);
  const tbl_placeholder = textureToSprite("tbl_placeholder", 80, 30, 30, true);

  Lobby.addChild(background);
  Lobby.addChild(tbl_tictac);
  Lobby.addChild(tbl_roulette);
  Lobby.addChild(tbl_placeholder);

  tbl_tictac.on("pointerdown", () =>
    createGameMenu(Lobby, tictac, onGameEntry)
  );
  //tbl_roulette.on("pointerdown", () => createGameMenu(Lobby, "Ruleta"));
  tbl_placeholder.on("pointerdown", () =>
    createGameMenu(Lobby, slots, onGameEntry)
  );

  return Lobby;
}

let selectedGame;
let online = true;

async function createGameMenu(stage, game, onGameEntry) {
  selectedGame = game.menu_items[0].game;
  const Menu = new PIXI.Container();
  Menu.eventMode = "static";

  const screen = textureToSprite("game_menu", 50, 50, 60);

  const textBox = new PIXI.Text(game.name, {
    fontFamily: "Arial",
    fontSize: 50,
    fill: 0x000000,
    align: "center",
  });
  textBox.anchor.set(0.5);
  textBox.x = 55 * vw;
  textBox.y = 15 * vh;

  const darkener = getDarkener();
  darkener.eventMode = "static";
  darkener.on("pointerdown", () => Menu.destroy());
  Menu.addChild(darkener);
  Menu.addChild(screen);
  Menu.addChild(textBox); // Vyměnit všude za screen.addChild, ale rozbíjí to souřadnice TODO

  for (let i = 0; i < game.menu_items.length; i++) {
    const item = game.menu_items[i];
    const item_btn = textureToSprite(item.texture, 28.5, 23 + 15 * i, 10, true);
    Menu.addChild(item_btn);

    item_btn.on("pointerdown", () => {
      selectedGame = item.game;
    });
  }

  const online_btn = textureToSprite("online", 45, 25, 10, true);
  const computer_btn = textureToSprite("computer", 65, 25, 10, true);
  const play_btn = textureToSprite("play", 55, 35, 10, true);

  online_btn.on("pointerdown", () => {
    online = true;
  });
  computer_btn.on("pointerdown", () => {
    online = false;
  });
  play_btn.on("pointerdown", () => {
    if (selectedGame) onGameEntry(selectedGame, online);
  });

  Menu.addChild(online_btn);
  Menu.addChild(computer_btn);
  Menu.addChild(play_btn);
  stage.addChild(Menu);
  return Menu;
}

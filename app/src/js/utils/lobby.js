import { lobby_textury, vw, vh } from "../main.js";
import { getDarkener } from "./utils.js";

function textureToSprite(name, x, y, scale_x) {
  const table = new PIXI.Sprite(lobby_textury[name]);
  table.scale.set((scale_x * vw) / table.width);
  table.anchor.set(0.5);
  table.x = x * vw;
  table.y = y * vh;
  return table;
}
export async function createLobby() {
  const Lobby = new PIXI.Container();

  const background = textureToSprite("lobby", 50, 50, 100);

  const tbl_tictac = textureToSprite("tbl_tictac", 20, 60, 30);
  const tbl_roulette = textureToSprite("tbl_roulette", 60, 70, 30);
  const tbl_placeholder = textureToSprite("tbl_placeholder", 80, 30, 30);

  Lobby.addChild(background);
  Lobby.addChild(tbl_tictac);
  Lobby.addChild(tbl_roulette);
  Lobby.addChild(tbl_placeholder);

  tbl_tictac.eventMode = "static";
  tbl_tictac.cursor = "pointer";
  tbl_roulette.eventMode = "static";
  tbl_roulette.cursor = "pointer";
  tbl_placeholder.eventMode = "static";
  tbl_placeholder.cursor = "pointer";
  tbl_tictac.on("pointerdown", () => createGameMenu(Lobby, "Piškvorky"));
  tbl_roulette.on("pointerdown", () => createGameMenu(Lobby, "Ruleta"));
  tbl_placeholder.on("pointerdown", () => createGameMenu(Lobby, "Něco"));

  return Lobby;
}

async function createGameMenu(stage, game) {
  const Menu = new PIXI.Container();

  const screen = textureToSprite("game_menu", 50, 50, 60);

  Menu.addChild(getDarkener());
  Menu.addChild(screen);
  stage.addChild(Menu);
  return Menu;
}

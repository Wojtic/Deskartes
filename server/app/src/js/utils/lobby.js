import { lobby_textury, vw, vh, hrac, socket } from "../main.js";
import { getDarkener, getSlider, simpleText, textButton } from "./utils.js";
import { tictac } from "../games/tictac.js";
import { slots } from "../games/slots.js";
import { merge } from "../games/merge.js";
import { chess } from "../games/chess.js";

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

function table(x, y, scale_x, scale_y) {
  const newSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
  newSprite.alpha = 0;
  newSprite.scale.set(scale_x, scale_y);
  newSprite.x = x * vw;
  newSprite.y = y * vh;

  newSprite.eventMode = "static";
  newSprite.cursor = "pointer";
  return newSprite;
}

export async function createLobby(onGameEntry) {
  const Lobby = new PIXI.Container();

  const background = textureToSprite("lobby", 50, 50, 100);

  const tbl_tictac = table(30, 37, 20, 20);
  const tbl_chess = table(70, 10, 30, 15);
  const tbl_pool = table(65, 45, 40, 15);
  const tbl_merge = table(0, 15, 25, 15);
  const tbl_slots = table(35, 0, 30, 15);

  Lobby.addChild(background);
  Lobby.addChild(tbl_tictac);
  Lobby.addChild(tbl_chess);
  Lobby.addChild(tbl_pool);
  Lobby.addChild(tbl_merge);
  Lobby.addChild(tbl_slots);

  tbl_tictac.on("pointerdown", () =>
    createGameMenu(Lobby, tictac, onGameEntry)
  );
  tbl_chess.on("pointerdown", () => createGameMenu(Lobby, chess, onGameEntry));
  tbl_merge.on("pointerdown", () => createGameMenu(Lobby, merge, onGameEntry));
  tbl_slots.on("pointerdown", () => createGameMenu(Lobby, slots, onGameEntry));
  tbl_pool.on("pointerdown", () => createGameMenu(Lobby, merge, onGameEntry));

  return Lobby;
}

let selectedGame;
let online = true;
let sliderBet = 0;

async function createGameMenu(stage, game, onGameEntry) {
  selectedGame = game.menu_items[0].game;
  const Menu = new PIXI.Container();
  Menu.eventMode = "static";

  const screen = textureToSprite("game_menu", 50, 50, 60);
  const textBox = simpleText(55, 15, 50, game.name);
  textBox.anchor.set(0.5, 0.5);

  const darkener = getDarkener();
  darkener.eventMode = "static";
  darkener.on("pointerdown", destroyMenu);
  Menu.addChild(darkener);
  Menu.addChild(screen);
  Menu.addChild(textBox); // Vyměnit všude za screen.addChild, ale rozbíjí to souřadnice TODO

  let canBeOnline = false;
  for (let i = 0; i < game.menu_items.length; i++) {
    const item = game.menu_items[i];
    const item_btn = textureToSprite(item.texture, 28.5, 23 + 15 * i, 10, true);
    canBeOnline = game.menu_items[i].possibleOnline;
    Menu.addChild(item_btn);

    item_btn.on("pointerdown", () => {
      selectedGame = item.game;
    });
  }
  if (!canBeOnline) online = false;

  let computer_btn, set_computer;
  const [online_btn, set_online] = textButton(
    55,
    32,
    "Na síti",
    () => {
      online = true;
      set_computer(false);
    },
    true,
    0.3
  );
  [computer_btn, set_computer] = textButton(
    85,
    32,
    "Proti počítači",
    () => {
      online = false;
      set_online(false);
    },
    true,
    0.3
  );
  set_online(online);
  set_computer(!online);
  const play_btn = textButton(
    80,
    50,
    "Hrát!",
    () => {
      if (selectedGame) {
        if (!online) onGameEntry(selectedGame, online, sliderBet);
        else {
          socket.emit("create bet", game.id, sliderBet);
          updateBets();
        }
      }
    },
    false,
    0.3
  )[0];

  function destroyMenu() {
    socket.emit("closed menu", game.id);
    Menu.destroy();
  }

  socket.on("force game start", (sentGame, players, bet) => {
    if (sentGame != game.id) return;
    if (!players.includes(hrac.jmeno)) return;
    onGameEntry(selectedGame, true, bet);
  });

  // ----------------------------------------- Sazky
  const betTxt = simpleText(40, 30, 30, sliderBet);
  Menu.addChild(
    getSlider(40 * vw, 35 * vh, 35 * vw, Menu, 0, hrac.money, (val) => {
      sliderBet = Math.round(val);
      betTxt.text = sliderBet;
    })
  );
  Menu.addChild(betTxt);
  socket.on("bets updated", (changedGame) => {
    if (game.id == changedGame) updateBets();
  });

  let othersBets;
  function updateBets() {
    if (othersBets) othersBets.destroy();
    socket.emit("get bets", game.id, (bets) => {
      othersBets = new PIXI.Container();
      let count = 0;
      for (let i = 0; i < bets.length; i++) {
        let bet = bets[i];
        let own = bet.players.length == 1 && bet.players[0] == hrac.jmeno;
        count++;
        const valTxt = simpleText(40, 40 + 10 * count, 30, bet.value);
        const playersTxt = simpleText(
          50,
          40 + 10 * count,
          30,
          bet.players.join(", ")
        );
        const bet_btn = textButton(
          80,
          50 + 10 * count,
          "Vsadit!",
          () => {
            socket.emit("start game", game.id, i);
          },
          false,
          0.2
        )[0];
        othersBets.addChild(valTxt);
        othersBets.addChild(playersTxt);
        if (bet.value <= hrac.money && !own) othersBets.addChild(bet_btn);
        Menu.addChild(othersBets);
      }
    });
  }
  updateBets();

  // ----------------------------------------

  if (canBeOnline) {
    Menu.addChild(online_btn);
    Menu.addChild(computer_btn);
  }
  Menu.addChild(play_btn);
  stage.addChild(Menu);
  return Menu;
}

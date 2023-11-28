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
export async function createTicTacThree(online) {
  console.log("tady", online);
}

export async function createTicTacInfinity(online) {
  console.log("nekonečné tady", online);
}

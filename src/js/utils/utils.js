let vw, vh;

function getWidthHeight() {
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

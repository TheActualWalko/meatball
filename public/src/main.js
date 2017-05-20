import View from "./view/view";
import Cursor from "./view/cursor";
import Grid from "./view/grid";
import Walls from "./view/walls";

const mainView = new View(document.body, window.innerWidth, window.innerHeight);
const grid   = new Grid(mainView.scene, 32, 32);
const cursor = new Cursor(grid);
const walls  = new Walls(grid);

mainView.run();

window.addEventListener("resize", ()=>{
  mainView.setDimensions(window.innerWidth, window.innerHeight);
});

let mouseIsDown = false;
let isAdding = false;

window.addEventListener(
  "mousemove",
  evt => {
    const pos = grid.getMousePosition(evt, mainView.camera);
    cursor.update(pos);
    if (mouseIsDown && grid.isOnGrid(pos)) {
      isAdding ? walls.add(pos) : walls.remove(pos);
    }
  }
);

window.addEventListener(
  "mousedown", 
  evt => {
    mouseIsDown = true;
    const pos = grid.getMousePosition(evt, mainView.camera);
    isAdding = !walls.get(pos);
    isAdding ? walls.add(pos) : walls.remove(pos);
  }
);

window.addEventListener(
  "mouseup", 
  evt => {
    mouseIsDown = false;
  }
);
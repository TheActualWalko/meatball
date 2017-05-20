import View from "./view/view";
import Cursor from "./view/cursor";
import Grid from "./view/grid";
import Floor from "./view/floor";

const mainView = new View(document.body, window.innerWidth, window.innerHeight);
const grid   = new Grid(mainView.scene, 32, 32);
const cursor = new Cursor(grid);
const floor  = new Floor(grid);

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
      isAdding ? floor.add(pos) : floor.remove(pos);
    }
  }
);

window.addEventListener(
  "mousedown", 
  evt => {
    const pos = grid.getMousePosition(evt, mainView.camera);
    if (grid.isOnGrid(pos)) {
      mouseIsDown = true;
      isAdding = !floor.get(pos);
      isAdding ? floor.add(pos) : floor.remove(pos);
    }
  }
);

window.addEventListener(
  "mouseup", 
  evt => {
    mouseIsDown = false;
  }
);
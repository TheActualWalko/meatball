import View from "./view/view";
import Cursor from "./view/cursor";
import Grid from "./view/grid";
import Floor from "./view/floor";
import * as THREE from "three";

const mainView = new View(document.body, window.innerWidth, window.innerHeight);
const grid   = new Grid(mainView.scene, 64, 64);
const cursor = new Cursor(grid);
const floor  = new Floor(grid);

mainView.run();

window.addEventListener("resize", ()=>{
  mainView.setDimensions(window.innerWidth, window.innerHeight);
});

const readout = document.getElementById("readout");

let mouseIsDown = false;
let isAdding = false;
let lastSelection = {
  start: {x: null, z: null},
  end:   {x: null, z: null}
};
let selection = {
  start: {x: null, z: null},
  end:   {x: null, z: null}
};
let selectionMesh;
let mouseMoved = false;

const addSelectionMaterial = new THREE.MeshBasicMaterial({color: "#5186fc", transparent: true, opacity: 0.8});
const removeSelectionMaterial = new THREE.MeshBasicMaterial({color: "#fc5186", transparent: true, opacity: 0.8});

const updateSelection = ()=>{
  if (
    lastSelection.end.x === selection.end.x && lastSelection.end.z === selection.end.z
    &&
    lastSelection.start.x === selection.start.x && lastSelection.start.z === selection.start.z
  ) {
    return;
  }
  if (selectionMesh) {
    mainView.scene.remove(selectionMesh);
  }
  if (selection.start.x === null || selection.start.z === null || selection.end.x === null || selection.end.z === null) {
    readout.innerHTML = "";
    return;
  }
  mouseMoved = true;
  const w = Math.abs(selection.start.x - selection.end.x);
  const d = Math.abs(selection.start.z - selection.end.z);
  const geometry = new THREE.PlaneGeometry(w+1,d+1,1)
  if (isAdding) {
    selectionMesh = new THREE.Mesh(geometry, addSelectionMaterial);
  } else {
    selectionMesh = new THREE.Mesh(geometry, removeSelectionMaterial);
  }
  selectionMesh.position.x = Math.min(selection.start.x,selection.end.x) + (w/2);
  selectionMesh.position.z = Math.min(selection.start.z,selection.end.z) + (d/2);
  selectionMesh.position.y = 0.03
  selectionMesh.rotation.x = -Math.PI/2
  mainView.scene.add(selectionMesh);
  lastSelection.end = Object.assign({}, selection.end);
  lastSelection.start = Object.assign({}, selection.start);
  readout.innerHTML = `${w+1}' × ${d+1}'`;
}

let lastRoundedPos;

mainView.element.addEventListener(
  "mousemove",
  evt => {
    const roundedPos = grid.getRoundedMousePosition(evt, mainView.camera);
    lastRoundedPos = roundedPos;
    if (cursor.tool === "FLOOR") {
      cursor.update(roundedPos);
      if (mouseIsDown && grid.isOnGrid(roundedPos)) {
        selection.end = roundedPos;
        updateSelection();
      }
    } else if (cursor.tool === "FURNITURE") {
      const pos = grid.getMousePosition(evt, mainView.camera);
      cursor.update(pos);
    }
  }
);

mainView.element.addEventListener(
  "mousedown", 
  evt => {
    if (mouseIsDown) {
      return;
    }
    if (cursor.tool === "FLOOR") {
      const pos = grid.getRoundedMousePosition(evt, mainView.camera);
      if (grid.isOnGrid(pos)) {
        mouseIsDown = true;
        isAdding = !floor.get(pos);
        selection.start = pos;
      }
    }
  }
);

window.addEventListener(
  "mouseup", 
  evt => {
    if (mouseIsDown) {
      if (cursor.tool === "FLOOR") {
        if (mouseMoved) {
          for (let x = Math.min(selection.start.x, selection.end.x); x <= Math.max(selection.start.x, selection.end.x); x ++) {
            for (let z = Math.min(selection.start.z, selection.end.z); z <= Math.max(selection.start.z, selection.end.z); z ++) {
              if (isAdding) {
                floor.add({x,z});
              } else {
                floor.remove({x,z});
              }
            } 
          }
        } else {
          floor.toggle(grid.getRoundedMousePosition(evt, mainView.camera))
        }
        selection = {
          start: {x: null, z: null},
          end:   {x: null, z: null}
        };
        updateSelection();
      }
      mouseIsDown = false;
      mouseMoved = false;
    }
  }
);

window.addEventListener("keydown", evt => {
  if (evt.which === 32) {
    cursor.swapTool();
    if (lastRoundedPos) {
      cursor.update(lastRoundedPos);
    }
  }
});
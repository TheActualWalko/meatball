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

window.addEventListener(
  "mousemove",
  evt => {
    const pos = grid.getMousePosition(evt, mainView.camera);
    cursor.update(pos);
    if (mouseIsDown && grid.isOnGrid(pos)) {
      //isAdding ? floor.add(pos) : floor.remove(pos);
      selection.end = pos;
      updateSelection();
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
      //isAdding ? floor.add(pos) : floor.remove(pos);
      selection.start = pos;
    }
  }
);

window.addEventListener(
  "mouseup", 
  evt => {
    mouseIsDown = false;
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
      floor.toggle(grid.getMousePosition(evt, mainView.camera))
    }
    selection = {
      start: {x: null, z: null},
      end:   {x: null, z: null}
    };
    updateSelection();
    mouseMoved = false;
  }
);
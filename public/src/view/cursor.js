import * as THREE from "three";
import whiteGradient from "./white-gradient";

class Cursor {
  constructor(grid) {
    this.grid = grid;
    
    this.floorCursorMaterial = new THREE.MeshBasicMaterial({ map: whiteGradient, transparent: true });
    this.floorCursorGeometry = new THREE.BoxGeometry(1, 8, 1, 1);

    this.furnitureCursorMaterial = new THREE.MeshBasicMaterial({ color: "#FFFFFF", transparent: true });
    this.furnitureCursorGeometry = new THREE.BoxGeometry(1, 1, 1, 1);

    this.floorCursorGeometry.faceVertexUvs[0][4] = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];
    this.floorCursorGeometry.faceVertexUvs[0][5] = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];

    this.furnitureDims = {x: 0, y: 0, z: 0};

    this.setTool("FLOOR");
    this.flashCursor();
  }
  flashCursor() {
    requestAnimationFrame(()=>this.flashCursor());
    const flashMagnitude = ((1+Math.sin(Date.now() / 400))/2);
    this.cursor.material.opacity = (flashMagnitude/3)+(2/3);
  }
  swapTool() {
    this.setTool(this.tool === "FLOOR" ? "FURNITURE" : "FLOOR");
  }
  setTool(tool) {
    this.tool = tool;
    const {x,z} = this.cursor ? this.cursor.position : {x:0,z:0};
    this.grid.scene.remove(this.cursor);
    if (tool === "FLOOR") {
      this.cursor = new THREE.Mesh(this.floorCursorGeometry, this.floorCursorMaterial);
      this.cursor.position.y = 4;
      this.cursor.scale.x = 1;
      this.cursor.scale.y = 1;
      this.cursor.scale.z = 1;
    } else if (tool === "FURNITURE") {
      this.cursor = new THREE.Mesh(this.furnitureCursorGeometry, this.furnitureCursorMaterial);
      this.cursor.position.y = 0;
      this.updateFurnitureSize(this.furnitureDims);
    }
    this.grid.scene.add(this.cursor);
    this.update({x,z});
  }
  updateFurnitureSize(dimensions) {
    this.furnitureDims = dimensions;
    ["x", "y", "z"].forEach(d => this.cursor.scale[d] = this.furnitureDims[d] || 0.0001);
    this.cursor.position.y = this.furnitureDims.y / 2;
  }
  update(cursorPosition) {
    if (this.grid.isOnGrid(cursorPosition)) {
      this.cursor.position.x = cursorPosition.x;
      this.cursor.position.z = cursorPosition.z;
    } else {
      this.cursor.position.x = -Infinity;
      this.cursor.position.z = -Infinity;
    }
  }
}

export default Cursor;

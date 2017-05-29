import * as THREE from "three";
import whiteGradient from "./white-gradient";

class Cursor {
  constructor(grid) {
    this.grid = grid;
    
    this.floorCursorMaterial = new THREE.MeshBasicMaterial({ map: whiteGradient, transparent: true });
    this.floorCursorGeometry = new THREE.BoxGeometry(1.2, 8, 1.2, 1);

    this.furnitureCursorMaterial = new THREE.MeshBasicMaterial({ color: "#FFFFFF", transparent: true });
    this.furnitureCursorGeometry = new THREE.BoxGeometry(1, 1, 1, 1);

    this.floorCursorGeometry.faceVertexUvs[0][4] = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];
    this.floorCursorGeometry.faceVertexUvs[0][5] = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];
    
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
    } else if (tool === "FURNITURE") {
      this.cursor = new THREE.Mesh(this.furnitureCursorGeometry, this.furnitureCursorMaterial);
      this.cursor.position.y = 0;
    }
    this.grid.scene.add(this.cursor);
    this.update({x,z});
  }
  update(cursorPosition) {
    if (this.grid.isOnGrid(cursorPosition)) {
      this.cursor.position.x = cursorPosition.x;
      this.cursor.position.z = cursorPosition.z;
    } else {
      this.grid.scene.remove(this.cursor);
    }
  }
}

export default Cursor;

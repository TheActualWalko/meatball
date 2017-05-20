import * as THREE from "three";
import whiteGradient from "./white-gradient";

class Cursor {
  constructor(grid) {
    this.grid = grid;
    
    this.cursorMaterial = new THREE.MeshBasicMaterial({ map: whiteGradient, transparent: true });
    this.cursorGeometry = new THREE.BoxGeometry(1.2, 8, 1.2, 1);
    
    this.cursorGeometry.faceVertexUvs[0][4] = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];
    this.cursorGeometry.faceVertexUvs[0][5] = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];
    
    this.cursor = new THREE.Mesh(this.cursorGeometry, this.cursorMaterial);
    this.cursor.position.y = 4;
    
    this.flashCursor();
  }
  flashCursor() {
    requestAnimationFrame(()=>this.flashCursor());
    const flashMagnitude = ((1+Math.sin(Date.now() / 400))/2);
    this.cursorMaterial.opacity = (flashMagnitude/3)+(2/3);
  }
  update(cursorPosition) {
    this.grid.scene.remove(this.cursor);
    if (this.grid.isOnGrid(cursorPosition)) {
      this.grid.scene.add(this.cursor);
      this.cursor.position.x = cursorPosition.x;
      this.cursor.position.z = cursorPosition.z;
    }
  }
}

export default Cursor;

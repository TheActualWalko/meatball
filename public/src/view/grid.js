import * as THREE from "three";


const size = 512;

// create canvas
const canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;

// get context
const context = canvas.getContext('2d');

// draw gradient
context.rect(0, 0, size, size);
const gradient = context.createLinearGradient(0, size, 0, 0);
gradient.addColorStop(0, '#ffffff');
gradient.addColorStop(1, 'transparent');
context.fillStyle = gradient;
context.fill();

const texture = new THREE.Texture(canvas);
texture.needsUpdate = true;

class Grid {
  constructor(scene, width, depth) {
    this.scene = scene;
    this.width = width;
    this.depth = depth;
    
    this.plusMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    this.cursorMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    this.cursorGeometry = new THREE.BoxGeometry(0.9, 8, 0.9, 1);
    
    this.cursorGeometry.faceVertexUvs[0][4] = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];
    this.cursorGeometry.faceVertexUvs[0][5] = [new THREE.Vector2(1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,1)];
    
    this.cursor = new THREE.Mesh(this.cursorGeometry, this.cursorMaterial);
    this.cursor.position.y = 4;
    for (let x = 0; x < width; x ++) {
      for (let z = 0; z < depth; z ++) {
        this.getPlusLines(x,0,z,0.2).forEach(line => scene.add(line));
      }
    }
    
    this.flashCursor();
  }
  flashCursor() {
    requestAnimationFrame(()=>this.flashCursor());
    const flashMagnitude = ((1+Math.sin(Date.now() / 400))/2);
    this.cursorMaterial.opacity = (flashMagnitude/3)+(2/3);
  }
  makeLine([x1,y1,z1], [x2,y2,z2]) {
    const g = new THREE.Geometry();
    g.vertices.push(
      new THREE.Vector3(x1,y1,z1),
      new THREE.Vector3(x2,y2,z2)
    );
    return new THREE.Line(g, this.plusMaterial);
  }
  getPlusLines(x,y,z,s) {
    return [
      [[x,y,z-(s/2)], [x,y,z+(s/2)]],
      [[x-(s/2),y,z], [x+(s/2),y,z]]
    ].map(([v1, v2])=>this.makeLine(v1,v2));
  }
  updateCursor(evt, camera) {
    const cursorPosition = this.getMousePosition(evt, camera);
    this.scene.remove(this.cursor);
    if (this.isOnGrid(cursorPosition)) {
      this.scene.add(this.cursor);
      this.cursor.position.x = cursorPosition.x;
      this.cursor.position.z = cursorPosition.z;
    }
  }
  getMousePosition(evt, camera) {
    const vector = new THREE.Vector3();
    vector.set(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5 );
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = - camera.position.y / dir.y;
    return this.round2dCoords(camera.position.clone().add(dir.multiplyScalar(distance)));
  }
  round2dCoords({x, z}) {
    return {
      x: Math.round(x),
      z: Math.round(z)
    }
  }
  isOnGrid({x, z}) {
    return x >= 0 && x < this.width && z >= 0 && z < this.depth;
  }
}

export default Grid;

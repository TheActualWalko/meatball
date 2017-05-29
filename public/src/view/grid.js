import * as THREE from "three";

class Grid {
  constructor(scene, width, depth) {
    this.scene = scene;
    this.width = width;
    this.depth = depth;
    
    this.plusMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    for (let x = 0; x < width; x ++) {
      for (let z = 0; z < depth; z ++) {
        this.getPlusLines(x,0,z,0.2).forEach(line => scene.add(line));
      }
    }
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
  getRoundedMousePosition(evt, camera) {
    return this.round2dCoords(this.getMousePosition(evt, camera));
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
    return camera.position.clone().add(dir.multiplyScalar(distance));
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

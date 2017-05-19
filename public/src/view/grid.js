import * as THREE from "three";

class Grid {
  constructor(scene) {
    this.scene = scene;
    this.material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    this.lines = [];
  }
  makeLine([x1,y1,z1], [x2,y2,z2]) {
    const g = new THREE.Geometry();
    g.vertices.push(
      new THREE.Vector3(x1,y1,z1),
      new THREE.Vector3(x2,y2,z2)
    );
    return new THREE.Line(g, this.material);
  }
  makePlus(x,y,z,s) {
    return [
      [[x,y,z-(s/2)], [x,y,z+(s/2)]],
      [[x,y-(s/2),z], [x,y+(s/2),z]],
      [[x-(s/2),y,z], [x+(s/2),y,z]]
    ].map(([v1, v2])=>makeLine(v1,v2));
  }
  removeAll() {
    this.lines.forEach(line => this.scene.remove(line));
  }
  addAll() {
    this.lines.forEach(line => this.scene.add(line));
  }
  draw(state) {
    this.removeAll();
    for (let x = 0; x < state.getIn(["grid", "width"]); x ++) {
      for (let z = 0; z < state.getIn(["grid", "height"]); z ++) {
        this.lines = [...this.lines, this.makePlus(x,0,z,0.2)];
      }
    }
    this.addAll();
  }
}

export default Grid;

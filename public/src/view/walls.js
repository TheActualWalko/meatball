import * as THREE from "three";

const wallGeometry = new THREE.BoxGeometry(1, 2, 1, 1);
const wallMaterial = new THREE.MeshToonMaterial({
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 0.5
});

class Walls {
  constructor(grid) {
    this.grid = grid;
    this.contents = {};
  }
  add({x,z}) {
    if (!this.get({x,z})) {
      const mesh = new THREE.Mesh(wallGeometry, wallMaterial);
      this.contents[this.serialize({x,z})] = mesh;
      mesh.position.x = x;
      mesh.position.z = z;
      mesh.position.y = 1;
      this.grid.scene.add(mesh);
    }
  }
  remove({x,z}) {
    if (this.get({x,z})) {
      this.grid.scene.remove(this.contents[this.serialize({x,z})]);
      delete this.contents[this.serialize({x,z})];
    }
  }
  toggle({x,z}) {
    if (this.get({x,z})) {
      this.remove({x,z});
    } else {
      this.add({x,z});
    }
  }
  get({x,z}) {
    return this.contents[this.serialize({x,z})];
  }
  serialize({x,z}) {
    return `${x},${z}`;
  }
}

export default Walls;

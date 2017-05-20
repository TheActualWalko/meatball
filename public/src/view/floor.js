import * as THREE from "three";
import whiteToBlackGradient from "./blue-to-black-gradient";
const floorGeometry = new THREE.BoxGeometry(1, 20, 1, 1);
const floorMaterial = new THREE.MeshBasicMaterial({ map: whiteToBlackGradient });
floorGeometry.faceVertexUvs[0][6] = [new THREE.Vector2(0.1,0.1), new THREE.Vector2(0.1,0.1), new THREE.Vector2(0.1,0.1)];
floorGeometry.faceVertexUvs[0][7] = [new THREE.Vector2(0.1,0.1), new THREE.Vector2(0.1,0.1), new THREE.Vector2(0.1,0.1)];


class Floor {
  constructor(grid) {
    this.grid = grid;
    this.contents = {};
  }
  add({x,z}) {
    if (!this.get({x,z})) {
      const mesh = new THREE.Mesh(floorGeometry, floorMaterial);
      this.contents[this.serialize({x,z})] = mesh;
      mesh.position.x = x;
      mesh.position.z = z;
      mesh.position.y = -9.98;
      mesh.rotation.x = Math.PI;
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

export default Floor;

import * as THREE from "three";

class Renderer {
  constructor(parentElement, width, height) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

    this.camera.position.y = 18;
    this.camera.position.z = 27;
    this.camera.position.x = 16;
    this.camera.rotation.x = -1.2;

    this.driver = new THREE.WebGLRenderer({ antialias: true });
    this.driver.setSize(width, height);
    parentElement.appendChild(this.driver.domElement);
  }
  setDimensions(width, height) {
    this.camera.aspect = width/height;
    this.camera.updateProjectionMatrix();
    this.driver.setSize(width, height);
  }
  run() {
    requestAnimationFrame(this.run.bind(this));
    this.driver.render(this.scene, this.camera);
  }
}

export default Renderer;

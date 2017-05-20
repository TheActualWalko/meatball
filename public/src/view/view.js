import * as THREE from "three";

class View {
  constructor(parentElement, width, height) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

    this.camera.position.y = 18;
    this.camera.position.z = 40;
    this.camera.position.x = 16;
    this.camera.rotation.x = -0.7;

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

export default View;

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

export default texture;
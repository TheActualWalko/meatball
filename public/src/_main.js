import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );

const makeLine = ([x1,y1,z1], [x2,y2,z2], material)=>{
  const g = new THREE.Geometry();
  g.vertices.push(
    new THREE.Vector3(x1,y1,z1),
    new THREE.Vector3(x2,y2,z2)
  );
  return new THREE.Line(g, material);
};

const makeGridPlus = (x,y,z,s,m)=>{
  const lineVerts = [
    [[x,y,z-(s/2)], [x,y,z+(s/2)]],
    //[[x,y-(s/2),z], [x,y+(s/2),z]],
    [[x-(s/2),y,z], [x+(s/2),y,z]]
  ];
  lineVerts.forEach(([v1, v2])=>scene.add(makeLine(v1,v2,m)));
};

for (let x = gridBounds[0]; x < gridBounds[1]; x += gridSize) {
  for (let z = gridBounds[0]; z < gridBounds[1]; z += gridSize) {
    makeGridPlus(x,0,z,0.2,lineMaterial);
  }
}

const gridSize = 1;
const gridBounds = [-16,16];


camera.position.y = 18;
camera.position.z = 11;
camera.rotation.x = -1.2;

const mousePlaneGeometry = new THREE.PlaneGeometry( gridSize-0.1, gridSize-0.1, 1 );
const mousePlaneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true} );
const mousePlane = new THREE.Mesh( mousePlaneGeometry, mousePlaneMaterial );
mousePlane.rotation.x = Math.PI/2;
mousePlane.position.x = Infinity;
scene.add( mousePlane );

const floorPlaneGeometry = new THREE.PlaneGeometry( gridBounds[1]-gridBounds[0]-1, gridBounds[1]-gridBounds[0]-1, 1 );
const floorPlaneMaterial = new THREE.MeshBasicMaterial( {color: 0x333333, side: THREE.DoubleSide, transparent: true} );
const floorPlane = new THREE.Mesh( floorPlaneGeometry, floorPlaneMaterial );
floorPlane.rotation.x = Math.PI/2;
floorPlane.position.y = -0.05
floorPlane.position.z = gridSize/-2;
floorPlane.position.x = gridSize/-2;
scene.add( floorPlane );




const makeLight = (x, z) => {
  const dirLight = new THREE.PointLight(0xffffff, 1);
  dirLight.position.set(x, 5, z);
  scene.add(dirLight);
}

makeLight(-2.5, -2.5);
makeLight(2.5, -2.5);
makeLight(2.5, 2.5);
makeLight(-2.5, 2.5);

const walls = [];

const wallAt = (inX, inZ)=>walls.find(({x,z})=>x === inX && z === inZ);

const addWall = (inX,inZ)=>{
  if (wallAt(inX, inZ)) {
    return;
  }
  const wallGeometry = new THREE.BoxGeometry( gridSize, 2, gridSize, 1 );
  const wallMaterial = new THREE.MeshPhongMaterial({
    color: 0x555555,
    specular: 0xffffff,
    shininess: 0.5,
    transparent: true,
    opacity: 1
  });
  const wall = new THREE.Mesh( wallGeometry, wallMaterial );
  wall.position.x = inX;
  wall.position.z = inZ;
  wall.position.y = 1;
  scene.add(wall);
  walls.push({
    x: inX,
    z: inZ,
    mesh: wall,
    material: wallMaterial
  });
}

const removeWall = (inX, inZ)=>{
  const wall = wallAt(inX, inZ);
  if (!wall) {
    return;
  }
  scene.remove(wall.mesh);
  walls.splice(walls.indexOf(wall), 1);
}

const fadeWall = (inX, inZ)=>{
  const wall = wallAt(inX, inZ);
  if (!wall) {
    return;
  }
  wall.material.opacity = 0.5;
}

const fadeAllWalls = ()=>{
  walls.forEach(x=>x.material.opacity=0.5);
}

const unfadeAllWalls = ()=>{
  walls.forEach(x=>x.material.opacity=1);
}

const getMousePosition = (evt)=>{
  const vector = new THREE.Vector3();
  vector.set(
      ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
      0.5 );
  vector.unproject( camera );
  const dir = vector.sub( camera.position ).normalize();
  const distance = - camera.position.y / dir.y;
  return camera.position.clone().add( dir.multiplyScalar( distance ) );
}

const getRoundedMousePosition = (evt)=>{
  const mouseVec = getMousePosition(evt);
  return {
    x: (Math.round((mouseVec.x-(gridSize/2))/gridSize)*gridSize) + (gridSize/2),
    z: (Math.round((mouseVec.z-(gridSize/2))/gridSize)*gridSize) + (gridSize/2)
  }
}

window.addEventListener("mousemove", (evt)=>{
  const {x, z} = getRoundedMousePosition(evt);
  unfadeAllWalls();
  if (
    x > gridBounds[0] && x < (gridBounds[1]-gridSize)
    &&
    z > gridBounds[0] && z < (gridBounds[1]-gridSize)
  ) {
    if (isClicked) {
      if (!currentClickDirection) {
        if (x === currentClickStartX && z === currentClickStartZ) {
          // noop
        } else if (x !== currentClickStartX) {
          currentClickDirection = "x";
        } else if (z !== currentClickStartZ) {
          currentClickDirection = "z";
        }
      }
      const maybeLockedX = currentClickDirection === "x" ? x : currentClickStartX;
      const maybeLockedZ = currentClickDirection === "z" ? z : currentClickStartZ;
      mousePlane.position.x = maybeLockedX;
      mousePlane.position.z = maybeLockedZ;
      if (currentClickDirection === "x") {
        for (let i = Math.min(x, currentClickStartX); i <= Math.max(x, currentClickStartX); i ++){
          isAdding ? addWall(i, maybeLockedZ) : removeWall(i, maybeLockedZ);
        }
      } else if (currentClickDirection === "z") {
        for (let i = Math.min(z, currentClickStartZ); i <= Math.max(z, currentClickStartZ); i ++){
          isAdding ? addWall(maybeLockedX, i) : removeWall(maybeLockedX, i);
        }
      }
      fadeAllWalls();
    } else {
      mousePlane.position.x = x;
      mousePlane.position.z = z;
      fadeWall(x, z);
    }
  } else {
    mousePlane.position.x = Infinity;
  }
});

let currentClickDirection = null;
let currentClickStartX = 0;
let currentClickStartZ = 0;
let isClicked = false;
let isAdding = true;


window.addEventListener("mousedown", (evt)=>{
  const {x, z} = getRoundedMousePosition(evt);
  if(wallAt(x,z)) {
    isAdding = false;
    removeWall(x, z);
  }else{
    isAdding = true;
    addWall(x, z);
  }
  fadeAllWalls();
  isClicked = true;
  currentClickStartX = x;
  currentClickStartZ = z;
});
window.addEventListener("mouseup", (evt)=>{
  unfadeAllWalls();
  isClicked = false
  currentClickDirection = null;
});

function render() {
  requestAnimationFrame( render );
  const bounce = Math.sin((new Date().getTime())/250);
  //mousePlane.position.y = bounce / 8;
  mousePlaneMaterial.opacity = 0.75+(bounce/4);
  renderer.render( scene, camera );
}

render();

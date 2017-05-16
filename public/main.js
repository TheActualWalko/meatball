var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );

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

const gridSize = 2;
const gridBounds = [-10,10];


camera.position.y = 10;
camera.position.z = 13;
camera.rotation.x = -.7;

const planeGeometry = new THREE.PlaneGeometry( gridSize-0.1, gridSize-0.1, 1 );
var mousePlaneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true} );
var mousePlane = new THREE.Mesh( planeGeometry, mousePlaneMaterial );
mousePlane.rotation.x = Math.PI/2;
mousePlane.position.x = Infinity;
scene.add( mousePlane );

for (let x = gridBounds[0]; x < gridBounds[1]; x += gridSize) {
  for (let z = gridBounds[0]; z < gridBounds[1]; z += gridSize) {
    makeGridPlus(x,0,z,0.3,lineMaterial);
  }
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

function render() {
  requestAnimationFrame( render );
  const bounce = Math.sin((new Date().getTime())/250);
  //mousePlane.position.y = bounce / 8;
  mousePlaneMaterial.opacity = 0.75+(bounce/4);
  renderer.render( scene, camera );
}

window.addEventListener("mousemove", (evt)=>{
  const mouseVec = getMousePosition(evt);
  if (
    mouseVec.x > gridBounds[0] && mouseVec.x < (gridBounds[1]-gridSize)
    && 
    mouseVec.z > gridBounds[0] && mouseVec.z < (gridBounds[1]-gridSize)
  ) {
    mousePlane.position.x = (Math.round((mouseVec.x-(gridSize/2))/gridSize)*gridSize)+(gridSize/2);
    mousePlane.position.z = (Math.round((mouseVec.z-(gridSize/2))/gridSize)*gridSize)+(gridSize/2);
  } else {
    mousePlane.position.x = Infinity;
  }
});

render();
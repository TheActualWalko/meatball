const FEET_PER_METRE = 3.28084;

const transformMetricStr = (str)=>{
  if (!str) {
    return 0;
  }
  if (str.includes("mm")) {
    return Number(str.replace("mm", "").trim()) / 1000;
  } else if (str.includes("cm")) {
    return Number(str.replace("cm", "").trim()) / 100;
  } else if (str.includes("m")) {
    return Number(str.replace("m", "").trim());
  }
};

const isFlatVerticalType = (type)=>{
  return type.toLowerCase().includes("curtain");
}

// reads and converts from metric right now
const getImperialDims = (thing)=>{
  const {metric, type, xyz} = thing;
  let output;
  if (xyz) {
    output = xyz;
  } else if (isFlatVerticalType(type)) {
    output = {
      x: transformMetricStr(metric.w) * FEET_PER_METRE,
      y: transformMetricStr(metric.d || metric.l) * FEET_PER_METRE,
    }
  } else {
    output = {
      x: transformMetricStr(metric.w) * FEET_PER_METRE,
      y: transformMetricStr(metric.h) * FEET_PER_METRE,
      z: transformMetricStr(metric.d || metric.l) * FEET_PER_METRE,
    }
  }
  thing.xyz = output;
  return output;
}

const strPrice = (price) => {
  return "$"+price.toFixed(2);
}

const updateReadout = (thing)=>{
  const {metric, name, url, type, price, images} = thing;
  document.getElementById("name").innerHTML="<a href='http://www.ikea.com"+url+"' target='_blank'>"+name+"</a>";
  document.getElementById("type").innerHTML=type;
  document.getElementById("price").innerHTML=strPrice(price);
  document.getElementById("width").innerHTML=metric.w || "0";
  document.getElementById("depth").innerHTML=metric.d || metric.l || "0";
  document.getElementById("height").innerHTML=metric.h || "0";
  document.getElementById("image").setAttribute("src", "http://www.ikea.com"+thing.images.normal[0]);
}

const renderIkeaThing = (mesh, thing)=>{
  const {x, y, z} = getImperialDims(thing);
  const scale = {};
  mesh.scale.x = x || 0.0001;
  mesh.scale.y = y || 0.0001;
  mesh.scale.z = z || 0.0001;
  mesh.position.y = y/2 || 0;
  updateReadout(thing);
  render(); 
}

const getFurnitureDimensions = (furniture)=>{
  return getImperialDims(furniture);
}

export default getFurnitureDimensions;
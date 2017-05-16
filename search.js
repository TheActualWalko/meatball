const fs = require("fs");
const things = JSON.parse(fs.readFileSync("ikea-clean-deduped.json"));

const bad = ["bedspread", "underbed", "bed base", "bed tent", "bed pocket", "doll ", "bedlinen", "mattress for", "bed canopy", "bed tray", "bed runner", "for bed frame"]

const filtered = things.filter(({type})=>{
  const t = type.toLowerCase();
  if (!t.includes("bed")) {
    return false;
  }
  for (let i = 0; i < bad.length; i ++) {
    if (t.includes(bad[i])) {
      return false;
    }
  }
  return true;
});

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

const getSurfaceArea = ({metric}) => {
  if (metric.w && metric.l) {
    return transformMetricStr(metric.w) * transformMetricStr(metric.l)
  } else {
    return 0;
  }
};

filtered.sort((a,b)=>{
  return getSurfaceArea(b) - getSurfaceArea(a);
});

console.log(filtered.map(i=>{
  return `
name:  ${i.name}
type:  ${i.type}
url:   http://www.ikea.com${i.url}
area:  ${getSurfaceArea(i).toFixed(2)} m²
price: $${i.price} USD
`
}).join(""))
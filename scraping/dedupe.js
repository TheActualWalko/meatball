const fs = require("fs");

const things = require("./data/ikea-clean");

const output = [];
things.forEach(thing=>{
  let matched = false;
  for (let i = 0; i < output.length; i ++) {
    if(
      output[i].name === thing.name &&
      output[i].metric.l === thing.metric.l &&
      output[i].metric.w === thing.metric.w &&
      output[i].metric.d === thing.metric.d &&
      output[i].metric.h === thing.metric.h
    ){
      matched = true;
      break;  
    }
  }
  if (!matched) {
    output.push(thing);
  }
})


const stringified = JSON.stringify(output, null, 2);

fs.writeFileSync("data/ikea-clean-deduped.json", stringified);
fs.writeFileSync("data/ikea-clean-deduped.js", "module.exports=" + stringified + ";");
fs.writeFileSync("../public/ikea-clean-deduped.js", "var database=" + stringified + ";");
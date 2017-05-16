const fs = require("fs");
const col = require("./urls/products-from-collections.js");
const dir = require("./urls/products-direct.js");

const output = col;
let copies = 0;

dir.forEach(u=>{
  if(!output.includes(u)){
    output.push(u);
  }else{
    copies ++;
    console.log(copies);
  }
});

output.sort();

const stringified = JSON.stringify(output,null,2);

fs.writeFileSync("urls/products.json", stringified);
fs.writeFileSync("urls/products.js", "module.exports="+stringified+";");
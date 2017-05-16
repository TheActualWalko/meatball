const fs = require("fs");
const get = require("./get");
const products = require("../urls/products");

const getProductBlob = x=>x
  .split("jProductData = ")[1]
  .split("var jsonProduct")[0]
  .trim()
  .slice(0,-1);

const maybe = (fn, arg)=>{
  try{
    return fn(arg)
  }catch (e){
    return null
  }
}

const doTheThing = (input)=>{
  const filename = "ikea-"+(new Date().getTime())+".json";
  let numWritten = 0;
  fs.writeFileSync(filename, "[");
  get
    .many(input, (result, index)=>{
      const blob = maybe(getProductBlob, result);
      if (!blob) {
        console.log("***Error: " + input[index]);
        return;
      }
      if (numWritten === 0) {
        fs.appendFileSync(filename, blob);
      } else {
        fs.appendFileSync(filename, ","+blob);
      }
      numWritten ++;
    })
    .then(results=>{
      fs.appendFileSync(filename, "]");
    })
    .catch(console.log.bind(console))
}

doTheThing(products)
//console.log(products.length)
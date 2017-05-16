const fs = require("fs");

const things = JSON.parse(fs.readFileSync("data/ikea.json"));

const parseDims = (dims) => dims
  .split("<br/>")
  .filter(Boolean)
  .reduce((result, x)=>{
    x = x.toLowerCase();
    if (x.includes("min. width")) {
      // noop
    } else if (x.includes("drawer width")) {
      // noop
    } else if (x.includes("width")) {
      if (!result) result = {};
      result.w = x.split(": ")[1];
    } else if (x.includes("drawer depth")) {
      // noop
    } else if (x.includes("min. depth")) {
      // noop
    } else if (x.includes("depth")) {
      if (!result) result = {};
      result.d = x.split(": ")[1];
    } else if (x.includes("height under furniture")) {
      // noop
    } else if (x.includes("height of drawer")) {
      // noop
    } else if (x.includes("height")) {
      if (!result) result = {};
      result.h = x.split(": ")[1];
    } else if (x.includes("cord length")) {
      // noop
    } else if (x.includes("min. length")) {
      // noop
    } else if (x.includes("pile length")) {
      if (!result) result = {};
      result.h = x.split(": ")[1];
    } else if (x.includes("thickness")) {
      if (!result) result = {};
      result.h = x.split(": ")[1];
    } else if (x.includes("length")) {
      if (!result) result = {};
      result.l = x.split(": ")[1];
    } else if (x.includes("diameter")) {
      if (!result) result = {};
      result.l = x.split(": ")[1];
      result.w = x.split(": ")[1];
    }
    return result;
  }, null)

const output = things.map(
  t => {
    const { name, partNumber, url, metric, imperial, images, type } = t.product.items[0];
    const parsedMetric = parseDims(metric);
    const parsedImperial = parseDims(imperial);
    if (!parsedMetric || !parsedImperial) {
      console.log(metric, imperial);
      return null;
    }
    return { 
      name, 
      partNumber, 
      url, 
      metric: parsedMetric,
      imperial: parsedImperial,
      images, 
      type, 
      price: t.product.items[0].prices.normal.priceNormal.rawPrice
    };
  }
).filter(Boolean);

const stringified = JSON.stringify(output, null, 2);

fs.writeFileSync("data/ikea-clean.json", stringified);
fs.writeFileSync("data/ikea-clean.js", "module.exports=" + stringified + ";");

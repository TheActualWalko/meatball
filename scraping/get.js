const request = require("request");

const get = (url)=>new Promise((resolve, reject)=>{
  request.get(url, (error, wholeThing, body)=>{
    if (error) {
      reject(error);
    } else {
      resolve(body);
    }
  });
})

const iterate = (a, map, output=[]) => {
  if (output.length === 0) {
    console.log("IT BEGINS");
  }
  if (a.length > 0) {
    console.log(a.length + " requests remaining");
    if (map) {
      return get(a.splice(0,1)[0])
        .then((result)=>iterate(a, map, output.concat([map(result, output.length)])));
    } else {
      return get(a.splice(0,1)[0])
        .then((result)=>iterate(a, map, output.concat([result])));
    }
  } else {
    console.log("done!");
    return Promise.resolve(output);
  }
}

module.exports = {
  one: get,
  many: (input, map) => {
    return iterate([...input], map);
  }
}
const request = require("request");
const fs = require("fs");
const productURLs = [];
let received = 0;
for (let i = 0; i <= 25; i ++) {
  ((j)=>{
    request.get(`http://www.ikea.com/us/en/catalog/productsaz/${j}`, (err, response, body)=>{
      body
        .split('\n')
        .filter(line => line.includes('class="productsAzLink"'))
        .map(line => line.split('<a href="')[1].split('"')[0])
        .forEach(url => productURLs.push(url));
      received++;
      if (received === 26) {
        productURLs.sort();
        fs.writeFile("../urls/urls-raw.json", JSON.stringify(productURLs, null, 2));      
      }
    });
  })(i);
}
var config = require('./config-maker.js');
 
module.exports = config({
  filename: 'meatball.js',
  libraryName: 'Meatball',
  entry: './src/main.js',
});
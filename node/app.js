// console.log('----------------------- this', global);
// console.log('----------------------- module', module);
var run = require('./run');

var imageName = process.argv[2];
if (!imageName) {
  throw new Error('Squeak needs you to specify an image name');
}
console.log('Running image named: ', imageName);
run(imageName);

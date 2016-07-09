// console.log('----------------------- this', global);
// console.log('----------------------- module', module);
var run = require('./run');

var imageName = process.argv[2];
console.log('Running image named: ', imageName);
run(imageName);


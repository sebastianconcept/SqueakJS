// require('./sqModule');
// var Squeak = require('./vm');
var SqueakJS = require('./headless').SqueakJS;
// console.log('Just imported Squeak ...', Squeak);
console.log('Just imported SqueakJS ...', SqueakJS);

var runSqueak = function() {
  console.log('About to run SqueakJS ...');
  SqueakJS.runSqueak({
    // appName: 'SqueakJS',
    files: ['squeakjs.image', 'squeakjs.changes']
  });
};

module.exports = runSqueak;

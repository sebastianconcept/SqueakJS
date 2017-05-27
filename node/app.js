require('./headless');

var imageName = process.argv[2];
if (!imageName) {
  throw new Error('Squeak needs you to specify an image name');
}


console.log('About to run SqueakJS ...');

SqueakJS.runSqueak({
  imageName: imageName,
  argv: process.argv.slice(2)
});
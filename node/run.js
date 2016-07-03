require('./sqModule');
require('./vm');

var runSqueak = function() {
  console.log('About to run SqueakJS ...');
  global.SqueakJS.runSqueak({
    // appName: 'SqueakJS',
    files: ['squeakjs.image', 'squeakjs.changes']
  });
};

module.exports = runSqueak;

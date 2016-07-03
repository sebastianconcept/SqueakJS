var runSqueak = function() {
  console.log('About to run SqueakJS ...');
  global.SqueakJS.runHeadless({
    // appName: 'SqueakJS',
    files: ['squeakjs.image', 'squeakjs.changes']
  });
};

module.exports = runSqueak;
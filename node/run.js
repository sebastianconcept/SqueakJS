var runSqueak = function() {
  global.SqueakJS.runSqueak('squeakjs.image', {
    appName: 'SqueakJS',
    files: ['squeakjs.image', 'squeakjs.changes']
  });
};

module.exports = runSqueak;
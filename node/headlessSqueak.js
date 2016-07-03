'use strict';

// not sure how muchly needed this actually is


SqueakJS.runHeadless = function(buffer, name, options) {
    var display = {
      quitFlag: false
    }; // dummy object that will actually do nothing (until can be stopped to be used)
    global.clearTimeout(loop);
    // display.reset();
    // display.clear();
    // display.showBanner("Loading " + SqueakJS.appName);
    // display.showProgress(0);
    var self = this;
    global.setTimeout(function() {
        var image = new Squeak.Image(name);
        image.readFromBuffer(buffer, function() {
            display.quitFlag = false;
            var vm = new Squeak.Interpreter(image, display);
            SqueakJS.vm = vm;
            // localStorage['squeakImageName'] = name;
            // setupSwapButtons(options);
            // display.clear();
            // display.showBanner("Starting " + SqueakJS.appName);
            // var spinner = setupSpinner(vm, options);
            function run() {
                try {
                    if (display.quitFlag) self.onQuit(vm, display, options);
                    else vm.interpret(50, function(ms) {
                        if (ms == 'sleep') ms = 200;
                        if (spinner) updateSpinner(spinner, ms, vm, display);
                        loop = global.setTimeout(run, ms);
                    });
                } catch(error) {
                    console.error(error);
                    alert(error);
                }
            }
            display.runNow = function() {
                global.clearTimeout(loop);
                run();
            };
            display.runFor = function(milliseconds) {
                var stoptime = Date.now() + milliseconds;
                do {
                    display.runNow();
                } while (Date.now() < stoptime);
            };
            run();
        },
        function readProgress(value) {display.showProgress(value);});
    }, 0);
};

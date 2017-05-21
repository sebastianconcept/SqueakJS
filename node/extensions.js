// sounds like it doesn't need to be really global, we'll see...
function basicModule (dottedPath) {
    if (dottedPath === '') return global;
    var path = dottedPath.split('.'),
        name = path.pop(),
        parent = basicModule(path.join('.')),
        self = parent[name];
    if (!self) parent[name] = self = {
        loaded: false,
        pending: [],
        requires: function (req) {
            return {
                toRun: function (code) {
                    function load () {
                        code();
                        self.loaded = true;
                        console.log('toRun:', self.pending);
                        self.pending.forEach(function (f) { f(); });
                    }
                    if (req && !basicModule(req).loaded) {
                        basicModule(req).pending.push(load);
                    } else {
                        load();
                    }
                }
            };
        },
    };
    return self;
};

Object.extend = function (obj /* + more args */ ) {
    // skip arg 0, copy properties of other args to obj
    for (var i = 1; i < arguments.length; i++)
        if (typeof arguments[i] == 'object')
            for (var name in arguments[i])
                obj[name] = arguments[i][name];
};

// console.log('global.module === module', global.module === module);
// console.log(' ========= module', module);

function subclass (classPath /* + more args */ ) {
    // create subclass
    var subclass = function () {
        if (this.initialize) this.initialize.apply(this, arguments);
        return this;
    };
    // set up prototype
    var protoclass = function () { };
    protoclass.prototype = this.prototype;
    subclass.prototype = new protoclass();
    // skip arg 0, copy properties of other args to prototype
    for (var i = 1; i < arguments.length; i++)
        Object.extend(subclass.prototype, arguments[i]);
    // add class to module
    var modulePath = classPath.split("."),
        className = modulePath.pop();
    basicModule(modulePath.join('.'))[className] = subclass;
    return subclass;
};

module.exports = {
  module: basicModule,
  extend: Object.extend,
  subclass: subclass,
}

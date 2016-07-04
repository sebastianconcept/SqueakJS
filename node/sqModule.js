// sounds like it doesn't need to be really global, we'll see...
sqModule = function(dottedPath) {
    if (dottedPath === '') return global;
    var path = dottedPath.split('.'),
        name = path.pop(),
        parent = sqModule(path.join('.')),
        self = parent[name];
    if (!self) parent[name] = self = {
        loaded: false,
        pending: [],
        requires: function(req) {
            return {
                toRun: function(code) {
                    function load() {
                        code();
                        self.loaded = true;
                        self.pending.forEach(function(f){f();});
                    }
                    if (req && !sqModule(req).loaded) {
                        sqModule(req).pending.push(load);
                    } else {
                        load();
                    }
                }
            };
        },
    };
    return self;
};

module.exports = sqModule;
let builderCreep = require('role.builder');

module.exports.__proto__ = require('role.creep');

// The spawning manager treats harvesters as a special case so no need to
// really implement it for now
module.exports.num_units_needed = function(spawner) {
    return 3;
}

module.exports.run = function(creep) {
    if (!this.do_basic_work(creep)) {
        builderCreep.run(creep);
    }
}

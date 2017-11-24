
module.exports.__proto__ = require('role.creep');

module.exports.role = "upgrader";

module.exports.upgraders_needed = {}
module.exports.upgraders_needed[1] = 3;
module.exports.upgraders_needed[2] = 6;
module.exports.upgraders_needed[3] = 12; // we'll see how this goes 
module.exports.upgraders_needed[4] = 16;
module.exports.upgraders_needed[5] = 30;

module.exports.num_units_needed = function(spawner) {
    console.log("GCL: " + Game.gcl.level);
    return this.upgraders_needed[spawner.room.controller.level];
}

module.exports.run = function(creep) {
    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('🔄 harvest');
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('⚡ upgrade');
    }

    if(creep.memory.upgrading) {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else {
        var source = creep.pos.findClosestByPath(FIND_SOURCES)
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}

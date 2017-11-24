
module.exports.__proto__ = require('role.creep');

module.exports.role = "builder";

module.exports.num_units_needed = function(spawner) {
    return Math.max(Object.keys(Game.constructionSites).length * 2, 4);
}

module.exports.run = function(creep) {
    if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('🚧 build');
    }

    if(creep.memory.building) {
        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(target) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    else {
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}
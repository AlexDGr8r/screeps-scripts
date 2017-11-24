/*
 * Base creep
 */

let bodyUtil = require('util.body');

module.exports.role = "harvester";

// Priority in which energy is to be deposited, e.g. spawns first, extensions, etc
module.exports.ENERGY_PRIORITY = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];

// Override - most expensive to least expensive
module.exports.my_body = [
    [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
    [CARRY, WORK, WORK, MOVE, MOVE, MOVE],
    [CARRY, WORK, MOVE, MOVE],
    [CARRY, WORK, MOVE]
];

// Returns closest source based on path or null if nothing found
module.exports.findNearestAvailableSource = function(creep) {
    return creep.pos.findClosestByPath(FIND_SOURCES);
}

// Gets prioritized nearest target in which to deposit energy
module.exports.depositEnergyTarget = function(creep) {
    for (let i = 0; i < this.ENERGY_PRIORITY.length; i++) {
        let structures = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == this.ENERGY_PRIORITY[i] && structure.energy < structure.energyCapacity;
            }
        });
        if (structures.length > 0) {
            let structure = creep.pos.findClosestByPath(structures);
            if (structure) {
                return structure;
            }
        }
    }
    return null;
}

// No idle time is best time
module.exports.do_basic_work = function(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        let source = this.findNearestAvailableSource(creep);
        if (source) {
            let resp = creep.harvest(source);
            if (resp == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                return true;
            }
            return resp == OK;
        }
    }
    else {
        let energyTarget = this.depositEnergyTarget(creep);
        if (energyTarget) {
            let resp = creep.transfer(energyTarget, RESOURCE_ENERGY);
            if (resp == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                return true;
            }
            return resp == OK;
        }
    }
    return false;
}

module.exports.spawn = function(spawner) {
    let capacity = spawner.room.energyCapacityAvailable;
    console.log("Capacity: " + capacity);
    console.log("Available energy: " + spawner.room.energyAvailable);
    for (let i = 0; i < this.my_body.length; i++) {
        let cost = bodyUtil.getBodyCost(this.my_body[i]);
        console.log("Cost: " + cost);
        if (capacity >= cost) {
            let the_body = this.my_body[i];
            if (this.my_body[i + 1]) the_body = this.my_body[i + 1];
            spawner.spawnCreep(the_body, this.role + Game.time, {
                memory: {role: this.role}
            });
            return true;
        }
    }
    return false;
}

module.exports.num_units_needed = function(spawner) {
    return 1;
}

module.exports.run = function(creep) {
    this.do_basic_work(creep);
}


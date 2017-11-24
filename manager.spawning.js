let roleBuilder = require('role.builder');
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');

module.exports.clearCreepMemory = function () {
    // Clear dead creeps from memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

var spawnNeededCreeps = function(spawner) {
    if (spawner.spawning) {
        console.log("Currently spawning");
        return;
    }
    var sources = spawner.room.find(FIND_SOURCES);
    var totalEnergy = 0;
    for (var source in sources) {
        totalEnergy += source.energyCapacity;
    }
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log("Harvesters: " + harvesters.length);
    if (harvesters.length < 3) {
        if (roleHarvester.spawn(spawner)) return;
    }
        
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log("Upgraders: " + upgraders.length);
    console.log("Needed: " + roleUpgrader.num_units_needed(spawner));
    if (upgraders.length < roleUpgrader.num_units_needed(spawner) && roleUpgrader.spawn(spawner)) {
        return;
    }
    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log("Builders: " + builders.length);
    console.log("Needed: " + roleBuilder.num_units_needed(spawner));
    if (builders.length < roleBuilder.num_units_needed(spawner) && roleBuilder.spawn(spawner)) {
        return;
    }
    
    console.log("Harvesters check");
    if (harvesters.length < Math.ceil(totalEnergy / 1000)) {
        roleHarvester.spawn(spawner);
    }
}

var outputSpawning = function(spawner) {
    if (spawner.spawning) {
        var spawningCreep = Game.creeps[spawner.spawning.name];
        spawner.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawner.pos.x + 1,
            spawner.pos.y,
            {align: 'left', opacity: 0.8});
    }
}

module.exports.run = function(spawner) {
    outputSpawning(spawner);
    // Only worry about this every 10 ticks for now
    if (Game.time % 10 == 0) {
        console.log("Checking for spawn");
        this.clearCreepMemory();
        if (spawner.energy > 0) {
            spawnNeededCreeps(spawner);
        }
    }
}
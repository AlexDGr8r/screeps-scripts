// Utility code to handle body cost calculation

module.exports.COST = [];
module.exports.COST[ATTACK]        = 80;
module.exports.COST[CARRY]         = 50;
module.exports.COST[CLAIM]         = 50;
module.exports.COST[HEAL]          = 150;
module.exports.COST[MOVE]          = 50;
module.exports.COST[RANGED_ATTACK] = 150;
module.exports.COST[TOUGH]         = 10;
module.exports.COST[WORK]          = 100;

module.exports.getBodyCost = function(parts) {
    let cost = 0;
    for (let part of parts) {
        cost += this.COST[part];
    }
    return cost;
}
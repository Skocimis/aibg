import RandomMovementAction from "./actions/RandomMovementAction.js";

const Agent = {}
// [AttackAction.id, HideAction.id]
const DEBUG_UTILITIES = false;
const DEBUG_ACTIONS = false;
const DEBUG_ACTION_HISTORY = false;
const DEBUG_RESULT = false;

Agent.actionHistory = [];

Agent.action = function () {
    let maxutility = -1;
    let maxaction = -1;
    if (DEBUG_ACTIONS)
        console.log("Action utilities: ");
    for (let i in Agent.actions) {
        let utility = Agent.utility(Agent.actions[i]);
        if (DEBUG_ACTIONS && (DEBUG_ACTIONS === true || DEBUG_ACTIONS.includes(i))) {
            console.log(i + ": " + utility);
        }
        if (utility > maxutility) {
            maxaction = i;
            maxutility = utility;
        }
    }
    Agent.actionHistory.push({ action: maxaction, utility: maxutility });
    if (DEBUG_ACTIONS) {
        console.log("Action chosen: " + maxaction + " (" + maxutility + ")");
    }
    if (DEBUG_ACTION_HISTORY) {
        console.log("Action history: ")
        console.log(Agent.actionHistory);
    }
    let result = Agent.actions[maxaction].command();
    if (DEBUG_RESULT) {
        console.log("Result of chosen action: ")
        console.log(result)
    }
    return result;
}
Agent.utility = function (action) {
    let utilities = [];
    if (DEBUG_UTILITIES && (DEBUG_UTILITIES === true || DEBUG_UTILITIES.includes(action.id)))
        console.log("- - - " + action.id + " - - -")
    for (let i in action.params) {
        let result = action.params[i]();
        if (DEBUG_UTILITIES && (DEBUG_UTILITIES === true || DEBUG_UTILITIES.includes(action.id)))
            console.log(i + ": " + result)
        if (result !== null)
            utilities.push(result);
    }
    let alpha = 1.0 - 1.0 / utilities.length;
    let product = 1;
    for (let i in utilities) {
        let beta = (1 - utilities[i]) * alpha;
        product *= utilities[i] + beta * utilities[i];
    }
    if (DEBUG_UTILITIES && (DEBUG_UTILITIES === true || DEBUG_UTILITIES.includes(action.id)))
        console.log("Total: " + product)
    return product;
}

Agent.actions = {};
let actionArray = [RandomMovementAction];
for (let i in actionArray) {
    Agent.actions[actionArray[i].id] = actionArray[i];
}

export default Agent;
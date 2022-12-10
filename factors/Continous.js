import World from "../World.mjs"
import Agent from "../Agent.mjs"

const id = "continous";
const ContinousFactor = {
    id: id,
    callback: () => {
        if (Agent.actionHistory[Agent.actionHistory.length - 1]?.action == actionId) {
            return 1;
        }
        return null;
    }
}

export default ContinousFactor;
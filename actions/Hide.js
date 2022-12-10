import World from "../World.mjs"
import Agent from "../Agent.mjs"
const id = "hide";
const HideAction = {
    id: id,
    params: {
        continous: () => {
            if (Agent.actionHistory[Agent.actionHistory.length - 1]?.action == id) {
                return null// 0.5;
            }
            return null;
        },
        overpower: () => {
            return Math.max((10 - World.getPlayerHealth()) / 10, 0)
        }
    },
    command: () => {
        return { action: "hide" }
    }
}
export default HideAction;
import World from "../World.mjs"
import Agent from "../Agent.mjs"

const id = "attack";
const AttackAction = {
    id: id,
    params: {
        continous: () => {
            if (Agent.actionHistory[Agent.actionHistory.length - 1]?.action == id) {
                return null//0.5;
            }
            return null;
        },
        overpower: () => {
            return Math.min(World.getPlayerHealth() / 10, 1)
        }
    },
    command: () => {
        return { action: "attack", enemyId: 5 }
    }
}

export default AttackAction;
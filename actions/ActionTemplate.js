import World from "../World.mjs"

const id = "action_id";
const Action = {
    id: id,
    params: {
        param1: () => {
            return 0;
        }
    },
    command: () => {
        return { action: "none" }
    }
}
export default AttackAction;
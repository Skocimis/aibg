import World from "../World.mjs"

const id = "idle";
const IdleAction = {
    id: id,
    params: {
        unsure: () => {
            return 0.51;
        }
    },
    command: () => {
        return { action: "none" }
    }
}
export default IdleAction;
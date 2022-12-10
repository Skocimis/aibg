import World from "../World.mjs"
import Teren from "../NoviTeren.mjs";

const id = "random_movement";
const RandomMovementAction = {
    id: id,
    params: {
        param1: () => {
            return 1;
        }
    },
    command: () => {
        let position = World.getPlayerPosition();
        console.log(position);
        let destination = { q: 12, r: -9 };
        let next = Teren.BogdanovBFS(position, destination);
        console.log(next);
        let resultAction = { type: "move", ...next }//(position.q == -13) ? { type: "move", q: -14, r: 7 } : { type: "move", q: -13, r: 6 };
        console.log(resultAction);
        return resultAction;
    }
}
export default RandomMovementAction;
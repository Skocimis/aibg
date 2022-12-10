import World from "../World.mjs"
import Teren from "../NoviTeren.mjs";

const id = "move_to_xp";
const MoveToXPAction = {
    id: id,
    params: {
        param1: () => {
            return 1;
        }
    },
    command: () => {
        let bfsRes = Teren.BogdanovBFS(World.getPlayerPosition(), World.getExperienceCoordinates());
        if (!bfsRes) return { type: "move", ...position };
        if (bfsRes.napad) {
            return { type: "attack", ...bfsRes.kamen };
        }
        let next = bfsRes.sledeci;
        let udaljenost = bfsRes.razdaljina;
        let resultAction = { type: "move", ...next }
        //(position.q == -13) ? { type: "move", q: -14, r: 7 } : { type: "move", q: -13, r: 6 };
        //console.log(resultAction);
        return resultAction;
    }
}
export default MoveToXPAction;
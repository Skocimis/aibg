import World from "../World.mjs"
import Teren from "../NoviTeren.mjs";

const id = "attack_boss";
const AttackBossAction = {
    id: id,
    params: {
        param1: () => {
            return 1;
        }
    },
    command: () => {
        let bfsRes = Teren.BogdanovBFSBoss(World.getPlayerPosition(), { q: 0, r: 0 });
        console.log("REZULTAT BFS");
        console.log(bfsRes);
        if (!bfsRes) return { type: "move", ...(World.getPlayerPosition()) };
        if (bfsRes.razdaljina <= 4) {
            //Pucaj bosa
            let sus = Teren.susedi({ q: 0, r: 0 });
            for (let i in sus) {
                if (Teren.udaljenost(sus[i], World.getPlayerPosition()) < 4) {
                    return { type: "attack", ...(sus[i]) }
                }
            }
        }
        else {
            let next = bfsRes.sledeci;
            if (bfsRes.napad) {
                return { type: "attack", ...bfsRes.kamen };
            }
            let resultAction = { type: "move", ...next }
            return resultAction;
        }
    }
}
export default AttackBossAction;
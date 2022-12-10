import World from "../World.mjs"
import Teren from "../NoviTeren.mjs";

const id = "attack_boss";
const AttackBossAction = {
    id: id,
    params: {
        param1: () => {
            return 0.5;
        }
    },
    command: () => {
        let bfsRes = Teren.BogdanovBFSBoss(World.getPlayerPosition(), { q: 0, r: 0 });
        if (!bfsRes) return { type: "move", ...(World.getPlayerPosition()) };
        if (bfsRes.razdaljina <= 4) {
            let sus = Teren.susedi({ q: 0, r: 0 });
            for (let i in sus) {
                if (Teren.udaljenost(sus[i], World.getPlayerPosition()) < 4) {
                    return { type: "attack", ...(sus[i]) }
                }
            }
        }

        let prstenki = Teren.prsten(4);
        let minrazd = 50;
        let mini = -1;
        for (let i = 0; i < prstenki.length; i++) {
 
            let rd = Teren.udaljenost(World.getPlayerPosition(), prstenki[i]);
            if (rd <= minrazd) {
                mini = i;
                minrazd = rd;
            }
        }
        //console.log("NAJBLIZI NA PRSTENU");
        //console.log(prstenki[mini]);

        let rezult = Teren.BogdanovBFSBoss(World.getPlayerPosition(), prstenki[mini]);
        if (rezult.napad) {
            return { type: "attack", ...rezult.kamen };
        }
        let resultAction = { type: "move", ...rezult.sledeci }
        return resultAction;
    }
}
export default AttackBossAction;
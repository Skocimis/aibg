import World from "../World.mjs"
import Agent from "../Agent.mjs"
import Teren from "../NoviTeren.mjs";

const id = "selfdefence";
const SelfDefenceAction = {
    id: id,
    params: {
        smallThreat: () => {
            let pos = World.getPlayerPosition();
            let players = [];
            for (let i = 1; i <= 4; i++) {
                if (i == World.playerIdx) continue;
                if (Teren.udaljenost(pos, World.gameState["player" + i]) <= 3) {
                    //players[];
                }
            }
            return 0;
        }
    },
    command: () => {
        return { action: "attack", enemyId: 5 }
    }
}

export default SelfDefenceAction;
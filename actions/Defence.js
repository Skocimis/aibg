/*import Teren from "../NoviTeren.mjs";
import World from "../World.mjs"

const id = "defence_id";
const Defence = {
    id: id,
    params: {
        param1: () => {
            let player1=World.getPlayerPosition();
            let player2=World.gameState.player2;
            let player3=World.gameState.player3;
            let player4=World.gameState.player4;

            let prvnapao=false;
            let druginapao=false;
            let trecinapao=false;
            if(3==Teren.BogdanovBFSBoss(player1,player2).razdaljina)
            {
                prvnapao=true;
            }
            else if(3==Teren.BogdanovBFSBoss(player1,player3).razdaljina)
            {
               druginapao=true;
            }
            else if(3==Teren.BogdanovBFSBoss(player1,player4).razdaljina)
            {
                trecinapao=true;
            }


        }
    },
    command: () => {
        return { action: "none" }
    }
}
export default Defence;*/
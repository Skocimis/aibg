import Agent from "./Agent.mjs"
import World from "./World.mjs"
import { doActionTest, startGame, sleep } from "./Config.mjs";
let playerIdx = 3;
let minutes = 1;
let mapName = "test1.txt";

World.load(await startGame(playerIdx, mapName, minutes), { playerIdx: playerIdx });
//console.log("LOADOVAO");
while (true) {
    //await sleep(5000);
    let actionResult = await doActionTest(Agent.action());
    if (actionResult?.message?.includes("Greska u train metodi, igra ne postoji.")) break;
    World.update(actionResult, { playerIdx: playerIdx })
}
console.log("Igra gotova");
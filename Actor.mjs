import Agent from "./Agent.mjs"
import World from "./World.mjs"
import { doActionTest, startGame, sleep } from "./Config.mjs";
let playerIdx = 2;
let minutes = 1;
let mapName = "test1.txt";

World.load(await startGame(playerIdx, mapName, minutes), { playerIdx: playerIdx });
//console.log("LOADOVAO");
let brojac = 0;
while (true) {
    await sleep(500);
    let akc = Agent.action();
    console.log("AKCIJ");
    console.log(akc);
    let actionResult = await doActionTest(akc);
    if (actionResult?.message?.includes("Greska u train metodi, igra ne postoji.")) break;
    else if (actionResult.message) {
        console.log(actionResult.message);
    }
    World.update(actionResult, { playerIdx: playerIdx })
    console.log(brojac++)
}
console.log("Igra gotova");
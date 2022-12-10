import Agent from "./Agent.mjs"
import World from "./World.mjs"
import { doActionTest, startGame, sleep } from "./Config.mjs";
//let playerIdx = 2;
//let minutes = 3;
//let mapName = "test2.txt";

World.load(await startGame(playerIdx, mapName, minutes)/*, { playerIdx: playerIdx }*/);
//console.log("LOADOVAO");
let brojac = 0;
while (true) {
    let pocetakPetlje = new Date().getTime();
    let imajaceg = false;
    let mojskor = World.gameState["player" + World.playerIdx].score;
    for (let i = 1; i <= 4; i++) {
        if (i == World.playerIdx) continue;
        if (World.gameState["player" + i].score >= mojskor) {
            imajaceg = true;
        }
    }
    if (!imajaceg) {
        await sleep(1750);
    }
    let akc = Agent.action();
    let actionResult = await doActionTest(akc);
    if (actionResult?.message?.includes("Greska u train metodi, igra ne postoji.")) break;
    else if (actionResult.message) {
        console.log(actionResult.message);
    }
    World.update(actionResult/*, { playerIdx: playerIdx }*/)
    console.log("Vreme: " + (new Date().getTime() - pocetakPetlje))
}
console.log("Igra gotova");
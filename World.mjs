import Teren from "./NoviTeren.mjs";

const World = {}
World.gameState = {}
World.load = function (data, bonus) {
    World.update(data, bonus);
    World.crvotocine = this.ucitajCrvotocine();
}

World.update = function (data, bonus) {
    if (!data.gameState) return;
    World.gameState = JSON.parse(data.gameState);
    if (bonus.playerIdx) {
        World.playerIdx = bonus.playerIdx;
    }
}
World.getPlayerPosition = function () {
    if (!World.playerIdx) return null;
    let player = World.gameState["player" + World.playerIdx];
    return { q: player.q, r: player.r }
}
World.getFieldByCoordinates = function (coordinates) {
    if (!coordinates || (!coordinates.r && coordinates.r !== 0) || (!coordinates.q && coordinates.q !== 0)) return null;
    let size = World.gameState.map.size;
    let red = coordinates.r + Math.floor(size / 2);
    let minimalni = Math.max(-Math.floor(size / 2), -red);
    return World.gameState.map.tiles[red][coordinates.q - minimalni];

}
World.ucitajCrvotocine = function () {
    let tiles = World.gameState.map.tiles;
    let crvotocine2 = {}
    for (let i in tiles)
        for (let j in tiles[i])
            if (tiles[i][j].entity.type == "WORMHOLE") {
                if (!crvotocine2[tiles[i][j].entity.id])
                    crvotocine2[tiles[i][j].entity.id] = [];
                crvotocine2[tiles[i][j].entity.id].push({ q: tiles[i][j].q, r: tiles[i][j].r });

            }
    let crvotocine = {};
    for (let i in crvotocine2) {
        crvotocine[Teren.serialize(crvotocine2[i][0])] = crvotocine2[i][1]
        crvotocine[Teren.serialize(crvotocine2[i][1])] = crvotocine2[i][0]
    }
    return crvotocine;
}

export default World;
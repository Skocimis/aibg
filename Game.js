let Tile = function (type) {
    return {
        type
    }
}
let EmptyTile = function () {
    return Tile("empty");
}
let CharacterTile = function (character) {
    return { ...Tile("character"), character }
}


const Game = {}

const h = 10, w = 10;
Game.world = {
    map: new Array(h).fill().map(e => new Array(w).fill().map(e => EmptyTile()))
}
Game.world.map[1][1] = CharacterTile({ name: "Igrac" });
Game.world.map[6][6] = CharacterTile({ name: "Bandit" });
Game.world.map[9][9] = CharacterTile({ name: "Bandit" });
Game.getTile = function (y, x) {
    return Game.world.map[y, x];
}
Game.showMap = function () {
    let rez = "";
    for (let j = 0; j < w; j++) {
        rez += "---";
    }
    rez += "\n"
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let vred = "-";
            if (Game.world.map[i][j].character) {
                vred = Game.world.map[i][j].character.name[0]
            }
            rez += " " + vred + " ";
        }
        rez += "\n"
    }
    for (let j = 0; j < w; j++) {
        rez += "---";
    }
    rez += "\n"
    console.log(rez);
}

//Game.showMap()
export default Game;
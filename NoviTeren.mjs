import World from "./World.mjs";

const Teren = {}
Teren.DUZINA = 29;//Setuje se
let smerovi = ["e", "se", "sw", "w", "nw", "ne"];
Teren.poljePostoji = function (polje, duzina = Teren.DUZINA) {
    if (!polje || (!polje.r && polje.r !== 0) || (!polje.q && polje.q !== 0)) return null;
    let s = 0 - polje.q - polje.r;
    //console.log("INPUT")
    //console.log(polje)
    //console.log(Math.max(Math.max(Math.abs(polje.q), Math.abs(polje.r)), Math.abs(s)) <= Math.floor(duzina / 2) ? "POSTOJI" : "NE POSTOJI")
    //console.log(duzina)
    return Math.max(Math.max(Math.abs(polje.q), Math.abs(polje.r)), Math.abs(s)) <= Math.floor(duzina / 2);
}
Teren.putuj = function (pocetak, smer, duzina = 1) {
    if (!Teren.poljePostoji(pocetak)) {
        return null;
    }
    if (smer == "e")  //q+
        return { q: pocetak.q + duzina, r: pocetak.r };
    else if (smer == "se")  //r+
        return { q: pocetak.q, r: pocetak.r + duzina };
    else if (smer == "sw")  //q-r+
        return { q: pocetak.q - duzina, r: pocetak.r + duzina };
    else if (smer == "w")  //q-
        return { q: pocetak.q - duzina, r: pocetak.r };
    else if (smer == "nw")  //r-
        return { q: pocetak.q, r: pocetak.r - duzina };
    else if (smer == "ne")  //q+r-
        return { q: pocetak.q + duzina, r: pocetak.r - duzina };
    else
        return null;
}
Teren.susedi = function (polje) {
    if (!Teren.poljePostoji(polje)) return null;
    let sp = [];
    for (let i in smerovi) {
        let p = Teren.putuj(polje, smerovi[i]);
        if (this.poljePostoji(p)) {
            sp.push(p);
        }
    }
    return sp;
}
Teren.str = function (polje) {
    if (!Teren.poljePostoji(polje)) return null;
    return polje.q + "," + polje.r;
}
Teren.unstr = function (str) {
    let brs = str.split(",");
    let polje = { q: parseInt(brs[0]), r: parseInt(brs[1]) };
    if (!this.poljePostoji(polje)) return null;
    return polje;
}

Teren.udaljenost = function (a, b) {
    if (!Teren.poljePostoji(a) || !Teren.poljePostoji(b)) return null;
    return Math.floor((Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2);
}
Teren.Azvezda = function (pocetak, kraj) {
    let udaljenosti = {};
    udaljenosti[this.str(pocetak)] = {
        vrednost: 0,
        prosli: null
    };
    let red = [];
    red.push(pocetak);
    while (red.length > 0) {
        for (let i in this.susedi())
            if (this.str(red[0]) == this.str(kraj)) {
                return true;
            }

    }
}
Teren.serialize = function (polje) {
    return polje.q + "," + polje.r;
}
Teren.deserialize = function (polje) {
    let spl = polje.split(",");
    return { q: parseInt(spl[0]), r: parseInt(spl[1]) };
}
Teren.BogdanovBFS = function (start, end) {
    let poseceni = {};
    let queue = [];
    poseceni[this.serialize(start)] = { d: 0, p: null };
    while (queue.length > 0) {
        let element = queue.shift();
        if (end.r == element.r && end.q == element.q) {
            let naleteonaasteroid = 0; //Logika stavi se na 3 kad naidje na asteroid(brojac se smanjuje svakim potezom) ako je 0 ne napada asteroid jer je van dometa
            let kamen = null;
            let kljuc = this.serialize(end);
            let pos = poseceni[kljuc]; // d, p
            let razdaljina = pos.d;
            if (pos.p === null) return null;
            while (poseceni[pos.p].p != null) {
                if (naleteonaasteroid > 0)
                    naleteonaasteroid--;

                if (World.getFieldByCoordinates(this.deserialize(kljuc)).entity.type == "ASTEROID") {
                    naleteonaasteroid = 2;
                    kamen = kljuc;
                }
                kljuc = pos.p;
                pos = poseceni[pos.p];
            }
            if (naleteonaasteroid != 0) {
                return {
                    napad: true,
                    kamen: this.deserialize(kamen),
                    razdaljina: razdaljina
                }
            }
            let ssusedi = Teren.susedi(start);
            let sc = [];
            for (let i in ssusedi) {
                if (World.getFieldByCoordinates(ssusedi[i]).entity.type == "WORMHOLE") {
                    sc.push(ssusedi[i]);
                }
                if (this.serialize(ssusedi[i]) == kljuc) {
                    return {
                        sledeci: ssusedi[i],
                        razdaljina: razdaljina
                    };
                }
            }
            for (let i in sc) {
                let komsijskiWormhole = World.crvotocine[this.serialize(sc[i])];
                let ds = this.deserialize(kljuc);
                if (ds.q == komsijskiWormhole.q + sc[i].q - start.q &&
                    ds.r == komsijskiWormhole.r + sc[i].r - start.r) {
                    return {
                        sledeci: { q: sc[i].q, r: sc[i].r },
                        razdaljina: razdaljina
                    };
                }
            }
            return null;
            //break;
        }
        let susedi = Teren.susedi(element); //getfieldbycoordinates suseda
        //Ako je sused crvotocine ima jos jednog suseda'
        for (let i = 0; i < susedi.length; i++) {
            let sused = World.getFieldByCoordinates(susedi[i]);
            if (sused.tileType == "FULL") {
                if (sused.entity.type == "ASTEROID") {
                    let unistiateroid = Math.ceil(350 / (100 + 50 * World.getPlayerLevel()));//Racuna vreme potrebno da se unisti asteroid
                    //console.log("UNISTIASTEROID " + unistiateroid);

                    if (!poseceni[this.serialize(susedi[i])]) {
                        poseceni[this.serialize(susedi[i])] = { d: poseceni[this.serialize(element)].d + 1 + unistiateroid, p: this.serialize(element) };
                        queue.push(susedi[i]);
                        queue.sort();
                    }
                    else {
                        if (poseceni[this.serialize(element)].d + 1 + unistiateroid < poseceni[this.serialize(susedi[i])].d) {
                            poseceni[this.serialize(susedi[i])] = { d: poseceni[Teren.serialize(element)].d + 1 + unistiateroid, p: this.serialize(element) }
                        }
                    }
                    continue;
                }
                else
                    continue;
            }
            if (sused.entity.type == "BLACKHOLE") continue; //2
            let pp = false;
            for (let j = 1; j <= 4; j++) {
                if (i == World.playerIdx) continue;
                if (susedi[i].q == World.gameState["player" + j].q
                    && susedi[i].r == World.gameState["player" + j].r) {
                    pp = true;
                    break;
                }
            }
            if (pp) continue;
            if (sused.entity.type == "WORMHOLE") {
                let komsijskiWormhole = World.crvotocine[this.serialize(sused)];
                susedi[i] = {
                    q: komsijskiWormhole.q + sused.q - element.q,
                    r: komsijskiWormhole.r + sused.r - element.r
                }
                i--;
                continue;
            }; //sused
            if (!poseceni[this.serialize(susedi[i])]) {
                poseceni[this.serialize(susedi[i])] = { d: poseceni[this.serialize(element)].d + 1, p: this.serialize(element) };
                queue.push(susedi[i]);
                queue.sort();
            }
            else {
                if (poseceni[this.serialize(element)].d + 1 < poseceni[this.serialize(susedi[i])].d) {
                    poseceni[this.serialize(susedi[i])] = { d: poseceni[this.serialize(element)].d + 1, p: this.serialize(element) }
                }
            }
        }
    }
    return null;
}

Teren.BogdanovBFSBoss = function (start, end) {
    let poseceni = {};
    let queue = [];
    poseceni[this.serialize(start)] = { d: 0, p: null };
    queue.push(start);
    while (queue.length > 0) {
        queue.sort((a, b) => {
            if (poseceni[this.serialize(a)].d < poseceni[this.serialize(b)].d) {
                return -1;
            }
            if (poseceni[this.serialize(a)].d > poseceni[this.serialize(b)].d) {
                return 1;
            }
            let mikiPoz = World.getPlayerPosition();
            let hanterId = 0;
            let hanterDistance = 50;
            for (let i = 1; i < 4; i++) {
                if (i == World.playerIdx) continue;
                let ud = Teren.udaljenost(mikiPoz, World.gameState["player" + i]);
                //console.log(mikiPoz);
                //console.log(World.gameState["player" + i]);
                //console.log(ud);
                if (ud < hanterDistance) {
                    hanterDistance = ud;
                    hanterId = i;
                }
            }
            //console.log("HANTER JE " + hanterId);
            //console.log("UDALJENOST " + hanterDistance);
            let aud = Teren.udaljenost(World.gameState["player" + hanterId], a);
            let bud = Teren.udaljenost(World.gameState["player" + hanterId], b);
            //console.log("AUD");
            //console.log(aud);
            //console.log(bud);
            if (aud > bud)
                return -1;
            if (aud < bud)
                return 1;
            return 0;
        })
        let element = queue.shift();
        if (end.r == element.r && end.q == element.q) {
            let naleteonaasteroid = 0; //Logika stavi se na 3 kad naidje na asteroid(brojac se smanjuje svakim potezom) ako je 0 ne napada asteroid jer je van dometa
            let kamen = null;
            let kljuc = this.serialize(end);
            let pos = poseceni[kljuc]; // d, p
            let razdaljina = pos.d;
            let niz = [];
            if (pos.p === null) return null;
            while (poseceni[pos.p].p != null) {
                if (naleteonaasteroid > 0)
                    naleteonaasteroid--;

                if (World.getFieldByCoordinates(this.deserialize(kljuc)).entity.type == "ASTEROID") {
                    naleteonaasteroid = 2;
                    kamen = kljuc;
                }
                niz.push(pos);
                kljuc = pos.p;
                pos = poseceni[pos.p];
            }
            niz.push(pos);
            niz.reverse()
            //console.log(niz)
            if (naleteonaasteroid != 0 && ((Teren.udaljenost(World.getPlayerPosition(), { q: 0, r: 0 }) != 8) || (Teren.udaljenost(World.getPlayerPosition(), this.deserialize(kamen)) <= 1))) {
                return {
                    napad: true,
                    kamen: this.deserialize(kamen),
                    razdaljina: razdaljina
                }
            }
            let ssusedi = Teren.susedi(start);
            let sc = [];
            for (let i in ssusedi) {
                if (World.getFieldByCoordinates(ssusedi[i]).entity.type == "WORMHOLE") {
                    sc.push(ssusedi[i]);
                }
                if (this.serialize(ssusedi[i]) == kljuc) {
                    return {
                        sledeci: ssusedi[i],
                        razdaljina: razdaljina
                    };
                }
            }
            for (let i in sc) {
                let komsijskiWormhole = World.crvotocine[this.serialize(sc[i])];
                let ds = this.deserialize(kljuc);
                if (ds.q == komsijskiWormhole.q + sc[i].q - start.q &&
                    ds.r == komsijskiWormhole.r + sc[i].r - start.r) {
                    return {
                        sledeci: { q: sc[i].q, r: sc[i].r },
                        razdaljina: razdaljina
                    };
                }
            }
            return null;
            //break;
        }
        let susedi = Teren.susedi(element); //getfieldbycoordinates suseda
        //Ako je sused crvotocine ima jos jednog suseda'
        for (let i = 0; i < susedi.length; i++) {
            let sused = World.getFieldByCoordinates(susedi[i]);
            if (sused.tileType == "FULL") {
                if (sused.entity.type == "ASTEROID") {
                    let unistiateroid = 0//Math.ceil(350 / (100 + 50 * World.getPlayerLevel()));//Racuna vreme potrebno da se unisti asteroid
                    //console.log("UNISTIASTEROID " + unistiateroid);

                    if (!poseceni[this.serialize(susedi[i])]) {
                        poseceni[this.serialize(susedi[i])] = { d: poseceni[this.serialize(element)].d + 1 + unistiateroid, p: this.serialize(element) };
                        queue.push(susedi[i]);
                    }
                    else {
                        if (poseceni[this.serialize(element)].d + 1 + unistiateroid < poseceni[this.serialize(susedi[i])].d) {
                            poseceni[this.serialize(susedi[i])] = { d: poseceni[Teren.serialize(element)].d + 1 + unistiateroid, p: this.serialize(element) }
                        }
                    }
                    continue;
                }
            }
            if (sused.entity.type == "BLACKHOLE") continue; //2
            let pp = false;
            for (let j = 1; j <= 4; j++) {
                if (i == World.playerIdx) continue;
                if (susedi[i].q == World.gameState["player" + j].q
                    && susedi[i].r == World.gameState["player" + j].r) {
                    pp = true;
                    break;
                }
            }
            if (pp) continue;
            if (sused.entity.type == "WORMHOLE") {
                let komsijskiWormhole = World.crvotocine[this.serialize(sused)];
                susedi[i] = {
                    q: komsijskiWormhole.q + sused.q - element.q,
                    r: komsijskiWormhole.r + sused.r - element.r
                }
                i--;
                continue;
            }; //sused
            if (!poseceni[this.serialize(susedi[i])]) {
                poseceni[this.serialize(susedi[i])] = { d: poseceni[this.serialize(element)].d + 1, p: this.serialize(element) };
                queue.push(susedi[i]);
            }
            else {
                if (poseceni[this.serialize(element)].d + 1 < poseceni[this.serialize(susedi[i])].d) {
                    poseceni[this.serialize(susedi[i])] = { d: poseceni[this.serialize(element)].d + 1, p: this.serialize(element) }
                }
            }
        }
    }
    console.log("IZASLI IZ WHILEA");
    return null;
}
Teren.prsten = function (duzina) {
    let pocetak = { r: 0, q: 0 };
    pocetak = Teren.putuj({ r: 0, q: 0 }, "sw", duzina);
    let niz = [pocetak];
    for (let i = 0; i < duzina; i++) {
        niz.push(Teren.putuj(niz[niz.length - 1], "e", 1));
    }
    for (let i = 0; i < duzina; i++) {
        niz.push(Teren.putuj(niz[niz.length - 1], "ne", 1));
    }
    for (let i = 0; i < duzina; i++) {
        niz.push(Teren.putuj(niz[niz.length - 1], "nw", 1));
    }
    for (let i = 0; i < duzina; i++) {
        niz.push(Teren.putuj(niz[niz.length - 1], "w", 1));
    }
    for (let i = 0; i < duzina; i++) {
        niz.push(Teren.putuj(niz[niz.length - 1], "sw", 1));
    }
    for (let i = 0; i < duzina - 1; i++) {
        niz.push(Teren.putuj(niz[niz.length - 1], "se", 1));
    }
    return niz;
}

//console.log(Teren.susedi({ q: 14, r: -14 }));
//console.log(Teren.udaljenost({ q: -4, r: 1 }, { q: -3, r: -4 }))
//console.log()
export default Teren;
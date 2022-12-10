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
    if (!Teren.poljePostoji(pocetak)) return null;
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
    else return null;
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
    console.log("POCEO");
    let queue = [];
    poseceni[this.serialize(start)] = { d: 0, p: null };
    queue.push(start);
    while (queue.length > 0) {
        let element = queue.shift();
        if (end.r == element.r && end.q == element.q) {
            console.log("NASLI " + element.q + ", " + element.r);
            //NASLI, BEKTREK
            let kljuc = this.serialize(end);
            let pos = poseceni[kljuc]; // d, p
            let razdaljina = pos.d;
            if (pos.p === null) return null;
            while (poseceni[pos.p].p != null) {
                kljuc = pos.p;
                pos = poseceni[pos.p];
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
            if (sused.tileType == "FULL") continue; //Kroz asteroid
            if (sused.entity.type == "BLACKHOLE") continue; //2
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
                    poseceni[this.serialize(susedi[i])].d = { d: poseceni.get(element).d + 1, p: this.serialize(element) }
                }
            }
        }
    }
    console.log("IZASLI IZ WHILEA");
    return null;
}

console.log(Teren.susedi({ q: 14, r: -14 }));
console.log(Teren.udaljenost({ q: -4, r: 1 }, { q: -3, r: -4 }))
export default Teren;
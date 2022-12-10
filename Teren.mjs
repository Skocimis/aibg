export const Teren = {}
Teren.DUZINA = 0;
Teren.poljePostojiFilter = function (polje, duzina = Teren.DUZINA) {
    return polje != null && Math.max(Math.max(Math.abs(polje.q), Math.abs(polje.r)), Math.abs(polje.s)) <= Math.floor(duzina / 2);
}
Teren.radeFilteri = function (vrednost, filteri) {
    for (let i in filteri) {
        if (!filteri[i](vrednost)) {
            return false;
        }
    }
    return true;
}
Teren.stringKoordinate = function (koordinate) {
    return koordinate.q + "," + koordinate.r + "," + koordinate.s;
}
Teren.severozapadnaKoordinata = function (pocetak, filteri = [Teren.poljePostojiFilter], udaljenost = 1) {
    let polje = { q: parseInt(pocetak.q), r: parseInt(pocetak.r - udaljenost), s: parseInt(pocetak.s + udaljenost) };
    if (Teren.radeFilteri(polje, filteri)) {
        return polje;
    }
    return null;
}
Teren.severoistocnaKoordinata = function (pocetak, filteri = [Teren.poljePostojiFilter], udaljenost = 1) {
    let polje = { q: parseInt(pocetak.q + udaljenost), r: parseInt(pocetak.r - udaljenost), s: parseInt(pocetak.s) };
    if (Teren.radeFilteri(polje, filteri)) {
        return polje;
    }
    return null;
}
Teren.jugozapadnaKoordinata = function (pocetak, filteri = [Teren.poljePostojiFilter], udaljenost = 1) {
    let polje = { q: parseInt(pocetak.q - udaljenost), r: parseInt(pocetak.r + udaljenost), s: parseInt(pocetak.s) };
    if (Teren.radeFilteri(polje, filteri)) {
        return polje;
    }
    return null;
}
Teren.jugoistocnaKoordinata = function (pocetak, filteri = [Teren.poljePostojiFilter], udaljenost = 1) {
    let polje = { q: parseInt(pocetak.q), r: parseInt(pocetak.r + udaljenost), s: parseInt(pocetak.s - udaljenost) };
    if (Teren.radeFilteri(polje, filteri)) {
        return polje;
    }
    return null;
}
Teren.zapadnaKoordinata = function (pocetak, filteri = [Teren.poljePostojiFilter], udaljenost = 1) {
    let polje = { q: parseInt(pocetak.q - udaljenost), r: parseInt(pocetak.r), s: parseInt(pocetak.s + udaljenost) };
    if (Teren.radeFilteri(polje, filteri)) {
        return polje;
    }
    return null;
}
Teren.istocnaKoordinata = function (pocetak, filteri = [Teren.poljePostojiFilter], udaljenost = 1) {
    let polje = { q: parseInt(pocetak.q + udaljenost), r: parseInt(pocetak.r), s: parseInt(pocetak.s - udaljenost) };
    if (Teren.radeFilteri(polje, filteri)) {
        return polje;
    }
    return null;
}
Teren.jednakeKoordinate = function (a, b) {
    return a && b && a.q == b.q && a.r == b.r && a.s == b.s;
}
Teren.smerPozicije = function (trenutna, sledeca) {
    if (this.jednakeKoordinate(this.istocnaKoordinata(trenutna), sledeca)) {
        return "e";
    }
    else if (this.jednakeKoordinate(this.zapadnaKoordinata(trenutna), sledeca)) {
        return "w";
    }
    else if (this.jednakeKoordinate(this.severoistocnaKoordinata(trenutna), sledeca)) {
        return "ne";
    }
    else if (this.jednakeKoordinate(this.severozapadnaKoordinata(trenutna), sledeca)) {
        return "nw";
    }
    else if (this.jednakeKoordinate(this.jugoistocnaKoordinata(trenutna), sledeca)) {
        return "se";
    }
    else if (this.jednakeKoordinate(this.jugozapadnaKoordinata(trenutna), sledeca)) {
        return "sw";
    }
    else {
        console.log("NIJE NASAO KOORDINATU");
        console.log(trenutna);
        console.log(sledeca);
    }
}
Teren.nizOkolnihKoordinata = function (polje, filteri = [Teren.poljePostojiFilter]) {
    return [Teren.severozapadnaKoordinata(polje, []), Teren.severoistocnaKoordinata(polje, []), Teren.istocnaKoordinata(polje, []), Teren.jugoistocnaKoordinata(polje, []), Teren.jugozapadnaKoordinata(polje, []), Teren.zapadnaKoordinata(polje, [])].filter(e => {
        return Teren.radeFilteri(e, filteri);
    });
}
Teren.udaljenostOdCentra = function (polje) {
    return parseInt((Math.abs(polje.q) + Math.abs(polje.r) + Math.abs(polje.s)) / 2);
}
Teren.udaljenostKoordinata = function (polje1, polje2) {
    return Teren.udaljenostOdCentra({
        q: parseInt(polje1.q - polje2.q),
        r: parseInt(polje1.r - polje2.r),
        s: parseInt(polje1.s - polje2.s)
    })
}
Teren.nizPoljaUOkolini = function (polje, epsilon = 1, filteri = [Teren.poljePostojiFilter]) {
    let svapolja = {};
    if (Teren.radeFilteri(polje, filteri)) {
        svapolja[Teren.stringKoordinate(polje)] = polje;
    }
    for (let i = 0; i < epsilon; i++) {
        for (let p in svapolja) {
            let okolna = Teren.nizOkolnihKoordinata(svapolja[p], filteri);
            for (let j in okolna) {
                let str = Teren.stringKoordinate(okolna[j]);
                if (!svapolja[str]) {
                    svapolja[str] = okolna[j];
                }
            }
        }
    }
    let niz = [];
    for (let i in svapolja) {
        niz.push(svapolja[i]);
    }
    return niz;
}

Teren.simetricnoPoljeVertikalnaOsa = function (polje, filteri = [Teren.poljePostojiFilter]) {
    if (polje == null) return null;
    let novo = { q: parseInt(-polje.s), r: parseInt(-polje.r), s: parseInt(-polje.q) };
    if (Teren.radeFilteri(novo, filteri))
        return novo;
    return null;
}
Teren.simetricnoPoljeHorizontalnaOsa = function (polje, filteri = [Teren.poljePostojiFilter]) {
    let novo = { q: parseInt(polje.s), r: parseInt(polje.r), s: parseInt(polje.q) };
    if (Teren.radeFilteri(novo, filteri))
        return novo;
    return null;
}
Teren.simetricnaPoljaHorizontalnaIVertikalnaOsa = function (polje) {
    let niz = [polje, Teren.simetricnoPoljeVertikalnaOsa(polje), Teren.simetricnoPoljeHorizontalnaOsa(polje), Teren.simetricnoPoljeVertikalnaOsa(Teren.simetricnoPoljeHorizontalnaOsa(polje))];
    niz = niz.filter(e => e != null);
    let mapa = {};
    for (let i in niz) {
        mapa[Teren.stringKoordinate(niz[i])] = niz[i];
    }
    niz = [];
    for (let i in mapa) {
        niz.push(mapa[i]);
    }
    return niz;
}


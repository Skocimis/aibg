export const SERVER_IP = "http://aibg2022.com:8081"
export const USERNAME = "Miki"
export const PASSWORD = "7@MHs&a+nK"

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function getJWTToken() {
    let token = await fetch(SERVER_IP + "/user/login", {
        body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST"
    });
    return (await token.json()).token;
}

export async function startGame(pozicija, mapa, minuti) {
    let trainRezultat = await fetch(SERVER_IP + "/game/train", {
        body: JSON.stringify({ time: minuti, playerIdx: pozicija, mapName: mapa }),
        headers: {
            "Content-Type": 'application/json',
            'Authorization': await getJWTToken()
        },
        method: "POST"
    });
    let trainJSON = await trainRezultat.json();
    let poruka = trainJSON.message;
    let startData = trainJSON.gameState;
    //console.log("P")
    //console.log(poruka)
    //console.log("P")
    //console.log(startData)

    let gameId;
    if (poruka.startsWith("Neuspesno kreiranje igre, igrac:Miki je vec u igri sa ID:")) {
        console.log("O!1")
        gameId = parseInt(poruka.replaceAll("Neuspesno kreiranje igre, igrac:Miki je vec u igri sa ID:", ""));
    }
    else if (poruka.startsWith("TrainingGame sa id-ijem: ")) {
        gameId = parseInt(poruka.replaceAll("TrainingGame sa id-ijem: ", "").replaceAll("uspešno napravljen."));
    }
    else {
        console.log("NEOBRADJENA PORUKA")
        console.log(poruka)
        return null;
    }
    console.log("gameId: " + gameId)

    if (startData)
        return { gameState: startData };


    //Joinuj
    let joinRezultat = await fetch(SERVER_IP + "/game/actionTrain", {
        headers: {
            "Content-Type": 'application/json',
            'Authorization': await getJWTToken()
        },
        method: "POST",
        body: JSON.stringify({ action: "move,-13,6" })
    });
    let joinJSON = (await joinRezultat.json())
    if (!joinJSON.gameState) {
        console.log("GRESKA");
        console.log(joinJSON);
        //Ilegalan potez vrv
        return null;
    }
    return joinJSON;
}

function parseAction(action) {
    if (action.type == "move") {
        return "move," + action.q + "," + action.r;
    }
}

export async function doActionTest(action) {
    let actionString = parseAction(action);

    let gotov = undefined;
    while (!gotov) {

        let akcijaRezultat = await fetch(SERVER_IP + "/game/actionTrain", {
            headers: {
                "Content-Type": 'application/json',
                'Authorization': await getJWTToken()
            },
            method: "POST",
            body: JSON.stringify({ action: actionString })
        });
        gotov = await akcijaRezultat.json();
    }
    return gotov;
}


/*export async function startGame(pozicija, mapa, minuti) {
    let trainRezultat = await fetch(SERVER_IP + "/game/train", {
        body: JSON.stringify({ time: minuti, playerIdx: pozicija, mapName: mapa }),
        headers: {
            "Content-Type": 'application/json',
            'Authorization': await getJWTToken()
        },
        method: "POST"
    });
    let poruka = (await trainRezultat.json()).message;
    let gameId;

    if (poruka.startsWith("Neuspesno kreiranje igre, igrac:Miki je vec u igri sa ID:")) {
        gameId = parseInt(poruka.replaceAll("Neuspesno kreiranje igre, igrac:Miki je vec u igri sa ID:", ""));
    }
    else {
        console.log("NEOBRADJENA PORUKA")
        console.log(poruka)
        return null;
    }

    //Joinuj

    let joinRezultat = await fetch(SERVER_IP + "/game/joinGame", {
        headers: {
            "Content-Type": 'application/json',
            'Authorization': await getJWTToken()
        },
        method: "GET"
    });
    let joinJSON = (await joinRezultat.json())
    console.log("JOINJSON");
    console.log(joinJSON)
    return gameId;
}
*/
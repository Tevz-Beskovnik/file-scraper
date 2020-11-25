/*
file parser pretvori .SPL text tako da se lahko lažje
uporablja in spreminja
*/
const fp = require("./fileParser");

/*
knjižnica z funkcijami za spreminjanje excel datotek
*/
const excel = require("./excel");

//incializacije excel kalse
let ex = new excel();

/*
podatki pretvorjeni iz .spl v berjiv javascript objekt ali tudi JSON.
*/
let form;

const map = {
    "ŠTEVILKA DOBAVNICE": 'stDobavnice',
    "DATUM": 'datum',
    "ŠTEVILKA NAROČILA": "stNarocila",
    "IME IN NASLOV KUPCA": "imeInNaslovKupca",
    "NAZIV IN KRAJ GRADBISCA": "nazivInKrajGradbisca",
    "KOLICINA BETONA V M3": "kolicinaBetonaVM3",
    "OZNAKA RECEPTURE": "oznakaRecepture",
    "ŠIFRA": "sifra",
    "TRDNOSTNI RAZRED": 'trdnostniRazred',
    "VRSTA BETONA": "vrstaBeton",
    "NAJVEČJE ZRNO AGREGATA": "največjeZrnoAgregata",
    "STOPNJA POSEDA": "stopnjaPoseda",
    "STOPNJA IZPOSTAVLJENOSTI": "stopnjaIzpostavljenosti",
    "RAZRED VSEBNOSTI KLORIDA": "razredVsebnostiKlorida",
    "DOD1": "dot1",
    "DOD2": "dot2",
    "DOD3": "dot3",
    "KOL1": "kol1",
    "KOL2": "kol2",
    "KOL3": "kol3",
    "OZNAKA CEMENTA": "oznakaCementa",
    "SKLADNOSTS S SIST": "skladnostSSist",
    "CAS STIKA PRVEGA CEMENTA Z VODO": "casStikaPrvegaCementaZVodo",
    "ČAS POLNJENJA V MIN": "casPolnjenjaVMin",
    "REGISTERSKA ŠTEVILKA AVTA": "registerskaŠtevilkaAvta",
    "PREDAL": "predal",
    "PREVZEL": "prevzel",
}

fp.parser("./out/Cas-11.46.58_Dat-2020-11-24.SPL", l => {
    let naslov;
    l[17].replace(/([0-9]+\w)|[0-9]+/g, x => naslov = x);
    let polniNaslov = l[17].split(naslov)[0] + naslov + l[14] + l[17].split(naslov+"  ")[1];
    polniNaslov = polniNaslov.split("  ").join(" ");
    let dot1 = Number(l[33].split("  ")[2]) != NaN || undefined ? l[33].split("  ")[2]: '', dot2 = Number(l[35].split("  ")[2]) != NaN || undefined ? l[35].split("  ")[2]: '', dot3 = Number(l[37].split("  ")[2]) != NaN || undefined ? l[37].split("  ")[2]: '';
    let kol1 =  l[33].split("  ")[3] != undefined ? l[33].split("  ")[3] : '', kol2 = l[35].split("  ")[3] != undefined ? l[35].split("  ")[3] : '', kol3 = l[37].split("  ")[3] != undefined ? l[37].split("  ")[3] : '';
    if(l[33].split("  ")[3] == undefined && l[35].split("  ")[3] == undefined && l[37].split("  ")[3] == undefined){
        kol1 = dot1, kol2 = dot2, kol3 = dot3;
        dot1 = "", dot2 = "", dot3 = "";
    }
    form = {
        someHeader: l[0],
        stDobavnice: l[5],
        datum: l[7],
        stNarocila: l[11],
        imeInNaslovKupca: polniNaslov,
        nazivInKrajGradbisca: l[22],
        nazivInKrajGradbisca2: l[23],
        kolicinaBetonaVM3: l[25],
        oznakaRecepture: l[27].split("  ")[0],
        sifra: l[27].split("  ")[1],
        trdostniRazred: l[29] != undefined ? l[29] : '',
        vrstaBetona: l[31] != undefined ? l[31] : '',
        največjeZrnoAgregata: l[33].split("  ")[1],
        stopnjaPoseda: l[35].split("  ")[1],
        stopnjaIzpostavljenosti: l[37].split("  ")[1],
        razredVsebnostiKlorida: l[39] != undefined ? l[39] : '',
        dodatki: {
            dot1: {
                dod: dot1,
                kol: kol1
            },
            dot2: {
                dod: dot2,
                kol: kol2
            },
            dot3: {
                dod: dot3,
                kol: kol3
            }
        },
        oznakaCementa: l[40],
        skladnostsSSist: l[43],
        casStikaPrvegaCementaZVodo: l[45].split("  ")[0],
        casPolnjenjaVMin: l[45].split("  ")[1],
        regŠtAvta: l[60],
        predal: l[64].split("  ")[0],
        prevzel: l[64].split("  ")[1]
    }
});

ex.writeXlsx("./out/xlsx/naročila.xlsx", );
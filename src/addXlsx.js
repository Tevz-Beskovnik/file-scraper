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
    "ŠTEVILKA DOBAVNICE": 'ŠTEVILKA DOBAVNICE',
    "DATUM": 'DATUM',
    "ŠTEVILKA NAROČILA": "ŠTEVILKA NAROČILA",
    "IME IN NASLOV KUPCA": "IME IN NASLOV KUPCA",
    "NAZIV IN KRAJ GRADBISCA": "NAZIV IN KRAJ GRADBISCA",
    "KOLICINA BETONA V M³": "KOLICINA BETONA V M³",
    "OZNAKA RECEPTURE": "OZNAKA RECEPTURE",
    "ŠIFRA": "ŠIFRA",
    "TRDNOSTNI RAZRED": 'TRDNOSTNI RAZRED',
    "VRSTA BETONA": "VRSTA BETONA",
    "OZNAKA CEMENTA": "OZNAKA CEMENTA",
    "REGISTERSKA ŠTEVILKA AVTA": "REGISTERSKA ŠTEVILKA AVTA",
    "PREDAL": "PREDAL",
    "PREVZEL": "PREVZEL",
}

module.exports = {
    "addFile": (file) => {
        fp.parser(file, l => {
            let naslov;
            l[17].replace(/([0-9]+\w)|[0-9]+/g, x => naslov = x != undefined ? x : ' ');
            let mesto = l[17].split(naslov+"  ")[1] != undefined ? l[17].split(naslov+"  ")[1] : ' ';
            let zip = l[14] != undefined ? l[14] : ' ';
            let polniNaslov = l[17].split(naslov)[0] + naslov + zip + mesto
            polniNaslov = polniNaslov.split("  ").join(" ");
            let ozR = l[27].split("  ")[1] != '' ? l[27].split("  ")[1] : '//';
            let sif = l[27].split("  ")[1] != '' ? l[27].split("  ")[1] : '//';
            let prevzel = l[64].split("  ")[2]
            prevzel = prevzel.split("")
            let form = {
                stDobavnice: l[5],
                datum: l[7],
                stNarocila: l[11],
                imeInNaslovKupca: polniNaslov,
                nazivInKrajGradbisca: l[22] != '' ? l[22] : '//',
                nazivInKrajGradbisca2: l[23] != '' ? l[23] : '//',
                kolicinaBetonaVM3: l[25],
                oznakaRecepture: ozR,
                sifra: sif,
                trdostniRazred: l[29] != '' ? l[29] : '//',
                vrstaBetona: l[31] != '' ? l[31] : '//',
                oznakaCementa: l[40] != '' ? l[40] : '//',
                regŠtAvta: l[60],
                predal: l[64].split("  ")[1],
                prevzel: prevzel[0]
            }
            
            ex.readXlsx("./out/xlsx/naročila.xlsx", map, rows => {
                let end = rows;

                console.log(l[25]);
                
                end.push({
                    "ŠTEVILKA DOBAVNICE": form.stDobavnice,
                    "DATUM": form.datum,
                    "ŠTEVILKA NAROČILA": form.stNarocila,
                    "IME IN NASLOV KUPCA": form.imeInNaslovKupca,
                    "NAZIV IN KRAJ GRADBISCA": form.nazivInKrajGradbisca,
                    "KOLICINA BETONA V M³": form.kolicinaBetonaVM3,
                    "OZNAKA RECEPTURE": form.oznakaRecepture,
                    "ŠIFRA": form.sifra,
                    "TRDNOSTNI RAZRED": form.trdostniRazred,
                    "VRSTA BETONA": form.vrstaBetona,
                    "OZNAKA CEMENTA": form.oznakaCementa,
                    "REGISTERSKA ŠTEVILKA AVTA": form.regŠtAvta,
                    "PREDAL": form.predal,
                    "PREVZEL": form.prevzel,
                });
                ex.writeXlsx("./out/xlsx/naročila.xlsx", end);
            });
        });
    }
}
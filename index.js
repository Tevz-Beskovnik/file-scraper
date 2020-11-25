/*---------------------------\
|           SPOOLER          |
| Program posebej narejen    |
| da od operacijskega sistema|
| ukrade .SPL datoteke, med  |
| printanjem, katere shrani  |
| za namene arhiviranja v    |
| naprej.                    |
----------------------------*/

/*



PROBAJ ZAGNAT PROGRAM V CMD



*/

//doda podatke datoteke v excel
const { addFile } = require("./src/addXlsx")

//util -> utility ¯\_(ツ)_/¯
const util = require('util');

/*
Dodajanje pomembnih knjižnic 
'child_process' je knjižnica namenjena 
za izvajanje ukazov in .exe filov izven programa
*/
const { spawn } = require('child_process');

//cwd izpeljana funkcija current working dir, izpiše trenutni direktorij v katerem dela
const { cwd } = require('process');

//knjižnica path
const path = require('path');

/*
'fs' knjižnica je namenjena z upravljanjem z datotečnim sistemom
pisanje, branje
*/
const fs = require('fs');

/*
imprtira classo pdf coverter
funcije v klasi:
 - clean(text with URI encoded caracter);
 - convPDF(.pdf datoteka, kje naj shrani pretvorjeno datoteko);
 - readXlsx(.xlsx datoteka, mapa -> kako naj izpiše vrednosti*, callback);
 - writeXlsx(.xlsx datoteka, vrstice za vpisat, širina stolpcev*);
*/

//spoolDir je kje se nahajajo začasne .spl datoteke za printanje
const spoolDir = "C:/Windows/System32/spool/PRINTERS";

//importirane readllina
const readline = require('readline');

//debug mode spremenljivka za debugganje
let debugMode = false;

//omogočanje vpisovanja v readline
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//za namene razvijanja nastaviš lahko ime izhodnega pdf dokumenta
let devName;

//omogočam pregled stiskov ključev
process.stdin.setRawMode(true);

/*
dokumenti je mapa kjer so dokumenti računalnika
*/
let dokumenti = cwd().split('\\');
dokumenti = dokumenti[0] + "/" + dokumenti[1] + "/" + dokumenti [2] + "/" + "Documents" + "/";

/*
definira output kot trenuten delujoči direktori + /out/,
če uporabnik nič ne vnese kot izhodni cilj (mapa)
*/
let output;

/*
definira priveti tiskalnikk ko microsoftov Print to PDF printer,
če uporabnik, nič ne vnese kot parameter
*/
let difPrinter;

/*
definira profil ime profila uporabnika, ki je na tem računalniku
*/

rl.question("Mapa za izhodne datoteke:", (anw) => {
    output = anw || cwd();
    console.log(output);
    rl.question("Tiskalnik:", (anw) => {
        difPrinter = anw || "Microsoft Print to PDF";
        console.log(difPrinter);
    });
})

//naredi write stream za debug logs
let debugLogs = fs.createWriteStream(cwd() + "/debug.log", {flags: 'a'});

/*
namenjen za razvijanje ni uporabniku uporabno 
z spodaj navedenimi ukazi se lahko spreminjajo mapa,
kjer se nahajajo .spl dokumenti, zapomni si, da bo .spl
dokumente zaznavalo samo takrat, ko bo izveden event: "change" oz.
"spremeni", ki nastane ob pisanju ali spreminjanju vsebine dokumenta.
lahko se tudi spremeni ime izhodne datoteke, zapomni si, če jih več
naredi, se bo novi zapisal čez starega
*/
rl.on('line', (line) => {
    let args = line.split(" ");
    let command = args[0];
    switch(command){
        case 'sDir':
            spoolDir = args[1];
        break;
        case 'devName':
            devName = args[1];
        break;
        case 'debug':
            debugMode = !debugMode;
            console.log(`debugMode set to: ${debugMode}`);
            console.log(cwd());
            console.log(dokumenti)
        break;
    }
});

//.watch je funkcija, ki aktivno pregleduje dan direktori za spremembe
function watcher(){
    let watching = fs.watch(spoolDir, (event, filename) => {
        //#region debugger
        debugMode ? debugLogs.write("IN WATCH FUNCTION\n") : '';
        debugMode ? debugLogs.write(new Date().toLocaleDateString('si-SI') + "-" + new Date().toLocaleTimeString('si-SI') + ": " + `fs.watch got event: "${event}", filename: "${filename}"` + "\n") : '';
        debugMode ? debugLogs.write(new Date().toLocaleDateString('si-SI') + "-" + new Date().toLocaleTimeString('si-SI') + ": " + `devName set to: "${devName}"` + "\n") : '';
        debugMode ? debugLogs.write(new Date().toLocaleDateString('si-SI') + "-" + new Date().toLocaleTimeString('si-SI') + ": " + `spoolDir set to: "${spoolDir}"` + "\n") : '';
        debugMode ? debugLogs.write(new Date().toLocaleDateString('si-SI') + "-" + new Date().toLocaleTimeString('si-SI') + ": " + `difPrinter set to: "${difPrinter}"` + "\n") : '';
        debugMode ? debugLogs.write(new Date().toLocaleDateString('si-SI') + "-" + new Date().toLocaleTimeString('si-SI') + ": " + dokumenti  + "\n") : '';
        //#endregion
        if(filename.split(".")[1].toUpperCase() == "SPL" && output != undefined && difPrinter != undefined && fs.existsSync(spoolDir+"/"+filename)){
            //naredi statistike za datoteko, da lahko pogledam velikost
            let stats = fs.statSync(spoolDir + "/" + filename);
            
            //več debuging
            debugMode ? debugLogs.write("IN CHECK FOR SPL FILE\n") : '';
            debugMode ? debugLogs.write(new Date().toLocaleDateString('si-SI') + "-" + new Date().toLocaleTimeString('si-SI') + ": " + "Document size: " + stats['size'] + "\n") : '';
            
            if(filename.split(".")[1].toUpperCase() == "SPL" && stats['size'] > 0){
                watching.close();

                //ustvari klaso datum, da lahko naredim ime z datumom in uro.
                debugMode ? debugLogs.write("IN CHECK FOR FILESIZE BIGGER THEN 0 BYTES\n") : '';
                let event = new Date();
                let name = devName || "Cas-" + event.toLocaleTimeString('si-SI').split(":").join(".") + "_Dat-" + event.toLocaleDateString('si-SI') + ".SPL";

                //debug
                debugMode ? debugLogs.write(new Date().toLocaleDateString('si-SI') + "-" + new Date().toLocaleTimeString('si-SI') + ": " + `New raw file name: "${name}"`  + "\n") : '';

                /*
                Kopira datoteko iz prevzete Windows make za začasne
                datoteke, ki se bodo predale printerju
                tukaj kopiram .SPL datoteko
                */
                let writter = fs.createWriteStream("./out/" + name)
                fs.createReadStream(spoolDir + "/" + filename).pipe(writter);

                //naredi novi podproces, ki izvede print na virtualnem printerju z pridobljeno spl datoteko
                writter.on("finish", () => {
                    if(fs.existsSync("./out/" + name)){
                        addFile(name)
                        /*setTimeout(() => {
                            fs.unlinkSync("./out/" + name);
                        }, 500)*/
                        watcher();
                    }
                });
            }
        }
    });
}

watcher();

var errorLog = fs.createWriteStream(cwd() + "/error.log", {flags: 'a'});

process.on('uncaughtException', (err) => {
    console.log('Cought error: ' + err);
    errorLog.write(util.format("Cought exception " + new Date().toLocaleDateString('si-SI') + "-" + new Date().toLocaleTimeString('si-SI') + ": " + err) + "\n");
});
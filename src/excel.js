/*-----------------------\
|       EXCEL.JS         |
| ta skripta pretvori    |
| .pdf dokumente v       |
| .xlsx format, ki ga    |
| nato prebere in shrani |
| v skupen dokument      |
| kjer razvrsti podatke  |
| po kupcih.             |
------------------------*/


/*
 - xlsx-writestream -- https://preview.npmjs.com/package/xlsx-writestream:
        refferaj temu za pisanje na xlsx, zgleda kr vrei

 - read-excel-file -- https://www.npmjs.com/package/read-excel-file:
        refferaj temu za branje xlsx datotek !!NI ZA GROZNO VELIKE SPREAD SHEETE!!
*/

//pretvori .pdf v .json podatke za lažje nadaljno formatiranje v .xlsx
const PDFParser = require("pdf2json");

//excel bralec
const readXlsxFile = require('read-excel-file/node');

//xlsx pisalec - piše na xlsx dokumente
const XLSXWriter = require('xlsx-writestream');

//fs - file system - datotečni sistem
const fs = require('fs');

class XlsxConverter {
    //now redundant due to not needing to conver pdfs anymore
    clean(text){
        /*
            Funkcija nareja da pretvori vse znake, ki so zaradi 
            nekega razloga bli URI encodani nazaj v utf-8 karakterje
            pač pdf je smart ¯\_(ツ)_/¯
        */
        const escapedSpecialChars = {
            "%E2%82%AC": "€",
            "%C5%A0": "Š",
            "%C5%A1": "š",
            "%C5%BD": "Ž",
            "%C5%BE": "ž",
            "%C4%8C": "Č",
            "%C4%8D": "č",
            "%C4%90": "Đ",
            "%C4%91": "đ",
            "%C3%9C": "Ü",
            "%C3%BC": "ü",
            "%C4%86": "Ć",
            "%C4%87": "ć",
            "%CB%99": "˙",
            "%CB%9B": "˛",
            "%C2%B0": "°",
            "%CB%98": "˘",
            "%CB%9D": "˝",
            "%C2%A8": "¨",
            "%CB%87": "ˇ",
            "%22": '"',
            "%23": "#",
            "%24": "$",
            "%25": "%",
            "%26": "&",
            "%2F": "/",
            "%28": "(",
            "%29": ")",
            "%3D": "=",
            "%27": "'",
            "%60": "`",
            "%5C": "\\", 
            "%7C": "|",
            "%40": "@",
            "%7B": "{",
            "%7D": "}",
            "%5E": "^",
            "%3A": ":",
            "%3B": ";",
            "%5B": "[",
            "%5D": "]",
            "%3C": "<",
            "%3E": ">",
            "%20": " ",
            "%2C": ",",
            "%21": "!",
            "%3F": "?",
            "%2B": "+"
        }

        /* 
            regular expressions:
            najde URI enkodirane znake, ki so našteti v zgornji konstanti
        */
        let regex = /%[234567][0C123456789ABDEF]|%[C][5432B]%[AB89][01DEC9B0876]|%E2%82%AC/g;

        /*
            zamenja enkodirane znake z navadnimi in jih vrne.
        */
        return text.replace(regex, c => escapedSpecialChars[c]);
    }

    //tudi reduntantno ker sploh ne shranjuem pdf več
    ConvPDF(file, output){

        //nov pdf parser
        let pdfParser = new PDFParser();

        //ime json datatoteke v katero se bo shranjevalo
        let jsonNewName = file.split(".");
        jsonNewName.pop();
        jsonNewName = jsonNewName.join(".");

        //loveljeneje errorov
        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

        //ko so podatki pripravljeni za izpisovanje
        pdfParser.on("pdfParser_dataReady", pdfData => {
            fs.writeFileSync(`${output}/${jsonNewName}`, JSON.stringify(pdfData));
        });
       
        
        //naloži podatke v datoteko
        pdfParser.loadPDF(`./out/${file}`);
    }

    readXlsx(file, map, callback){
        
        //preveri, če je spremenljivka mapa definirana
        if(map != undefined){

            //prebere, datoteko z mapo
            readXlsxFile(file, { map }).then(async ({ rows }) => {
                callback(await rows);
            });
        }else{

            //prebere datoteko brez mape
            readXlsxFile(file).then(async rows => {
                callback(await rows);
            });
        }
    }

    writeXlsx(file, rows, columnWidth) {
        let writter = new XLSXWriter(file, {});
        
        //file je lokacija datoteke.
        writter.getReadStream().pipe(fs.createWriteStream(file));
        
        /* 
        rows naj bo array objecktov, kjer so ključi imena stolpcev na vrhu in vrednosti, vrednosti v stolpcu
        */
        rows.map(r => {
            writter.addRow(r);
        });
        
        /*
        columnWidth naj bi bil array objecktov z ključem -> width: "x-vrednost"
        številka, ki bo podana za širino je mišljena o številu karakterjev karakterjih
        npr. [{
                width: 30
            }, 
            {
                width: 10
            }]
        */
        columnWidth ? writter.defineColumns(columnWidth) : '';
    
        writter.finalize();
    }
}

module.exports = XlsxConverter;
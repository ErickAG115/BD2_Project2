const express = require("express");
const router = express.Router();

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let contPages = 0;
let contCities = 0;

function getWeatherData(urlWeb, urlCiudad){
    return new Promise((resolve, reject) => {
        let datosAnuales = {};
        contPages += 1;
        console.log('Pagina #: ', contPages);
        request(urlWeb + urlCiudad,  function (err, resp, body){
            if (err) console.log('Error: ' + err);
            let $ = cheerio.load(body);
            let tbody = $('.medias').find('tr').toArray();
            // accedemos a cada dato en la columna
            let indexFila = 0;
            for(let tr of tbody){
                let td =$(tr).find('td').toArray()
                if (indexFila !== 0) { //para evitar el encabezado de th
                    let param = [];
                    let indexColumna = 0;
                    let year;
                    for (let text of td) {
                        let dato = $(text).text().trim();
                        if (indexColumna === 0) {
                            year = dato;
                        } else {
                            param.push(dato); //insertamos cada pais como clave y como valor un json de ciudades.
                        }
                        indexColumna += 1;
                    }
                    if (param[0] !== '-') { // Para evitar los años con datos vacíos.
                        datosAnuales[year] = param;
                    }

                }
                indexFila += 1;
            }
            // console.log(datosAnuales);
            resolve(datosAnuales);
        })
    });

}
function getCities(urlWeb, urlPais){
    return new Promise((resolve, reject) => {
        let ciudades = {}
        request(urlWeb + urlPais,  async function (err, resp, body){
            if (err) console.log('Error: ' + err);
            let $ = cheerio.load(body);
            contCities = 0;
            // accedemos a cada ciudad
            for(let elem of $('.mlistados a').toArray()){
                let ciudad = $(elem).text().trim(),
                    urlCiudad = $(elem).attr('href');

                ciudades[ciudad] = await getWeatherData(urlWeb, urlCiudad); //insertamos cada ciudad como clave y como valor un JSON con clave año y valor la lista de datos.

                if (Object.entries(ciudades[ciudad]).length !== 0){ //verifica si el datoAnual de la ciudad viene vacío.
                    contCities += 1;
                }
                if (contCities >= 20) {
                    contCities = 0;
                    break;
                }
            }
            resolve(ciudades);
        })
    });

}

function getCountries(urlWeb, urlContinente){
    return new Promise((resolve, reject) => {
        let paises = {}
        request(urlWeb + urlContinente,  async function (err, resp, body){
            if (err) console.log('Error: ' + err);
            let $ = cheerio.load(body);
            // accedemos a cada pais
            for(let elem of $('.mlistados a').toArray()){
                let pais = $(elem).text().trim(),
                    urlPais = $(elem).attr('href');
                paises[pais] = await getCities(urlWeb, urlPais); //insertamos cada pais como clave y como valor un json de ciudades.

            }
            resolve(paises);
        })
    });

}

router.get("/",   async function (req, res) {
    /*
    * datos = { year: [TM,TP, etc]...}
    * ciudad = {datos}
    * pais = {ciudad...}
    * continente = {pais...}
    * dataWeb = {continente...}
    *
    * Ejemplo:
    *       dataWeb = { 'America':
        *                       {'Canada':
        *                                   {'Ciudad':
        *                                               {
        *                                               '1997': ['1','4','3.5'],
        *                                               '1998': ['1','4','3.5'],
        *                                               '1999': ['1','4','3.5']
        *                                               }
        *                                   }
        *                       },
        *               'Asia':
        *                       {'China':
        *                                   {'Ciudad':
        *                                               {
        *                                               '1997': ['1','4','3.5'],
        *                                               '1998': ['1','4','3.5'],
        *                                               '1999': ['1','4','3.5']
        *                                               }
        *                                   }
        *                       }
    *                   }
    * */
    let dataWeb = {}
    const urlWeb = 'http://en.tutiempo.net';
    contPages = 0; // inicializamos de nuevo
    // let list = await getWeatherData(urlWeb, '/climate/ws-787613.html')
    // console.log(list);
    request(urlWeb + '/climate',  async function (err, resp, body){
        if (err) console.log('Error: ' + err);
        let $ = cheerio.load(body);
        // accedemos a cada continente
        for(let elem of $('.mlistados a').toArray()){
            let continente = $(elem).text().trim(),
                urlContinente = $(elem).attr('href');
            dataWeb[continente] = await getCountries(urlWeb, urlContinente, continente); //insertamos cada continente como clave y como valor una json de paises

        }
        let data = JSON.stringify(dataWeb);
        fs.writeFile('hadoopData.json', data, (err) => {
            if (err) throw err;
            console.log('Datos de '+ urlWeb+ ' guardados correctamente.');
            res.send(200);
        });

    });

});


router.get("/example", async (req, res) => {
    res.send(200);
});

router.get("/example/:name", async (req, res) => {
    let data = req.params.name;
    res.send(200);
});

router.post("/example", async (req, res) => {
    res.send(req.body);
});

module.exports = router;
const express = require("express");
const router = express.Router();

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

function getWeatherData(urlWeb, urlCiudad){
    return new Promise((resolve, reject) => {
        let datosAnuales = [];
        console.log(urlWeb + urlCiudad);
        request(urlWeb + urlCiudad,  function (err, resp, body){
            if (err) console.log('Error: ' + err);
            let $ = cheerio.load(body);
            let tbody = $('.medias').find('tr').toArray();
            // accedemos a cada pais
            for(let tr of tbody){
                let td =$(tr).find('td').toArray()

                let datos = [];
                for (let text of td) {
                    let dato = $(text).text().trim();
                    datos.push(dato); //insertamos cada pais como clave y como valor un json de ciudades.
                }
                datosAnuales.push(datos);

            }
            datosAnuales = datosAnuales.filter(datos => datos[1] !== '-' && datos.length !== 0 )
            console.log(datosAnuales);
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
            // accedemos a cada pais
            for(let elem of $('.mlistados a').toArray()){
                let ciudad = $(elem).text().trim();
                let urlCiudad = $(elem).attr('href');
                let listDatos = await getWeatherData(urlWeb, urlCiudad);
                ciudades[ciudad] = listDatos; //insertamos cada ciudad como clave y como valor una lista de listas de datos.
            }
            console.log(ciudades);

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
                let pais = $(elem).text().trim();
                let urlPais = $(elem).attr('href');
                let jsonCiudades = await getCities(urlWeb, urlPais);
                paises[pais] = jsonCiudades; //insertamos cada pais como clave y como valor un json de ciudades.

            }
            resolve(paises);
        })
    });

}

router.get("/",   async function (req, res) {
    /*
    * datos = TM,TP, etc
    * ciudad = {datos}
    * pais = {ciudad...}
    * continente = {pais...}
    * dataWeb = {continente...}
    *
    * */
    let dataWeb = {}
    const urlWeb = 'http://en.tutiempo.net';

    let list = await getWeatherData(urlWeb, '/climate/ws-136110.html')
    console.log(list);
    // let data = request(urlWeb + '/climate',  async function (err, resp, body){
    //     if (err) console.log('Error: ' + err);
    //     let $ = cheerio.load(body);
    //     // accedemos a cada continente
    //     for(let elem of $('.mlistados a').toArray()){
    //         let continente = $(elem).text().trim();
    //         let urlContinente = $(elem).attr('href');
    //         let jsonPaises = await getCountries(urlWeb, urlContinente, continente);
    //         dataWeb[continente] = jsonPaises; //insertamos cada continente como clave y como valor una json de paises
    //
    //     }
    //
    //     console.log(dataWeb);
    // })
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
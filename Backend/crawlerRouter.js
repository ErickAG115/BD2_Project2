const express = require("express");
const router = express.Router();

const request = require('request');
const cheerio = require('cheerio');

const urlWeb = 'http://en.tutiempo.net';

router.get("/",   function (req, res) {
    request(urlWeb + '/climate',  function (err, resp, body){
        if (err) console.log('Error: ' + err);
        let $ = cheerio.load(body);
        // accedemos a cada continente
        let listContinentes = [];
        let listURLContinentes = [];
        $('.mlistados a').each( function(){
            let continente = $(this).text().trim();
            let urlContinente = $(this).attr('href');
            listContinentes.push(continente)
            listURLContinentes.push(urlContinente)
        })
        console.log(listContinentes);

        // Accedemos a cada pais de cada continente
        listURLContinentes.forEach(url => {
            request(urlWeb + url,  function (err, resp, body){
                if (err) console.log('Error: ' + err);
                let $ = cheerio.load(body);
                let listPaises = [];
                let listURLPaises = [];
                $('.mlistados a').each(  function(){
                    let pais = $(this).text().trim();
                    let urlPais = $(this).attr('href');
                    listPaises.push(pais);
                    listURLPaises.push(urlPais)
                })
                console.log(listPaises)

                // Accedemos a cada ciudad de cada pais
                listURLPaises.forEach( url => {
                    request(urlWeb + url,  function (err, resp, body){
                        console.log(url)
                        if (err) console.log('Error: ' + err);
                        let $ = cheerio.load(body);
                        let listCiudad = [];
                        let listURLCiudad = [];
                        $('.mlistados a').each( function(){
                            console.log($(this).text())
                            let ciudad = $(this).text().trim();
                            let urlCiudad = $(this).attr('href');
                            listCiudad.push(ciudad);
                            listURLCiudad.push(urlCiudad)
                        })
                        console.log(listCiudad)


                    })
                })

            })
        })
    })

    //

    console.log("fin")
    res.send(200);
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
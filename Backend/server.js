//Inclusión de dependencias
const express = require("express");
const cors = require("cors");

//Inclusión de modelos y routers
const mariaDBRouter = require("./mariaDBRouter");
const crawlerRouter = require("./crawlerRouter");

//Creación de servidor y configuraciones
// const methodOverride = require("method-override");
const app = express();
app.use(cors());
// app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname));

// localhost:3000/mariaDB/example
// Ruta hacia el crud y las distintas consultas de la base de datos de MariaDB
app.use("/mariaDB", mariaDBRouter);
// Ruta para el web crawler
app.use("/crawler", crawlerRouter);

//Configuración de puerto
app.listen(3000);


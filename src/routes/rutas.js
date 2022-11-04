const express = require('express')                                  // instala express
const router = express.Router();                                    // habilita ruteo
const controladoresUsuarios = require('../controllers/controladoresUsuarios');       // importa controladores
const controladoresProductos = require('../controllers/controladoresProductos');       // importa controladores
const multer = require('multer');                                    // requiere multer en nuestro router
const path = require("path");
const estaLogeado = require("../middleware/estaLogeado");
const noEstaLogeado = require("../middleware/esAdmin");

const storage = multer.diskStorage({                                // configuración multer para guardar archivo imagen
    destination: function (req, file, cb) { 
       cb(null, path.join(__dirname, "../../public/images")); 
       
    }, 
    filename: function (req, file, cb) { 
       cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);  } 
  })

const uploadFile = multer({ storage });

router.get('/', controladoresProductos.index);                               // usa controlador.index al entrar a home

module.exports = router;                                            // exporta ruteador


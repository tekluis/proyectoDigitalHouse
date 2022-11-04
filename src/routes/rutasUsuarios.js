const express = require('express')                                  // instala express
const router = express.Router();                                    // habilita ruteo
const controladoresUsuarios = require('../controllers/controladoresUsuarios');       // importa controladores
const multer = require('multer');                                    // requiere multer en nuestro router
const path = require("path");
const estaLogeado = require("../middleware/estaLogeado");
const esAdmin = require("../middleware/esAdmin");
const {body} = require('express-validator');

const validateRegister = [
   body('nombre')
      .notEmpty().withMessage('Debes completar el nombre'),
   body('apellido')
      .notEmpty().withMessage('Debes completar el apeliido'),
   body('categoria')
      .notEmpty().withMessage('Debes completar la categoria'),
   body('email')
      .notEmpty().withMessage('Debes completar el email').bail()
      .isEmail().withMessage('Debe ser un email valido'),
   body('password')
      .notEmpty().withMessage('Debes completar el password').bail()
      .isLength({min:4}).withMessage('Debe tener al menos 4 caracteres')
]

const storage = multer.diskStorage({                                // configuración multer para guardar archivo imagen
    destination: function (req, file, cb) { 
       cb(null, path.join(__dirname, "../../public/images")); 
       
    }, 
    filename: function (req, file, cb) { 
       cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);  } 
  })

const uploadFile = multer({ storage });

router.get('/login', controladoresUsuarios.login);                          // usa controlador.login al entrar a /login
router.get('/register', controladoresUsuarios.register);
router.get('/list', controladoresUsuarios.usersList);
router.get('/detail/:id', controladoresUsuarios.userDetail);
router.get('/logout', controladoresUsuarios.salir);

router.post('/login', controladoresUsuarios.entrar);
router.post('/logout', controladoresUsuarios.salir);
router.post('/register', uploadFile.single('imagen'), validateRegister, controladoresUsuarios.crearUsuario);
router.delete('/list/:id', controladoresUsuarios.borrarUsuario);

module.exports = router;                                            // exporta ruteador


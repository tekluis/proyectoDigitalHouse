const express = require('express')                                  // instala express
const router = express.Router();                                    // habilita ruteo
const controladoresProductos = require('../controllers/controladoresProductos');       // importa controladores
const multer = require('multer');                                    // requiere multer en nuestro router
const path = require("path");
const estaLogeado = require("../middleware/estaLogeado");
const esAdmin = require("../middleware/esAdmin");
const {body} = require('express-validator');

const validateRegister = [
   body('nombre')
      .notEmpty().withMessage('Debes completar el nombre'),
   body('descuento')
      .notEmpty().withMessage('Debes completar el descuento'),
   body('categoria')
      .notEmpty().withMessage('Debes completar la categoria'),
   body('tamano')
      .notEmpty().withMessage('Debes completar el tamano'),
   body('precio')
      .notEmpty().withMessage('Debes completar el precio')
]

const storage = multer.diskStorage({                                // configuración multer para guardar archivo imagen
    destination: function (req, file, cb) { 
       cb(null, path.join(__dirname, "../../public/images")); 
       
    }, 
    filename: function (req, file, cb) { 
       cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);  } 
  })

const uploadFile = multer({ storage });

router.get('/cart', estaLogeado, controladoresProductos.productCart);
router.get('/detail/:id', controladoresProductos.productDetail);
router.get('/create', esAdmin, controladoresProductos.productCreate);
router.get('/edit/:id', esAdmin, controladoresProductos.productEdit);
router.get('/list/plantas', controladoresProductos.plantasList);
router.get('/list/macetas', controladoresProductos.macetasList);
router.get('/list', controladoresProductos.productList);
router.get('/comprar', controladoresProductos.comprar);


router.post('/cart', controladoresProductos.finalizarCompra);
router.post('/detail/:id', controladoresProductos.agregarCarrito);
router.post('/create', uploadFile.single('imagen'), validateRegister, controladoresProductos.crearProducto);
router.put('/edit/:id', uploadFile.single('imagen'), controladoresProductos.actualizarProducto);
router.delete('/edit/:id', esAdmin, controladoresProductos.borrarProducto);
router.delete('/cart/:id', controladoresProductos.borrarCarrito);

module.exports = router;                                            // exporta ruteador


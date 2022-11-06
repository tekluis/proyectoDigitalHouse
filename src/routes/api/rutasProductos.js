const express = require('express');
const router = express.Router();

const apiControladoresProductos = require('../../controllers/api/apiControladoresProductos');

router.get('/', apiControladoresProductos.list);
router.get('/:id', apiControladoresProductos.detail);

router.post('/create', apiControladoresProductos.create);
router.delete('/:id', apiControladoresProductos.delete);


module.exports = router;
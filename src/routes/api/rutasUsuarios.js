const express = require('express');
const router = express.Router();

const apiControladoresUsuarios = require('../../controllers/api/apiControladoresUsuarios');

router.get('/', apiControladoresUsuarios.list);
router.get('/:id', apiControladoresUsuarios.detail);

module.exports = router;
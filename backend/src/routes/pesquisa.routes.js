const express = require('express');
const router = express.Router();
const { pesquisar } = require('../controllers/pesquisa.controller');

router.get('/', pesquisar);

module.exports = router;

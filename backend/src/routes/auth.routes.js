const express = require('express');
const router = express.Router();
const { registar, login, eu } = require('../controllers/auth.controller');
const verificarToken = require('../middleware/auth.middleware');

router.post('/registar', registar);
router.post('/login', login);
router.get('/eu', verificarToken, eu);

module.exports = router;

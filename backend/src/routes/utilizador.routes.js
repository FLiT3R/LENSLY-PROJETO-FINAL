const express = require('express');
const router = express.Router();
const { alternarSeguir, listarSeguidores } = require('../controllers/seguidor.controller');
const { obterPerfil, atualizarPerfil } = require('../controllers/utilizador.controller');
const verificarToken = require('../middleware/auth.middleware');
const autenticacaoOpcional = require('../middleware/authOpcional.middleware');
const upload = require('../config/multer');

// IMPORTANTE: /perfil (rota fixa) tem de vir antes de /:id (rota dinamica)
router.put('/perfil', verificarToken, upload.single('foto'), atualizarPerfil);

router.get('/:id', autenticacaoOpcional, obterPerfil);
router.post('/:id/seguir', verificarToken, alternarSeguir);
router.get('/:id/seguidores', listarSeguidores);

module.exports = router;

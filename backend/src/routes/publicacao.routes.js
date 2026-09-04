const express = require('express');
const router = express.Router();
const { criar, listar, feed, obterPorId, atualizar, apagar } = require('../controllers/publicacao.controller');
const { alternarLike } = require('../controllers/like.controller');
const { listar: listarComentarios, criar: criarComentario } = require('../controllers/comentario.controller');
const verificarToken = require('../middleware/auth.middleware');
const autenticacaoOpcional = require('../middleware/authOpcional.middleware');
const upload = require('../config/multer');

// IMPORTANTE: /feed tem de vir antes de /:id
router.get('/feed', verificarToken, feed);

router.get('/', autenticacaoOpcional, listar);
router.get('/:id', autenticacaoOpcional, obterPorId);
router.post('/', verificarToken, upload.single('media'), criar);
router.put('/:id', verificarToken, atualizar);
router.delete('/:id', verificarToken, apagar);

router.post('/:id/like', verificarToken, alternarLike);
router.get('/:id/comentarios', listarComentarios);
router.post('/:id/comentarios', verificarToken, criarComentario);

module.exports = router;

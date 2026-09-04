const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

router.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Servidor Lensly a funcionar' });
});

router.get('/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', mensagem: 'Ligacao a base de dados funciona' });
  } catch (erro) {
    res.status(500).json({ status: 'erro', mensagem: 'Nao foi possivel ligar a base de dados', detalhe: erro.message });
  }
});

module.exports = router;

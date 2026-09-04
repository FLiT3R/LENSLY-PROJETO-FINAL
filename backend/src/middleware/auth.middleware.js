const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const cabecalhoAuth = req.headers.authorization;
  if (!cabecalhoAuth || !cabecalhoAuth.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'erro', mensagem: 'Token nao fornecido. Faz login primeiro.' });
  }
  const token = cabecalhoAuth.split(' ')[1];
  try {
    req.utilizador = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ status: 'erro', mensagem: 'Token invalido ou expirado. Faz login outra vez.' });
  }
}

module.exports = verificarToken;

const jwt = require('jsonwebtoken');

function autenticacaoOpcional(req, res, next) {
  const cabecalhoAuth = req.headers.authorization;
  if (cabecalhoAuth && cabecalhoAuth.startsWith('Bearer ')) {
    const token = cabecalhoAuth.split(' ')[1];
    try {
      req.utilizador = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      req.utilizador = null;
    }
  } else {
    req.utilizador = null;
  }
  next();
}

module.exports = autenticacaoOpcional;

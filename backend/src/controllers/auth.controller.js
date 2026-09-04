const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

function gerarToken(utilizador) {
  return jwt.sign(
    { id: utilizador.id, email: utilizador.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function semPassword(utilizador) {
  const { password, ...resto } = utilizador;
  return resto;
}

async function registar(req, res) {
  try {
    const { nome, email, password, bio } = req.body;
    if (!nome || !email || !password) {
      return res.status(400).json({ status: 'erro', mensagem: 'Nome, email e password sao obrigatorios.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ status: 'erro', mensagem: 'A password deve ter pelo menos 6 caracteres.' });
    }
    const jaExiste = await prisma.utilizador.findUnique({ where: { email } });
    if (jaExiste) {
      return res.status(409).json({ status: 'erro', mensagem: 'Ja existe uma conta registada com este email.' });
    }
    const passwordEncriptada = await bcrypt.hash(password, 10);
    const novoUtilizador = await prisma.utilizador.create({
      data: { nome, email, password: passwordEncriptada, bio: bio || null },
    });
    const token = gerarToken(novoUtilizador);
    return res.status(201).json({ status: 'ok', mensagem: 'Conta criada com sucesso.', token, utilizador: semPassword(novoUtilizador) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao criar a conta.', detalhe: erro.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'erro', mensagem: 'Email e password sao obrigatorios.' });
    }
    const utilizador = await prisma.utilizador.findUnique({ where: { email } });
    if (!utilizador) return res.status(401).json({ status: 'erro', mensagem: 'Email ou password incorretos.' });
    const passwordCorreta = await bcrypt.compare(password, utilizador.password);
    if (!passwordCorreta) return res.status(401).json({ status: 'erro', mensagem: 'Email ou password incorretos.' });
    const token = gerarToken(utilizador);
    return res.json({ status: 'ok', mensagem: 'Login efetuado com sucesso.', token, utilizador: semPassword(utilizador) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao fazer login.', detalhe: erro.message });
  }
}

async function eu(req, res) {
  try {
    const utilizador = await prisma.utilizador.findUnique({ where: { id: req.utilizador.id } });
    if (!utilizador) return res.status(404).json({ status: 'erro', mensagem: 'Utilizador nao encontrado.' });
    return res.json({ status: 'ok', utilizador: semPassword(utilizador) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao obter utilizador.' });
  }
}

module.exports = { registar, login, eu };

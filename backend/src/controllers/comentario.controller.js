const prisma = require('../config/prisma');

async function listar(req, res) {
  try {
    const idPublicacao = Number(req.params.id);
    const comentarios = await prisma.comentario.findMany({
      where: { idPublicacao },
      orderBy: { data: 'asc' },
      include: { utilizador: true },
    });
    return res.json({
      status: 'ok',
      comentarios: comentarios.map((c) => ({
        id: c.id, texto: c.texto, data: c.data,
        autor: { id: c.utilizador.id, nome: c.utilizador.nome, fotoPerfil: c.utilizador.fotoPerfil || null },
      })),
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao listar comentarios.' });
  }
}

async function criar(req, res) {
  try {
    const idPublicacao = Number(req.params.id);
    const { texto } = req.body;
    if (!texto || !texto.trim()) {
      return res.status(400).json({ status: 'erro', mensagem: 'O comentario nao pode estar vazio.' });
    }
    const publicacao = await prisma.publicacao.findUnique({ where: { id: idPublicacao } });
    if (!publicacao) return res.status(404).json({ status: 'erro', mensagem: 'Publicacao nao encontrada.' });

    const comentario = await prisma.comentario.create({
      data: { idPublicacao, idUtilizador: req.utilizador.id, texto: texto.trim() },
      include: { utilizador: true },
    });

    return res.status(201).json({
      status: 'ok',
      comentario: {
        id: comentario.id, texto: comentario.texto, data: comentario.data,
        autor: { id: comentario.utilizador.id, nome: comentario.utilizador.nome, fotoPerfil: comentario.utilizador.fotoPerfil || null },
      },
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao criar comentario.' });
  }
}

module.exports = { listar, criar };

const prisma = require('../config/prisma');

// GET /api/utilizadores/:id (publica, autenticacao opcional para saber "aSeguir")
async function obterPerfil(req, res) {
  try {
    const id = Number(req.params.id);
    const utilizador = await prisma.utilizador.findUnique({
      where: { id },
      include: {
        publicacoes: {
          orderBy: { data: 'desc' },
          include: { _count: { select: { likes: true, comentarios: true } } },
        },
        _count: { select: { seguidoPor: true, aSeguir: true } },
      },
    });

    if (!utilizador) return res.status(404).json({ status: 'erro', mensagem: 'Utilizador nao encontrado.' });

    let aSeguir = false;
    if (req.utilizador) {
      const relacao = await prisma.seguidor.findUnique({
        where: { idSeguidor_idSeguido: { idSeguidor: req.utilizador.id, idSeguido: id } },
      });
      aSeguir = !!relacao;
    }

    return res.json({
      status: 'ok',
      utilizador: {
        id: utilizador.id,
        nome: utilizador.nome,
        bio: utilizador.bio,
        fotoPerfil: utilizador.fotoPerfil,
        dataRegisto: utilizador.dataRegisto,
        totalSeguidores: utilizador._count.seguidoPor,
        totalASeguir: utilizador._count.aSeguir,
        aSeguir,
        publicacoes: utilizador.publicacoes.map((p) => ({
          id: p.id, tipo: p.tipo, urlMedia: p.urlMedia, descricao: p.descricao, data: p.data,
          totalLikes: p._count.likes, totalComentarios: p._count.comentarios,
        })),
      },
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao obter perfil.' });
  }
}

// PUT /api/utilizadores/perfil (protegida) - atualizar nome, bio e/ou foto de perfil
async function atualizarPerfil(req, res) {
  try {
    const dados = {};
    if (req.body.nome) dados.nome = req.body.nome;
    if (req.body.bio !== undefined) dados.bio = req.body.bio;
    if (req.file) dados.fotoPerfil = `/uploads/${req.file.filename}`;

    const atualizado = await prisma.utilizador.update({
      where: { id: req.utilizador.id },
      data: dados,
    });

    const { password, ...semPassword } = atualizado;
    return res.json({ status: 'ok', mensagem: 'Perfil atualizado.', utilizador: semPassword });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao atualizar perfil.' });
  }
}

module.exports = { obterPerfil, atualizarPerfil };

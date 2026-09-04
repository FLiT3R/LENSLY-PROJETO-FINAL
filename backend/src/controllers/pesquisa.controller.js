const prisma = require('../config/prisma');

async function pesquisar(req, res) {
  try {
    const termo = (req.query.q || '').trim();
    if (!termo) {
      return res.status(400).json({ status: 'erro', mensagem: 'Indica um termo de pesquisa (?q=...).' });
    }

    const [utilizadores, publicacoesPorDescricao, publicacoesPorTag] = await Promise.all([
      prisma.utilizador.findMany({ where: { nome: { contains: termo } }, take: 20 }),
      prisma.publicacao.findMany({
        where: { descricao: { contains: termo } },
        include: { utilizador: true, tags: { include: { tag: true } }, _count: { select: { likes: true, comentarios: true } } },
        orderBy: { data: 'desc' }, take: 30,
      }),
      prisma.publicacao.findMany({
        where: { tags: { some: { tag: { nome: { contains: termo.toLowerCase() } } } } },
        include: { utilizador: true, tags: { include: { tag: true } }, _count: { select: { likes: true, comentarios: true } } },
        orderBy: { data: 'desc' }, take: 30,
      }),
    ]);

    const mapaPublicacoes = new Map();
    [...publicacoesPorDescricao, ...publicacoesPorTag].forEach((p) => mapaPublicacoes.set(p.id, p));
    const publicacoes = Array.from(mapaPublicacoes.values()).map((p) => ({
      id: p.id, tipo: p.tipo, urlMedia: p.urlMedia, descricao: p.descricao, data: p.data,
      autor: { id: p.utilizador.id, nome: p.utilizador.nome, fotoPerfil: p.utilizador.fotoPerfil || null },
      tags: p.tags.map((t) => t.tag.nome),
      totalLikes: p._count.likes, totalComentarios: p._count.comentarios,
    }));

    return res.json({
      status: 'ok',
      termo,
      utilizadores: utilizadores.map((u) => ({ id: u.id, nome: u.nome, bio: u.bio, fotoPerfil: u.fotoPerfil || null })),
      publicacoes,
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao pesquisar.' });
  }
}

module.exports = { pesquisar };

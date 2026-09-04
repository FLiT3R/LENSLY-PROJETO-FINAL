const prisma = require('../config/prisma');

function formatarAutor(u) {
  if (!u) return undefined;
  return { id: u.id, nome: u.nome, fotoPerfil: u.fotoPerfil || null };
}

function formatarPublicacao(publicacao) {
  return {
    id: publicacao.id,
    tipo: publicacao.tipo,
    urlMedia: publicacao.urlMedia,
    descricao: publicacao.descricao,
    data: publicacao.data,
    autor: formatarAutor(publicacao.utilizador),
    tags: publicacao.tags ? publicacao.tags.map((t) => t.tag.nome) : [],
    totalLikes: publicacao._count ? publicacao._count.likes : undefined,
    totalComentarios: publicacao._count ? publicacao._count.comentarios : undefined,
    gostei: Array.isArray(publicacao.likes) ? publicacao.likes.length > 0 : undefined,
  };
}

function includeComLike(idUtilizadorAtual) {
  const include = {
    utilizador: true,
    tags: { include: { tag: true } },
    _count: { select: { likes: true, comentarios: true } },
  };
  if (idUtilizadorAtual) {
    include.likes = { where: { idUtilizador: idUtilizadorAtual } };
  }
  return include;
}

async function criar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'erro', mensagem: 'Tens de enviar uma foto ou video.' });
    }
    const { descricao, tags } = req.body;
    const tipo = req.file.mimetype.startsWith('video/') ? 'video' : 'foto';
    const urlMedia = `/uploads/${req.file.filename}`;

    const novaPublicacao = await prisma.publicacao.create({
      data: { idUtilizador: req.utilizador.id, tipo, urlMedia, descricao: descricao || null },
    });

    if (tags) {
      const nomesTags = tags.split(',').map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0);
      for (const nomeTag of nomesTags) {
        const tag = await prisma.tag.upsert({ where: { nome: nomeTag }, update: {}, create: { nome: nomeTag } });
        await prisma.publicacaoTag.create({ data: { idPublicacao: novaPublicacao.id, idTag: tag.id } });
      }
    }

    const publicacaoCompleta = await prisma.publicacao.findUnique({
      where: { id: novaPublicacao.id },
      include: includeComLike(req.utilizador.id),
    });

    return res.status(201).json({ status: 'ok', mensagem: 'Publicacao criada com sucesso.', publicacao: formatarPublicacao(publicacaoCompleta) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao criar publicacao.', detalhe: erro.message });
  }
}

async function listar(req, res) {
  try {
    const idUtilizadorAtual = req.utilizador ? req.utilizador.id : null;
    const publicacoes = await prisma.publicacao.findMany({
      orderBy: { data: 'desc' },
      include: includeComLike(idUtilizadorAtual),
    });
    return res.json({ status: 'ok', publicacoes: publicacoes.map(formatarPublicacao) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao listar publicacoes.' });
  }
}

async function feed(req, res) {
  try {
    const idUtilizadorAtual = req.utilizador.id;
    const seguidos = await prisma.seguidor.findMany({ where: { idSeguidor: idUtilizadorAtual }, select: { idSeguido: true } });
    const idsSeguidos = seguidos.map((s) => s.idSeguido);

    if (idsSeguidos.length === 0) {
      return res.json({ status: 'ok', publicacoes: [], mensagem: 'Ainda nao segues ninguem. Segue outros utilizadores para veres o feed preenchido.' });
    }

    const publicacoes = await prisma.publicacao.findMany({
      where: { idUtilizador: { in: idsSeguidos } },
      orderBy: { data: 'desc' },
      include: includeComLike(idUtilizadorAtual),
    });

    return res.json({ status: 'ok', publicacoes: publicacoes.map(formatarPublicacao) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao carregar o feed.' });
  }
}

async function obterPorId(req, res) {
  try {
    const idUtilizadorAtual = req.utilizador ? req.utilizador.id : null;
    const publicacao = await prisma.publicacao.findUnique({
      where: { id: Number(req.params.id) },
      include: includeComLike(idUtilizadorAtual),
    });
    if (!publicacao) return res.status(404).json({ status: 'erro', mensagem: 'Publicacao nao encontrada.' });
    return res.json({ status: 'ok', publicacao: formatarPublicacao(publicacao) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao obter publicacao.' });
  }
}

async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const publicacao = await prisma.publicacao.findUnique({ where: { id } });
    if (!publicacao) return res.status(404).json({ status: 'erro', mensagem: 'Publicacao nao encontrada.' });
    if (publicacao.idUtilizador !== req.utilizador.id) {
      return res.status(403).json({ status: 'erro', mensagem: 'So podes editar as tuas proprias publicacoes.' });
    }
    const atualizada = await prisma.publicacao.update({ where: { id }, data: { descricao: req.body.descricao ?? publicacao.descricao } });
    return res.json({ status: 'ok', mensagem: 'Publicacao atualizada.', publicacao: atualizada });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao atualizar publicacao.' });
  }
}

async function apagar(req, res) {
  try {
    const id = Number(req.params.id);
    const publicacao = await prisma.publicacao.findUnique({ where: { id } });
    if (!publicacao) return res.status(404).json({ status: 'erro', mensagem: 'Publicacao nao encontrada.' });
    if (publicacao.idUtilizador !== req.utilizador.id) {
      return res.status(403).json({ status: 'erro', mensagem: 'So podes apagar as tuas proprias publicacoes.' });
    }
    await prisma.publicacao.delete({ where: { id } });
    return res.json({ status: 'ok', mensagem: 'Publicacao apagada.' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao apagar publicacao.' });
  }
}

module.exports = { criar, listar, feed, obterPorId, atualizar, apagar };

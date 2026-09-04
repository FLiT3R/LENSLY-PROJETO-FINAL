const prisma = require('../config/prisma');

async function alternarLike(req, res) {
  try {
    const idPublicacao = Number(req.params.id);
    const idUtilizador = req.utilizador.id;

    const publicacao = await prisma.publicacao.findUnique({ where: { id: idPublicacao } });
    if (!publicacao) return res.status(404).json({ status: 'erro', mensagem: 'Publicacao nao encontrada.' });

    const likeExistente = await prisma.like.findUnique({
      where: { idPublicacao_idUtilizador: { idPublicacao, idUtilizador } },
    });

    let gostei;
    if (likeExistente) {
      await prisma.like.delete({ where: { id: likeExistente.id } });
      gostei = false;
    } else {
      await prisma.like.create({ data: { idPublicacao, idUtilizador } });
      gostei = true;
    }

    const totalLikes = await prisma.like.count({ where: { idPublicacao } });
    return res.json({ status: 'ok', gostei, totalLikes });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao processar o like.' });
  }
}

module.exports = { alternarLike };

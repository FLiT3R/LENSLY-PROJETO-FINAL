const prisma = require('../config/prisma');

async function alternarSeguir(req, res) {
  try {
    const idSeguido = Number(req.params.id);
    const idSeguidor = req.utilizador.id;

    if (idSeguido === idSeguidor) {
      return res.status(400).json({ status: 'erro', mensagem: 'Nao podes seguir-te a ti proprio.' });
    }
    const utilizadorAlvo = await prisma.utilizador.findUnique({ where: { id: idSeguido } });
    if (!utilizadorAlvo) return res.status(404).json({ status: 'erro', mensagem: 'Utilizador nao encontrado.' });

    const relacaoExistente = await prisma.seguidor.findUnique({
      where: { idSeguidor_idSeguido: { idSeguidor, idSeguido } },
    });

    let aSeguir;
    if (relacaoExistente) {
      await prisma.seguidor.delete({ where: { idSeguidor_idSeguido: { idSeguidor, idSeguido } } });
      aSeguir = false;
    } else {
      await prisma.seguidor.create({ data: { idSeguidor, idSeguido } });
      aSeguir = true;
    }

    const totalSeguidores = await prisma.seguidor.count({ where: { idSeguido } });
    return res.json({ status: 'ok', aSeguir, totalSeguidores });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao seguir/deixar de seguir.' });
  }
}

async function listarSeguidores(req, res) {
  try {
    const idSeguido = Number(req.params.id);
    const registos = await prisma.seguidor.findMany({ where: { idSeguido }, include: { seguidor: true } });
    return res.json({
      status: 'ok',
      seguidores: registos.map((r) => ({ id: r.seguidor.id, nome: r.seguidor.nome, fotoPerfil: r.seguidor.fotoPerfil || null })),
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'erro', mensagem: 'Erro ao listar seguidores.' });
  }
}

module.exports = { alternarSeguir, listarSeguidores };

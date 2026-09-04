// Script de seed: cria 15 utilizadores fotógrafos/videomakers com
// publicações, seguidores, likes e comentários, para o feed ter
// conteudo logo a seguir a `npx prisma db seed`.
//
// Correr com: npm run prisma:seed  (a partir da pasta backend)

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PASSWORD_PADRAO = 'lensly123';

const UTILIZADORES = [
  { nome: 'Ana Ferreira', email: 'ana.ferreira@lensly.pt', bio: 'Fotografia de rua em Lisboa. Prefiro luz dura e sombras longas.' },
  { nome: 'Miguel Costa', email: 'miguel.costa@lensly.pt', bio: 'Videomaker. Documentários curtos sobre ofícios tradicionais.' },
  { nome: 'Beatriz Sousa', email: 'beatriz.sousa@lensly.pt', bio: 'Retrato analógico, filme a preto e branco, sempre em Ilford HP5.' },
  { nome: 'Tiago Almeida', email: 'tiago.almeida@lensly.pt', bio: 'Paisagens do Alentejo ao nascer do sol. Madrugador profissional.' },
  { nome: 'Carolina Rocha', email: 'carolina.rocha@lensly.pt', bio: 'Casamentos e eventos. A capturar o momento antes de perguntarem.' },
  { nome: 'Rui Martins', email: 'rui.martins@lensly.pt', bio: 'Arquitetura e linhas. Porto é o meu estúdio a céu aberto.' },
  { nome: 'Inês Pereira', email: 'ines.pereira@lensly.pt', bio: 'Still life e produto. Café, filme e pouco mais.' },
  { nome: 'André Silva', email: 'andre.silva@lensly.pt', bio: 'Surf e desporto de ação. Câmara à prova de água, sempre.' },
  { nome: 'Mariana Lopes', email: 'mariana.lopes@lensly.pt', bio: 'Moda e retrato editorial. A explorar cor e contraste.' },
  { nome: 'Diogo Fernandes', email: 'diogo.fernandes@lensly.pt', bio: 'Vídeo institucional e corporativo. Freelancer desde 2019.' },
  { nome: 'Sofia Carvalho', email: 'sofia.carvalho@lensly.pt', bio: 'Natureza e vida selvagem no Gerês. Paciência é o meu equipamento principal.' },
  { nome: 'Bruno Ribeiro', email: 'bruno.ribeiro@lensly.pt', bio: 'Fotografia de concertos. Sempre na primeira fila, sempre no escuro.' },
  { nome: 'Joana Teixeira', email: 'joana.teixeira@lensly.pt', bio: 'Minimalismo urbano. Menos é mais, sempre foi.' },
  { nome: 'Pedro Nunes', email: 'pedro.nunes@lensly.pt', bio: 'Drone e vistas aéreas. A ver Portugal de cima desde 2021.' },
  { nome: 'Catarina Gomes', email: 'catarina.gomes@lensly.pt', bio: 'Retratos de família em luz natural. Sem poses forçadas.' },
];

const DESCRICOES = [
  'Luz da tarde a fazer o trabalho todo.',
  'Uma hora à espera desta sombra passar aqui.',
  'Rolo revelado esta semana, ainda a escolher favoritas.',
  'Testado o novo objetivo, gostei do resultado.',
  'Voltar a este sítio sempre que consigo.',
  'Sem edição, direto da câmara.',
  'A cor natural do fim de tarde, sem filtros.',
  'Primeira vez a disparar com filme neste ano.',
  'Um dia de trabalho, um enquadramento que ficou.',
  'Composição simples, é o que funciona melhor aqui.',
];

const CONJUNTOS_TAGS = [
  ['rua', 'lisboa', 'pretoebranco'],
  ['retrato', 'filme', 'analogico'],
  ['paisagem', 'alentejo', 'nascerdosol'],
  ['arquitetura', 'porto', 'linhas'],
  ['natureza', 'geres', 'vidaselvagem'],
  ['minimal', 'urbano'],
  ['viagem', 'luznatural'],
  ['video', 'documentario'],
];

const COMENTARIOS = [
  'Que composição incrível!',
  'Adoro a luz nesta foto.',
  'As cores estão fantásticas.',
  'Onde é que foi tirada?',
  'Trabalho muito consistente, parabéns.',
  'Isto merecia estar impresso em grande.',
];

function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function imagemAleatoria(semente) {
  return `https://picsum.photos/seed/lensly-${semente}/900/900`;
}

async function main() {
  console.log('A criar utilizadores de demonstração...');
  const passwordEncriptada = await bcrypt.hash(PASSWORD_PADRAO, 10);

  const utilizadoresCriados = [];
  for (let i = 0; i < UTILIZADORES.length; i++) {
    const dados = UTILIZADORES[i];
    const utilizador = await prisma.utilizador.upsert({
      where: { email: dados.email },
      update: {},
      create: {
        nome: dados.nome,
        email: dados.email,
        password: passwordEncriptada,
        bio: dados.bio,
        fotoPerfil: imagemAleatoria(`avatar-${i}`),
      },
    });
    utilizadoresCriados.push(utilizador);
    console.log(`  ✓ ${utilizador.nome}`);
  }

  console.log('A criar publicações...');
  const publicacoesCriadas = [];
  for (let i = 0; i < utilizadoresCriados.length; i++) {
    const utilizador = utilizadoresCriados[i];
    const numPublicacoes = 2 + Math.floor(Math.random() * 2); // 2 ou 3

    for (let j = 0; j < numPublicacoes; j++) {
      const publicacao = await prisma.publicacao.create({
        data: {
          idUtilizador: utilizador.id,
          tipo: 'foto',
          urlMedia: imagemAleatoria(`post-${i}-${j}`),
          descricao: aleatorio(DESCRICOES),
          data: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
        },
      });

      const nomesTags = aleatorio(CONJUNTOS_TAGS);
      for (const nomeTag of nomesTags) {
        const tag = await prisma.tag.upsert({ where: { nome: nomeTag }, update: {}, create: { nome: nomeTag } });
        await prisma.publicacaoTag.create({ data: { idPublicacao: publicacao.id, idTag: tag.id } });
      }

      publicacoesCriadas.push(publicacao);
    }
  }
  console.log(`  ✓ ${publicacoesCriadas.length} publicações criadas.`);

  console.log('A criar relações de seguidor...');
  let totalSeguidores = 0;
  for (const utilizador of utilizadoresCriados) {
    const outros = utilizadoresCriados.filter((u) => u.id !== utilizador.id);
    const aSeguirCount = 4 + Math.floor(Math.random() * 5); // segue entre 4 e 8
    const embaralhados = outros.sort(() => Math.random() - 0.5).slice(0, aSeguirCount);
    for (const seguido of embaralhados) {
      await prisma.seguidor.upsert({
        where: { idSeguidor_idSeguido: { idSeguidor: utilizador.id, idSeguido: seguido.id } },
        update: {},
        create: { idSeguidor: utilizador.id, idSeguido: seguido.id },
      });
      totalSeguidores++;
    }
  }
  console.log(`  ✓ ${totalSeguidores} relações de seguidor criadas.`);

  console.log('A criar likes e comentários...');
  let totalLikes = 0;
  let totalComentarios = 0;
  for (const publicacao of publicacoesCriadas) {
    const possiveis = utilizadoresCriados.filter((u) => u.id !== publicacao.idUtilizador);
    const numLikes = Math.floor(Math.random() * possiveis.length);
    const quemGostou = possiveis.sort(() => Math.random() - 0.5).slice(0, numLikes);
    for (const u of quemGostou) {
      await prisma.like.upsert({
        where: { idPublicacao_idUtilizador: { idPublicacao: publicacao.id, idUtilizador: u.id } },
        update: {},
        create: { idPublicacao: publicacao.id, idUtilizador: u.id },
      });
      totalLikes++;
    }

    const numComentarios = Math.floor(Math.random() * 3);
    for (let c = 0; c < numComentarios; c++) {
      const autor = aleatorio(possiveis);
      await prisma.comentario.create({
        data: { idPublicacao: publicacao.id, idUtilizador: autor.id, texto: aleatorio(COMENTARIOS) },
      });
      totalComentarios++;
    }
  }
  console.log(`  ✓ ${totalLikes} likes e ${totalComentarios} comentários criados.`);

  console.log('\nConcluído! Todas as contas de demonstração usam a password:', PASSWORD_PADRAO);
  console.log('Exemplo de login: ana.ferreira@lensly.pt /', PASSWORD_PADRAO);
}

main()
  .catch((erro) => {
    console.error('Erro ao correr o seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

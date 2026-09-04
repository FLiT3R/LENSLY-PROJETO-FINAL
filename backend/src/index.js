require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const publicacaoRoutes = require('./routes/publicacao.routes');
const utilizadorRoutes = require('./routes/utilizador.routes');
const pesquisaRoutes = require('./routes/pesquisa.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/publicacoes', publicacaoRoutes);
app.use('/api/utilizadores', utilizadorRoutes);
app.use('/api/pesquisa', pesquisaRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'erro', mensagem: 'Rota nao encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor Lensly a correr em http://localhost:${PORT}`);
  console.log(`Testa em: http://localhost:${PORT}/api/health`);
});

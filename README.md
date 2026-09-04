# Lensly

Rede social / portefólio para fotógrafos e videomakers. Projeto de curso — Tecnologias e Programação de Sistemas de Informação.

## Estrutura

```
lensly/
  backend/     -> API em Node.js + Express + Prisma (MySQL)
  frontend/    -> Interface em React (Vite)
```

## Funcionalidades implementadas

- RF01 — Registo e login com password encriptada (bcrypt) e tokens JWT
- RF02 — Publicar fotos/vídeos com descrição e tags, e apagar as próprias publicações
- RF03 — Dar like e comentar publicações
- RF04 — Seguir e deixar de seguir outros utilizadores
- RF05 — Feed com publicações de quem o utilizador segue (`/feed`)
- RF06 — Editar perfil (nome, bio, foto de perfil) e ver o portefólio público de qualquer utilizador (`/perfil/:id`)
- RF07 — Pesquisa de utilizadores e publicações (por nome, descrição ou tag)
- Fotos de perfil (avatar) visíveis em publicações, comentários, pesquisa e perfil — estilo Instagram, com iniciais como fallback quando não há foto definida

## Como correr

Precisas de ter instalado: **Node.js** (v18+) e um servidor **MySQL** a correr localmente (ex. via XAMPP).

### 1. Base de dados
Cria uma base de dados vazia no teu MySQL, por exemplo chamada `lensly`.

### 2. Backend
```bash
cd backend
npm install
copy .env.example .env
```
Edita o `.env` com os teus dados reais de MySQL (o `.env.example` já vem pronto para XAMPP: utilizador `root` sem password).

```bash
npx prisma migrate dev --name init
npm run dev
```
Testa em: http://localhost:3001/api/health

### Dados de demonstração (opcional)
Para teres o feed já com conteúdo, corre o script de seed depois da migração — cria 15 utilizadores fotógrafos, com publicações, seguidores, likes e comentários entre eles:
```bash
npm run prisma:seed
```
Todas as contas de demonstração usam a password `lensly123` (ex. login com `ana.ferreira@lensly.pt`).

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173

## Principais endpoints da API

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| POST | /api/auth/registar | não | Criar conta |
| POST | /api/auth/login | não | Autenticar |
| GET | /api/auth/eu | sim | Dados do utilizador autenticado |
| GET | /api/publicacoes | não | Listar todas as publicações |
| GET | /api/publicacoes/feed | sim | Publicações de quem eu sigo |
| POST | /api/publicacoes | sim | Criar publicação (upload de media) |
| POST | /api/publicacoes/:id/like | sim | Dar/remover like |
| GET / POST | /api/publicacoes/:id/comentarios | GET não, POST sim | Ver/criar comentários |
| GET | /api/utilizadores/:id | não | Perfil público de um utilizador |
| PUT | /api/utilizadores/perfil | sim | Editar o meu perfil (nome, bio, foto) |
| POST | /api/utilizadores/:id/seguir | sim | Seguir/deixar de seguir |
| GET | /api/pesquisa?q=termo | não | Pesquisar utilizadores e publicações |

## Modelo de dados

Utilizador, Publicacao, Comentario, Like, Seguidor (relação n:n do Utilizador consigo mesmo), Colecao, Tag/PublicacaoTag — ver `backend/prisma/schema.prisma`.

## Por implementar (trabalho futuro)

- Página de coleções/projetos dentro do portefólio
- Responsividade mobile mais cuidada (RNF01)
- Deploy em ambiente de produção com armazenamento de media em cloud (ex. Cloudinary)

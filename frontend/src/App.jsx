import { Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Registo from './pages/Registo.jsx';
import Publicar from './pages/Publicar.jsx';
import Publicacoes from './pages/Publicacoes.jsx';
import Publicacao from './pages/Publicacao.jsx';
import Feed from './pages/Feed.jsx';
import Perfil from './pages/Perfil.jsx';
import Pesquisa from './pages/Pesquisa.jsx';

function App() {
  return (
    <>
      <Topbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/publicacoes" element={<Publicacoes />} />
          <Route path="/publicacao/:id" element={<Publicacao />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/publicar" element={<Publicar />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/:id" element={<Perfil />} />
          <Route path="/pesquisa" element={<Pesquisa />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

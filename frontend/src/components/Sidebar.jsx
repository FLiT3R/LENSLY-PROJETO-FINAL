import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import { IconHome, IconSearch, IconPlusSquare, IconGrid, IconUser, IconLogout } from './icons.jsx';

// Sidebar fixa à esquerda, ao estilo Instagram: compacta por omissão,
// expande em hover no desktop para mostrar o nome de cada funcionalidade.
// Em mobile transforma-se numa barra inferior compacta (ver index.css).
function Sidebar() {
  const { utilizador, aCarregar, sair } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (aCarregar) return null;

  function terminarSessao() {
    sair();
    navigate('/');
  }

  const inicio = utilizador ? '/feed' : '/';
  const activo = (caminhos) => caminhos.includes(pathname);

  const itensPrincipais = [
    { to: inicio, label: 'Início', icone: <IconHome />, ativo: activo(['/', '/feed']) },
    { to: '/pesquisa', label: 'Pesquisar', icone: <IconSearch />, ativo: activo(['/pesquisa']) },
    { to: '/publicar', label: 'Criar publicação', icone: <IconPlusSquare />, ativo: activo(['/publicar']) },
    { to: '/publicacoes', label: 'Explorar', icone: <IconGrid />, ativo: activo(['/publicacoes']) }
  ];

  return (
    <nav className="sidebar">
      <Link to="/" className="sidebar-brand">
        <span className="sidebar-brand-mark">L</span>
        <span className="sidebar-brand-full">Lensly</span>
      </Link>

      <div className="sidebar-items">
        {itensPrincipais.map((item) => (
          <Link key={item.label} to={item.to} className={`sidebar-item${item.ativo ? ' is-active' : ''}`}>
            <span className="sidebar-icon">{item.icone}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        {utilizador ? (
          <>
            <Link to="/perfil" className={`sidebar-item${activo(['/perfil']) ? ' is-active' : ''}`}>
              <span className="sidebar-icon">
                <Avatar nome={utilizador.nome} fotoPerfil={utilizador.fotoPerfil} tamanho={24} />
              </span>
              <span className="sidebar-label">{utilizador.nome}</span>
            </Link>
            <button onClick={terminarSessao} className="sidebar-item sidebar-item--button">
              <span className="sidebar-icon"><IconLogout /></span>
              <span className="sidebar-label">Terminar sessão</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`sidebar-item${activo(['/login']) ? ' is-active' : ''}`}>
              <span className="sidebar-icon"><IconUser /></span>
              <span className="sidebar-label">Entrar</span>
            </Link>
            <Link to="/registo" className={`sidebar-item sidebar-item--accent${activo(['/registo']) ? ' is-active' : ''}`}>
              <span className="sidebar-icon"><IconPlusSquare /></span>
              <span className="sidebar-label">Criar conta</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Sidebar;

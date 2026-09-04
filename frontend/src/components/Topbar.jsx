import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Avatar from './Avatar.jsx';
import {
  IconHome,
  IconSearch,
  IconPlusSquare,
  IconGrid,
  IconUser,
  IconLogout,
  IconMenu,
  IconClose,
  IconSun,
  IconMoon,
} from './icons.jsx';

// Barra de navegação horizontal fixa no topo, ao estilo de uma plataforma
// profissional: logótipo à esquerda, navegação principal ao centro e a
// zona de sessão (Entrar/Criar conta ou avatar) à direita. Em ecrãs mais
// estreitos, a navegação principal recolhe para um menu tipo hambúrguer.
function Topbar() {
  const { utilizador, aCarregar, sair } = useAuth();
  const { tema, alternarTema } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  if (aCarregar) return null;

  const inicio = utilizador ? '/feed' : '/';
  const activo = (caminhos) => caminhos.includes(pathname);

  function fecharMenu() {
    setMenuAberto(false);
  }

  function terminarSessao() {
    fecharMenu();
    sair();
    navigate('/');
  }

  const itensPrincipais = [
    { to: inicio, label: 'Início', icone: <IconHome />, ativo: activo(['/', '/feed']) },
    { to: '/pesquisa', label: 'Pesquisar', icone: <IconSearch />, ativo: activo(['/pesquisa']) },
    { to: '/publicar', label: 'Criar publicação', icone: <IconPlusSquare />, ativo: activo(['/publicar']) },
    { to: '/publicacoes', label: 'Explorar', icone: <IconGrid />, ativo: activo(['/publicacoes']) },
    { to: '/perfil', label: 'Perfil', icone: <IconUser />, ativo: activo(['/perfil']) },
  ];

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="topbar-brand" onClick={fecharMenu}>
          <span className="topbar-brand-mark">Lensly</span>
        </Link>

        <nav className="topbar-nav">
          {itensPrincipais.map((item) => (
            <Link key={item.label} to={item.to} className={`topbar-item${item.ativo ? ' is-active' : ''}`}>
              <span className="topbar-icon">{item.icone}</span>
              <span className="topbar-item-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="topbar-auth">
          <button
            onClick={alternarTema}
            className="topbar-theme-btn"
            aria-label={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={tema === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {tema === 'dark' ? <IconSun /> : <IconMoon />}
          </button>

          {utilizador ? (
            <>
              <Link to="/perfil" className="topbar-user">
                <Avatar nome={utilizador.nome} fotoPerfil={utilizador.fotoPerfil} tamanho={30} />
                <span className="topbar-user-name">{utilizador.nome}</span>
              </Link>
              <button onClick={terminarSessao} className="topbar-logout" aria-label="Terminar sessão" title="Terminar sessão">
                <IconLogout />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Entrar</Link>
              <Link to="/registo" className="btn btn-primary btn-sm">Criar conta</Link>
            </>
          )}

          <button
            className="topbar-menu-btn"
            onClick={() => setMenuAberto((v) => !v)}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            {menuAberto ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav className="topbar-mobile-menu">
          <button onClick={alternarTema} className="topbar-item topbar-item--neutral-button">
            <span className="topbar-icon">{tema === 'dark' ? <IconSun /> : <IconMoon />}</span>
            <span className="topbar-item-label">{tema === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
          </button>

          <div className="topbar-mobile-divider" />

          {itensPrincipais.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`topbar-item${item.ativo ? ' is-active' : ''}`}
              onClick={fecharMenu}
            >
              <span className="topbar-icon">{item.icone}</span>
              <span className="topbar-item-label">{item.label}</span>
            </Link>
          ))}

          <div className="topbar-mobile-divider" />

          {utilizador ? (
            <>
              <Link to="/perfil" className="topbar-item" onClick={fecharMenu}>
                <span className="topbar-icon">
                  <Avatar nome={utilizador.nome} fotoPerfil={utilizador.fotoPerfil} tamanho={20} />
                </span>
                <span className="topbar-item-label">{utilizador.nome}</span>
              </Link>
              <button onClick={terminarSessao} className="topbar-item topbar-item--button">
                <span className="topbar-icon"><IconLogout /></span>
                <span className="topbar-item-label">Terminar sessão</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="topbar-item" onClick={fecharMenu}>
                <span className="topbar-icon"><IconUser /></span>
                <span className="topbar-item-label">Entrar</span>
              </Link>
              <Link to="/registo" className="topbar-item" onClick={fecharMenu}>
                <span className="topbar-icon"><IconPlusSquare /></span>
                <span className="topbar-item-label">Criar conta</span>
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default Topbar;

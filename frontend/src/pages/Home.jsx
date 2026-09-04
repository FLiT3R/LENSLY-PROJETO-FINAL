import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Home() {
  const { utilizador, aCarregar } = useAuth();

  if (aCarregar) {
    return <p className="state-text">A verificar sessão...</p>;
  }

  if (utilizador) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <>
      <div className="landing-backdrop" />
      <div className="landing">
        <div className="landing-hero">
          <span className="landing-logo">Lensly</span>
          <p className="landing-tagline">O teu trabalho merece mais do que um feed qualquer.</p>
          <p className="landing-lead">
            Publica, organiza e partilha as tuas fotografias e vídeos num só lugar —
            parte rede social, parte portefólio, feito para fotógrafos e videomakers.
          </p>

          <div className="landing-actions">
            <Link to="/registo" className="btn btn-primary btn-lg">Criar conta</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Entrar</Link>
          </div>

          <Link to="/publicacoes" className="link landing-preview-link">
            Ver publicações sem criar conta
          </Link>
        </div>

        <div className="landing-features">
          <div className="landing-feature">
            <span className="landing-feature-title">Portefólio</span>
            <p>A tua página de perfil funciona como uma montra profissional do teu trabalho.</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-title">Comunidade</span>
            <p>Segue outros criadores, comenta e reage ao trabalho que te inspira.</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-title">Descoberta</span>
            <p>Pesquisa por nome ou por tema e encontra fotógrafos e videomakers novos.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

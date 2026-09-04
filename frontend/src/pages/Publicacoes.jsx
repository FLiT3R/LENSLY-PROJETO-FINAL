import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PublicacaoCard from '../components/PublicacaoCard.jsx';

function Publicacoes() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('/api/publicacoes', { headers })
      .then((res) => res.json())
      .then((data) => setPublicacoes(data.publicacoes || []))
      .catch(() => setErro('Não foi possível carregar as publicações.'))
      .finally(() => setACarregar(false));
  }, [token]);

  return (
    <div className="container container--pinterest explorar-page">
      <div className="page-header">
        <h1>Explorar</h1>
        <Link to="/publicar" className="link link--accent">+ Nova publicação</Link>
      </div>
      {aCarregar && <p className="state-text">A carregar...</p>}
      {erro && <p className="state-text state-text--error">{erro}</p>}
      {!aCarregar && publicacoes.length === 0 && <p className="state-text">Ainda não há publicações.</p>}
      <div className="feed feed--pinterest explorar-grid">
        {publicacoes.map((pub) => <PublicacaoCard key={pub.id} publicacao={pub} />)}
      </div>
    </div>
  );
}

export default Publicacoes;

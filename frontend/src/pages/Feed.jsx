import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PublicacaoCard from '../components/PublicacaoCard.jsx';

function Feed() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState('');
  const { token, utilizador } = useAuth();

  useEffect(() => {
    if (!token) { setACarregar(false); return; }
    fetch('/api/publicacoes/feed', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { setPublicacoes(data.publicacoes || []); setMensagem(data.mensagem || ''); })
      .catch(() => setErro('Não foi possível carregar o feed.'))
      .finally(() => setACarregar(false));
  }, [token]);

  if (!utilizador) {
    return (
      <div className="container">
        <p className="state-text">Precisas de ter sessão iniciada para ver o teu feed.</p>
        <Link to="/login" className="link link--accent">Entrar</Link>
      </div>
    );
  }

  return (
    <div className="container container--pinterest">
      <div className="page-header">
        <h1>O meu feed</h1>
        <Link to="/publicacoes" className="link">Ver todas as publicações</Link>
      </div>
      <p className="subtitle">Publicações de quem segues, mais recentes primeiro.</p>
      {aCarregar && <p className="state-text">A carregar...</p>}
      {erro && <p className="state-text state-text--error">{erro}</p>}
      {!aCarregar && mensagem && <p className="state-text">{mensagem}</p>}
      {!aCarregar && !mensagem && publicacoes.length === 0 && <p className="state-text">Sem novidades por agora.</p>}
      <div className="feed feed--pinterest">
        {publicacoes.map((pub) => <PublicacaoCard key={pub.id} publicacao={pub} aSeguirInicial={true} />)}
      </div>
    </div>
  );
}

export default Feed;

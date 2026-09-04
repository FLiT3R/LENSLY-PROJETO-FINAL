import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PublicacaoCard from '../components/PublicacaoCard.jsx';

function Publicacao() {
  const { id } = useParams();
  const { token } = useAuth();

  const [publicacao, setPublicacao] = useState(null);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setACarregar(true);
    setErro('');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`/api/publicacoes/${id}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setPublicacao(data.publicacao);
        else setErro(data.mensagem || 'Publicação não encontrada.');
      })
      .catch(() => setErro('Não foi possível carregar a publicação.'))
      .finally(() => setACarregar(false));
  }, [id, token]);

  return (
    <div className="container container--wide post-detail-page">
      <Link to="/publicacoes" className="link link--accent post-detail-back">← Voltar a Explorar</Link>

      {aCarregar && <p className="state-text">A carregar...</p>}
      {erro && <p className="state-text state-text--error">{erro}</p>}
      {publicacao && <PublicacaoCard publicacao={publicacao} expandido />}
    </div>
  );
}

export default Publicacao;

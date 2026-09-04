import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicacaoCard from '../components/PublicacaoCard.jsx';
import Avatar from '../components/Avatar.jsx';

function Pesquisa() {
  const [termo, setTermo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [aPesquisar, setAPesquisar] = useState(false);
  const [erro, setErro] = useState('');

  async function submeter(e) {
    e.preventDefault();
    if (!termo.trim()) return;
    setErro('');
    setAPesquisar(true);
    try {
      const res = await fetch(`/api/pesquisa?q=${encodeURIComponent(termo.trim())}`);
      const data = await res.json();
      if (!res.ok) { setErro(data.mensagem || 'Erro na pesquisa.'); return; }
      setResultado(data);
    } catch {
      setErro('Não foi possível contactar o servidor.');
    } finally {
      setAPesquisar(false);
    }
  }

  return (
    <div className="container">
      <h1>Pesquisar</h1>
      <form onSubmit={submeter} className="form-row" style={{ marginTop: '1.25rem' }}>
        <input
          className="input"
          type="text"
          placeholder="Pesquisar utilizadores, descrições ou tags..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={aPesquisar}>{aPesquisar ? '...' : 'Pesquisar'}</button>
      </form>

      {erro && <p className="state-text state-text--error">{erro}</p>}

      {resultado && (
        <>
          <h2 className="section-title">Utilizadores</h2>
          {resultado.utilizadores.length === 0 && <p className="state-text">Nenhum utilizador encontrado.</p>}
          <div className="user-list">
            {resultado.utilizadores.map((u) => (
              <Link key={u.id} to={`/perfil/${u.id}`} className="user-card">
                <Avatar nome={u.nome} fotoPerfil={u.fotoPerfil} tamanho={44} />
                <div>
                  <strong>{u.nome}</strong>
                  {u.bio && <p className="user-card-bio">{u.bio}</p>}
                </div>
              </Link>
            ))}
          </div>

          <h2 className="section-title">Publicações</h2>
          {resultado.publicacoes.length === 0 && <p className="state-text">Nenhuma publicação encontrada.</p>}
          <div className="feed">
            {resultado.publicacoes.map((p) => <PublicacaoCard key={p.id} publicacao={p} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default Pesquisa;

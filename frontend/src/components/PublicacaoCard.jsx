import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import Lightbox from './Lightbox.jsx';
import { IconHeart, IconComment, IconTrash } from './icons.jsx';

function PublicacaoCard({ publicacao, aSeguirInicial, expandido = false }) {
  const { token, utilizador } = useAuth();
  const navigate = useNavigate();

  const [gostei, setGostei] = useState(publicacao.gostei || false);
  const [totalLikes, setTotalLikes] = useState(publicacao.totalLikes || 0);
  const [aSeguir, setASeguir] = useState(aSeguirInicial || false);

  const [comentariosAbertos, setComentariosAbertos] = useState(expandido);
  const [comentarios, setComentarios] = useState([]);
  const [aCarregarComentarios, setACarregarComentarios] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');
  const [totalComentarios, setTotalComentarios] = useState(publicacao.totalComentarios || 0);
  const [apagada, setApagada] = useState(false);
  const [aApagar, setAApagar] = useState(false);
  const [lightboxAberto, setLightboxAberto] = useState(false);

  const ehAutor = utilizador && publicacao.autor && utilizador.id === publicacao.autor.id;

  async function carregarComentarios() {
    setACarregarComentarios(true);
    try {
      const res = await fetch(`/api/publicacoes/${publicacao.id}/comentarios`);
      const data = await res.json();
      setComentarios(data.comentarios || []);
    } catch {
      // nao critico
    } finally {
      setACarregarComentarios(false);
    }
  }

  useEffect(() => {
    if (expandido) carregarComentarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function apagarPublicacao() {
    if (!token) return;
    const confirmar = window.confirm('Tens a certeza que queres apagar esta publicação? Esta ação não pode ser desfeita.');
    if (!confirmar) return;
    setAApagar(true);
    try {
      const res = await fetch(`/api/publicacoes/${publicacao.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setApagada(true);
        if (expandido) navigate('/publicacoes');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.mensagem || 'Não foi possível apagar a publicação.');
      }
    } catch {
      alert('Não foi possível contactar o servidor.');
    } finally {
      setAApagar(false);
    }
  }

  if (apagada) return null;

  async function alternarLike() {
    if (!token) return;
    try {
      const res = await fetch(`/api/publicacoes/${publicacao.id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) { setGostei(data.gostei); setTotalLikes(data.totalLikes); }
    } catch {
      // nao critico
    }
  }

  async function alternarSeguir() {
    if (!token || !publicacao.autor) return;
    try {
      const res = await fetch(`/api/utilizadores/${publicacao.autor.id}/seguir`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setASeguir(data.aSeguir);
    } catch {
      // nao critico
    }
  }

  async function alternarComentarios() {
    const aAbrir = !comentariosAbertos;
    setComentariosAbertos(aAbrir);
    if (aAbrir && comentarios.length === 0) await carregarComentarios();
  }

  function aoClicarMedia() {
    if (expandido) {
      setLightboxAberto(true);
    } else {
      navigate(`/publicacao/${publicacao.id}`);
    }
  }

  async function submeterComentario(e) {
    e.preventDefault();
    if (!novoComentario.trim() || !token) return;
    try {
      const res = await fetch(`/api/publicacoes/${publicacao.id}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ texto: novoComentario }),
      });
      const data = await res.json();
      if (res.ok) {
        setComentarios([...comentarios, data.comentario]);
        setTotalComentarios(totalComentarios + 1);
        setNovoComentario('');
      }
    } catch {
      // nao critico
    }
  }

  return (
    <div className={`card${expandido ? ' card--detalhe' : ''}`}>
      {publicacao.autor && (
        <div className="card-header">
          <Link to={`/perfil/${publicacao.autor.id}`} className="card-author">
            <Avatar nome={publicacao.autor.nome} fotoPerfil={publicacao.autor.fotoPerfil} tamanho={32} />
            <span>{publicacao.autor.nome}</span>
          </Link>
          {token && !ehAutor && (
            <button
              onClick={alternarSeguir}
              className={`btn btn-follow btn-sm${aSeguir ? ' is-following' : ''}`}
            >
              {aSeguir ? 'A seguir' : 'Seguir'}
            </button>
          )}
          {ehAutor && (
            <button
              onClick={apagarPublicacao}
              disabled={aApagar}
              className="btn-icon"
              aria-label="Apagar publicação"
              title="Apagar publicação"
            >
              <IconTrash />
            </button>
          )}
        </div>
      )}

      {publicacao.tipo === 'video' ? (
        <div className={`card-video-wrap${expandido ? ' card-video-wrap--expandible' : ''}`}>
          <video
            src={publicacao.urlMedia}
            controls
            className="card-media"
            onClick={aoClicarMedia}
            onDoubleClick={expandido ? () => setLightboxAberto(true) : undefined}
          />
          {expandido && (
            <button
              type="button"
              className="video-expand-btn"
              onClick={() => setLightboxAberto(true)}
              aria-label="Ver vídeo em grande"
              title="Ver vídeo em grande"
            >
              ⛶ Ver em grande
            </button>
          )}
        </div>
      ) : (
        <img
          src={publicacao.urlMedia}
          alt={publicacao.descricao || 'publicacao'}
          className="card-media card-media--clickable"
          onClick={aoClicarMedia}
        />
      )}

      {lightboxAberto && (
        <Lightbox
          tipo={publicacao.tipo}
          url={publicacao.urlMedia}
          alt={publicacao.descricao}
          onFechar={() => setLightboxAberto(false)}
        />
      )}

      <div className="card-body">
        <div className="card-actions">
          <button onClick={alternarLike} disabled={!token} className={`btn-icon${gostei ? ' is-liked' : ''}`} aria-label="Gosto">
            <IconHeart filled={gostei} />
          </button>
          <button onClick={alternarComentarios} className="btn-icon" aria-label="Comentar">
            <IconComment />
          </button>
        </div>

        {totalLikes > 0 && <p className="card-description"><strong>{totalLikes}</strong> gosto{totalLikes === 1 ? '' : 's'}</p>}

        {publicacao.descricao && (
          <p className="card-description">
            <strong>{publicacao.autor?.nome}</strong>{publicacao.descricao}
          </p>
        )}
        {publicacao.tags?.length > 0 && (
          <p className="card-tags">{publicacao.tags.map((t) => `#${t}`).join(' ')}</p>
        )}

        {totalComentarios > 0 && !comentariosAbertos && (
          <button onClick={alternarComentarios} className="link" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ver os {totalComentarios} comentário{totalComentarios === 1 ? '' : 's'}
          </button>
        )}

        {comentariosAbertos && (
          <div className="comments">
            {aCarregarComentarios && <p className="comment-loading">A carregar comentários...</p>}
            {comentarios.map((c) => (
              <div key={c.id} className="comment-row">
                <Avatar nome={c.autor.nome} fotoPerfil={c.autor.fotoPerfil} tamanho={24} />
                <p className="comment-text"><strong>{c.autor.nome}</strong> {c.texto}</p>
              </div>
            ))}
            {comentarios.length === 0 && !aCarregarComentarios && (
              <p className="comment-empty">Sem comentários ainda.</p>
            )}
          </div>
        )}

        {token && (
          <form onSubmit={submeterComentario} className="comment-form">
            <input
              className="comment-input"
              placeholder="Adiciona um comentário..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
            />
            <button type="submit" className="btn" disabled={!novoComentario.trim()}>Publicar</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PublicacaoCard;

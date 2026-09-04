import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';
import { IconTrash, IconHeart, IconComment } from '../components/icons.jsx';

function Perfil() {
  const { id } = useParams();
  const { token, utilizador, atualizarUtilizador } = useAuth();

  const idPerfil = id ? Number(id) : utilizador?.id;
  const ehOMeu = utilizador && idPerfil === utilizador.id;

  const [perfil, setPerfil] = useState(null);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState('');
  const [aSeguir, setASeguir] = useState(false);

  const [aEditar, setAEditar] = useState(false);
  const [bio, setBio] = useState('');
  const [novaFoto, setNovaFoto] = useState(null);
  const [aGuardar, setAGuardar] = useState(false);

  function carregarPerfil() {
    setACarregar(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`/api/utilizadores/${idPerfil}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setPerfil(data.utilizador);
          setBio(data.utilizador.bio || '');
          setASeguir(data.utilizador.aSeguir);
        } else {
          setErro(data.mensagem || 'Perfil não encontrado.');
        }
      })
      .catch(() => setErro('Não foi possível carregar o perfil.'))
      .finally(() => setACarregar(false));
  }

  useEffect(() => {
    if (idPerfil) carregarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPerfil, token]);

  async function alternarSeguir() {
    if (!token) return;
    try {
      const res = await fetch(`/api/utilizadores/${idPerfil}/seguir`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setASeguir(data.aSeguir);
        setPerfil((p) => ({ ...p, totalSeguidores: data.totalSeguidores }));
      }
    } catch {
      // nao critico
    }
  }

  async function guardarPerfil(e) {
    e.preventDefault();
    setAGuardar(true);
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (novaFoto) formData.append('foto', novaFoto);

      const res = await fetch('/api/utilizadores/perfil', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        atualizarUtilizador(data.utilizador);
        setAEditar(false);
        setNovaFoto(null);
        carregarPerfil();
      }
    } catch {
      // nao critico
    } finally {
      setAGuardar(false);
    }
  }

  async function apagarPublicacao(id) {
    const confirmar = window.confirm('Tens a certeza que queres apagar esta publicação? Esta ação não pode ser desfeita.');
    if (!confirmar) return;
    try {
      const res = await fetch(`/api/publicacoes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPerfil((p) => ({ ...p, publicacoes: p.publicacoes.filter((pub) => pub.id !== id) }));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.mensagem || 'Não foi possível apagar a publicação.');
      }
    } catch {
      alert('Não foi possível contactar o servidor.');
    }
  }

  if (!idPerfil) {
    return (
      <div className="container">
        <p className="state-text">Precisas de ter sessão iniciada para ver o teu perfil.</p>
        <Link to="/login" className="link link--accent">Entrar</Link>
      </div>
    );
  }

  if (aCarregar) return <div className="container"><p className="state-text">A carregar...</p></div>;
  if (erro) return <div className="container"><p className="state-text state-text--error">{erro}</p></div>;
  if (!perfil) return null;

  return (
    <div className="container container--wide">
      <div className="profile-header">
        <div className="profile-header-main">
          <div className="profile-avatar-ring">
            <Avatar nome={perfil.nome} fotoPerfil={perfil.fotoPerfil} tamanho={90} />
          </div>
          <div className="profile-info">
            <h1>{perfil.nome}</h1>

            {!aEditar && perfil.bio && <p className="profile-bio-inline">{perfil.bio}</p>}
            {!aEditar && !perfil.bio && ehOMeu && (
              <p className="profile-bio-inline profile-bio--empty">Ainda não tens bio. Clica em "Editar perfil" para adicionares.</p>
            )}

            <div className="profile-stats">
              <div className="profile-stat">
                <strong>{perfil.publicacoes.length}</strong>
                <span>Publicações</span>
              </div>
              <div className="profile-stat">
                <strong>{perfil.totalSeguidores}</strong>
                <span>Seguidores</span>
              </div>
              <div className="profile-stat">
                <strong>{perfil.totalASeguir}</strong>
                <span>A seguir</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-header-actions">
          {!ehOMeu && token && (
            <button
              onClick={alternarSeguir}
              className={`btn btn-follow${aSeguir ? ' is-following' : ''}`}
            >
              {aSeguir ? 'A seguir' : 'Seguir'}
            </button>
          )}
          {ehOMeu && !aEditar && (
            <button onClick={() => setAEditar(true)} className="btn btn-primary">Editar perfil</button>
          )}
        </div>
      </div>

      {aEditar && (
        <form onSubmit={guardarPerfil} className="edit-form">
          <label className="field-label">Bio</label>
          <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Fala um pouco sobre o teu trabalho..." />
          <label className="field-label">Nova foto de perfil</label>
          <input className="file-input" type="file" accept="image/*" onChange={(e) => setNovaFoto(e.target.files[0])} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={aGuardar}>{aGuardar ? 'A guardar...' : 'Guardar'}</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAEditar(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {perfil.publicacoes.length === 0 && <p className="state-text">Ainda sem publicações.</p>}
      <div className="thumb-grid">
        {perfil.publicacoes.map((p) => (
          <div key={p.id} className="thumb">
            {p.tipo === 'video' ? (
              <video src={p.urlMedia} />
            ) : (
              <img src={p.urlMedia} alt={p.descricao || ''} />
            )}
            <div className="thumb-stats">
              <span className="thumb-stat"><IconHeart filled /> {p.totalLikes}</span>
              <span className="thumb-stat"><IconComment /> {p.totalComentarios}</span>
            </div>
            {ehOMeu && (
              <button
                onClick={() => apagarPublicacao(p.id)}
                className="thumb-delete"
                aria-label="Apagar publicação"
                title="Apagar publicação"
              >
                <IconTrash />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Perfil;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Publicar() {
  const [ficheiro, setFicheiro] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [tags, setTags] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);
  const { token, utilizador } = useAuth();
  const navigate = useNavigate();

  if (!utilizador) {
    return (
      <div className="container--form">
        <p className="state-text">Precisas de ter sessão iniciada para publicar.</p>
        <Link to="/login" className="link link--accent">Entrar</Link>
      </div>
    );
  }

  async function submeter(e) {
    e.preventDefault();
    setErro('');
    if (!ficheiro) { setErro('Escolhe uma foto ou um vídeo.'); return; }
    setAEnviar(true);
    try {
      const formData = new FormData();
      formData.append('media', ficheiro);
      formData.append('descricao', descricao);
      formData.append('tags', tags);
      const res = await fetch('/api/publicacoes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.mensagem || 'Erro ao publicar.'); return; }
      navigate('/publicacoes');
    } catch {
      setErro('Não foi possível contactar o servidor.');
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div className="container--form">
      <h1>Nova publicação</h1>
      <form onSubmit={submeter} className="form" style={{ marginTop: '1.25rem' }}>
        <input className="file-input" type="file" accept="image/*,video/*" onChange={(e) => setFicheiro(e.target.files[0])} required />
        <textarea className="textarea" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
        <input className="input" type="text" placeholder="Tags (separadas por vírgula)" value={tags} onChange={(e) => setTags(e.target.value)} />
        {erro && <p className="form-error">{erro}</p>}
        <button className="btn btn-primary" type="submit" disabled={aEnviar}>{aEnviar ? 'A publicar...' : 'Publicar'}</button>
      </form>
    </div>
  );
}

export default Publicar;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);
  const { entrar } = useAuth();
  const navigate = useNavigate();

  async function submeter(e) {
    e.preventDefault();
    setErro('');
    setAEnviar(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.mensagem || 'Erro ao fazer login.'); return; }
      entrar(data.token, data.utilizador);
      navigate('/');
    } catch {
      setErro('Não foi possível contactar o servidor.');
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div className="container--narrow">
      <h1>Entrar</h1>
      <form onSubmit={submeter} className="form" style={{ marginTop: '1.25rem' }}>
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {erro && <p className="form-error">{erro}</p>}
        <button className="btn btn-primary btn-block" type="submit" disabled={aEnviar}>{aEnviar ? 'A entrar...' : 'Entrar'}</button>
      </form>
      <p className="form-footnote">Ainda não tens conta? <Link to="/registo" className="link link--accent">Criar conta</Link></p>
    </div>
  );
}

export default Login;

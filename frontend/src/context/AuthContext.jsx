import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilizador, setUtilizador] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lensly_token'));
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
    if (!token) { setACarregar(false); return; }
    fetch('/api/auth/eu', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (!res.ok) throw new Error('Token invalido'); return res.json(); })
      .then((data) => setUtilizador(data.utilizador))
      .catch(() => {
        localStorage.removeItem('lensly_token');
        setToken(null);
        setUtilizador(null);
      })
      .finally(() => setACarregar(false));
  }, [token]);

  function entrar(novoToken, dadosUtilizador) {
    localStorage.setItem('lensly_token', novoToken);
    setToken(novoToken);
    setUtilizador(dadosUtilizador);
  }

  function sair() {
    localStorage.removeItem('lensly_token');
    setToken(null);
    setUtilizador(null);
  }

  function atualizarUtilizador(dados) {
    setUtilizador((atual) => ({ ...atual, ...dados }));
  }

  return (
    <AuthContext.Provider value={{ utilizador, token, aCarregar, entrar, sair, atualizarUtilizador }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

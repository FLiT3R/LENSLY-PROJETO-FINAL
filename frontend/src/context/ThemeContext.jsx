import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

function obterTemaInicial() {
  if (typeof window === 'undefined') return 'dark';
  const guardado = window.localStorage.getItem('lensly_tema');
  if (guardado === 'light' || guardado === 'dark') return guardado;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(obterTemaInicial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    document.documentElement.style.colorScheme = tema;
    window.localStorage.setItem('lensly_tema', tema);
  }, [tema]);

  function alternarTema() {
    setTema((atual) => (atual === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

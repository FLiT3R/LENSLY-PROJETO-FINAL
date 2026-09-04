import { useState } from 'react';

// Mostra a foto de perfil do utilizador; se nao existir (ou falhar a
// carregar), mostra um circulo com a inicial do nome, como o Instagram
// faz quando nao ha foto definida.
function Avatar({ nome, fotoPerfil, tamanho = 36 }) {
  const [falhou, setFalhou] = useState(false);

  const estiloTamanho = {
    width: tamanho,
    height: tamanho,
    minWidth: tamanho,
    fontSize: tamanho * 0.42,
    lineHeight: 1,
  };

  if (fotoPerfil && !falhou) {
    return (
      <img
        src={fotoPerfil}
        alt={nome || 'utilizador'}
        className="avatar"
        style={estiloTamanho}
        onError={() => setFalhou(true)}
      />
    );
  }

  const inicial = nome ? nome.trim().charAt(0).toUpperCase() : '?';
  return <div className="avatar" style={estiloTamanho}>{inicial}</div>;
}

export default Avatar;

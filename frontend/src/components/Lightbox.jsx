import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconClose } from './icons.jsx';

function Lightbox({ tipo, url, alt, onFechar }) {
  useEffect(() => {
    function aoTeclar(evento) {
      if (evento.key === 'Escape') onFechar();
    }
    document.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [onFechar]);

  return createPortal(
    <div className="lightbox" onClick={onFechar}>
      <button className="lightbox-close" onClick={onFechar} aria-label="Fechar">
        <IconClose />
      </button>
      {tipo === 'video' ? (
        <video
          src={url}
          controls
          autoPlay
          className="lightbox-media"
          onClick={(evento) => evento.stopPropagation()}
        />
      ) : (
        <img
          src={url}
          alt={alt || ''}
          className="lightbox-media"
          onClick={(evento) => evento.stopPropagation()}
        />
      )}
    </div>,
    document.body
  );
}

export default Lightbox;

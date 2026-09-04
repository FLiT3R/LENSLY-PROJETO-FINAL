// Ícones simples em SVG, ao estilo outline do Instagram.
// Todos aceitam className/estilo através de "props" para reutilização.

export function IconHome(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <circle cx="11" cy="11" r="7.5" />
      <path d="m20.5 20.5-4-4" />
    </svg>
  );
}

export function IconPlusSquare(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function IconGrid(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  );
}

export function IconHeart({ filled, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={`icon${filled ? ' icon--filled' : ''}`} {...props}>
      <path d="M12 20.2s-7.3-4.4-9.9-9.1C.6 7.8 2 4.3 5.4 3.4c2-.5 4 .3 5.2 2 .3.4.9.4 1.2 0 1.2-1.7 3.2-2.5 5.2-2 3.4.9 4.8 4.4 3.3 7.7-2.6 4.7-9.9 9.1-9.9 9.1Z" />
    </svg>
  );
}

export function IconComment(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.8-.87L3 20l1.03-4.35A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

export function IconShare(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="m3 11 18-8-8 18-2.5-7.5L3 11Z" />
    </svg>
  );
}

export function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4.8c0-.44.36-.8.8-.8h4.4c.44 0 .8.36.8.8V7" />
      <path d="M6 7l.9 12.2c.05.7.65 1.3 1.35 1.3h7.5c.7 0 1.3-.6 1.35-1.3L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconBookmark(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="M6 3.8c0-.44.36-.8.8-.8h10.4c.44 0 .8.36.8.8V21l-6-4-6 4V3.8Z" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="M15 4h3.2c.44 0 .8.36.8.8v14.4c0 .44-.36.8-.8.8H15" />
      <path d="M10 8l-4 4 4 4" />
      <path d="M6 12h12" />
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </svg>
  );
}

export function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" className="icon" {...props}>
      <path d="M20.5 14.7A8.5 8.5 0 1 1 9.3 3.5a7 7 0 0 0 11.2 11.2Z" />
    </svg>
  );
}

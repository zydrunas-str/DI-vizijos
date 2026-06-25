// Shared components & utilities

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// Tiny SVG — abstract ink clouds echoing the poster
function InkClouds({ className = "", opacity = 0.8 }) {
  return (
    <svg className={className} viewBox="0 0 520 260" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur1"><feGaussianBlur stdDeviation="1.5" /></filter>
        <filter id="blur2"><feGaussianBlur stdDeviation="0.6" /></filter>
      </defs>
      <g fill="#141414" filter="url(#blur1)">
        <ellipse cx="120" cy="100" rx="48" ry="70" transform="rotate(-6 120 100)" />
        <ellipse cx="180" cy="85"  rx="40" ry="72" transform="rotate(4 180 85)" />
        <ellipse cx="240" cy="95"  rx="52" ry="78" transform="rotate(-3 240 95)" />
        <ellipse cx="310" cy="100" rx="44" ry="70" transform="rotate(6 310 100)" />
        <ellipse cx="370" cy="90"  rx="38" ry="68" transform="rotate(-5 370 90)" />
        <ellipse cx="420" cy="100" rx="42" ry="66" transform="rotate(3 420 100)" />
      </g>
      {/* droplet trails */}
      <g fill="#141414" filter="url(#blur2)">
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 90 + i * 25 + (i % 3) * 4;
          const y1 = 165 + (i % 4) * 6;
          const y2 = y1 + 18 + (i % 5) * 4;
          return <ellipse key={i} cx={x} cy={y2} rx="4" ry="10" opacity={0.85} />;
        })}
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 90 + i * 25 + (i % 3) * 4;
          const y1 = 165 + (i % 4) * 6;
          const y2 = y1 + 18 + (i % 5) * 4;
          return <line key={"l" + i} x1={x} y1={y1 - 10} x2={x} y2={y2 - 10} stroke="#141414" strokeWidth="0.6" />;
        })}
      </g>
    </svg>
  );
}

// Cape figure — abstract silhouette; SVG generated to evoke poster's orange figure
function CapeFigure({ size = 200 }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cape" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e8813d" />
          <stop offset=".6" stopColor="#d96a2a" />
          <stop offset="1" stopColor="#a04515" />
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="0.4" /></filter>
      </defs>
      {/* Shadow on ground */}
      <ellipse cx="100" cy="268" rx="50" ry="4" fill="#141414" opacity="0.18" />
      {/* Head */}
      <ellipse cx="100" cy="48" rx="18" ry="22" fill="#1b1b1b" />
      {/* Body/cape */}
      <path
        d="M82 66 Q60 100 52 160 Q46 210 54 260 L146 260 Q154 210 148 160 Q140 100 118 66 Q110 72 100 72 Q90 72 82 66 Z"
        fill="url(#cape)"
        filter="url(#soft)"
      />
      {/* Leg/shadow under cape */}
      <rect x="94" y="240" width="12" height="30" fill="#181818" />
    </svg>
  );
}

// Router
function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [route.page, route.authorId]);
  return route;
}
function parseHash(hash) {
  const h = (hash || "").replace(/^#\/?/, "");
  if (!h) return { page: "home" };
  const parts = h.split("/");
  if (parts[0] === "autorius" && parts[1]) return { page: "author", authorId: parts[1] };
  if (parts[0] === "galerija" && parts[1]) return { page: "gallery", authorId: parts[1] };
  if (parts[0] === "visi-darbai") return { page: "all-works" };
  return { page: "home" };
}
function go(path) { window.location.hash = "#/" + path; }

// Nav
function Nav({ route }) {
  const activeHome = route.page === "home";
  const activeGallery = route.page === "gallery" || route.page === "all-works";
  return (
    <nav className="nav" aria-label="Pagrindinė navigacija">
      <a href="#/" className="nav-brand" onClick={(e) => { e.preventDefault(); go(""); }}>
        <span>DI <em style={{ color: "var(--accent)", fontStyle: "italic" }}>vizijos</em></span>
      </a>
      <div className="nav-links">
        <a href="#/" className={activeHome ? "active" : ""} onClick={(e) => { e.preventDefault(); go(""); }}>Paroda</a>
        <a href="#/#autoriai" onClick={(e) => { e.preventDefault(); go(""); setTimeout(() => { const el = document.getElementById("autoriai"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); }}>Autoriai</a>
        <a href="#/visi-darbai" className={activeGallery ? "active" : ""} onClick={(e) => { e.preventDefault(); go("visi-darbai"); }}>Galerija</a>
        <a href="#/#info" onClick={(e) => { e.preventDefault(); go(""); setTimeout(() => { const el = document.getElementById("info"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); }}>Info</a>
      </div>
    </nav>
  );
}

// Lightbox
function Lightbox({ items, index, onClose, onPrev, onNext, authorName }) {
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, dragging: false });
  const [dragX, setDragX] = useState(0);
  const [showHint, setShowHint] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) return false;
    try { return !localStorage.getItem('di-swipe-hint-seen'); } catch (e) { return true; }
  });
  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    function onKey(e) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Move focus to close button
    setTimeout(() => { if (closeBtnRef.current) closeBtnRef.current.focus(); }, 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Restore focus
      if (prevFocusRef.current && prevFocusRef.current.focus) {
        try { prevFocusRef.current.focus(); } catch (e) {}
      }
    };
  }, [onClose, onPrev, onNext]);

  // Auto-hide swipe hint after 3.5s
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 3500);
    return () => clearTimeout(t);
  }, [showHint]);

  function dismissHint() {
    if (!showHint) return;
    setShowHint(false);
    try { localStorage.setItem('di-swipe-hint-seen', '1'); } catch (e) {}
  }

  function onTouchStart(e) {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, dx: 0, dy: 0, dragging: true, startTime: Date.now() };
  }
  function onTouchMove(e) {
    if (!touchRef.current.dragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    touchRef.current.dx = dx;
    touchRef.current.dy = dy;
    // Only treat as horizontal swipe if dx dominates
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragX(dx);
      // Prevent default scrolling on horizontal drag
      if (Math.abs(dx) > 10 && e.cancelable) e.preventDefault();
    }
  }
  function onTouchEnd() {
    if (!touchRef.current.dragging) return;
    const { dx, dy } = touchRef.current;
    const stageW = stageRef.current ? stageRef.current.offsetWidth : 320;
    const threshold = Math.min(80, stageW * 0.18);
    const horizontal = Math.abs(dx) > Math.abs(dy);
    if (horizontal && Math.abs(dx) > threshold) {
      dismissHint();
      if (dx < 0) onNext(); else onPrev();
    }
    touchRef.current = { x: 0, y: 0, dx: 0, dy: 0, dragging: false };
    setDragX(0);
  }
  function onTouchCancel() {
    touchRef.current = { x: 0, y: 0, dx: 0, dy: 0, dragging: false };
    setDragX(0);
  }

  if (index == null) return null;
  const it = items[index];
  // Translate + slight fade as user drags
  const stageW = stageRef.current ? stageRef.current.offsetWidth : 1;
  const dragRatio = Math.max(-1, Math.min(1, dragX / stageW));
  const imgStyle = dragX !== 0 ? {
    transform: `translateX(${dragX}px)`,
    opacity: 1 - Math.abs(dragRatio) * 0.4,
    transition: 'none',
  } : undefined;
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${authorName || ""} — ${it.title}`}>
      <button ref={closeBtnRef} className="close" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Uždaryti">× Uždaryti</button>
      <div
        ref={stageRef}
        className="stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        <button className="nav-btn prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Ankstesnis kūrinys"><span className="arrow-glyph">‹</span></button>
        <button className="nav-btn next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Kitas kūrinys"><span className="arrow-glyph">›</span></button>
        <img ref={imgRef} src={it.src} alt={`${authorName ? authorName + " — " : ""}${it.title}`} style={imgStyle} />
        {showHint && (
          <div className="swipe-hint" aria-hidden="true">
            <span className="swipe-hint-arrow">‹</span>
            <span className="swipe-hint-label">Braukite</span>
            <span className="swipe-hint-arrow">›</span>
          </div>
        )}
      </div>
      <div className="meta">
        <div>
          <div style={{ opacity: .6, marginBottom: 4 }}>{authorName}</div>
          <div className="title">{it.title}</div>
        </div>
        <div style={{ textAlign: "right", opacity: .75 }}>
          <div>{it.format || "—"}</div>
          <div style={{ marginTop: 4 }}>{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</div>
        </div>
      </div>
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="org">DI vizijos: <em>algoritminiai žaidimai</em></div>
        <div style={{ marginTop: 12, color: "var(--muted)" }}>
          Grupinė paroda, pristatanti penkis Lietuvos autorius, tyrinėjančius dirbtinio intelekto kūrybines ribas.
        </div>
      </div>
      <div>
        <h5>Vieta</h5>
        Keliaujanti paroda<br/>
        <span style={{ color: "var(--muted)" }}>Vilnius · Anykščiai · Vilnius</span>
      </div>
      <div>
        <h5>Data</h5>
        2025 m. balandžio 15 d.<br/>
        — 2026 m. balandžio 24 d.
      </div>
      <div>
        <h5>Kuratorė</h5>
        Aida Vėželienė<br/>
        <span style={{ color: "var(--muted)" }}>Komunikacijos partneriai: The Critical</span>
      </div>
      <div className="small">
        <span>© 2025 — Paroda „DI vizijos"</span>
        <span>Svetainė · v.1.0</span>
      </div>
    </footer>
  );
}

// Lithuanian plural helper — n darbas / 2-9 darbai / 0,10-20,>20 darbų
function ltPlural(n, one, few, many) {
  n = Math.abs(n);
  const tens = Math.floor(n / 10) % 10;
  const ones = n % 10;
  if (tens === 1) return many;        // 10-19
  if (ones === 1) return one;         // 1, 21, 31...
  if (ones >= 2 && ones <= 9) return few; // 2-9, 22-29...
  return many;                        // 0, 10-19, 20, 30...
}

Object.assign(window, { useHashRoute, parseHash, go, Nav, Footer, Lightbox, InkClouds, CapeFigure, ltPlural });

// Combined gallery — all works

function AllWorksPage() {
  const authors = window.AUTHORS;
  const [filter, setFilter] = useState("all");
  const [lb, setLb] = useState(null);

  const all = useMemo(() => {
    const items = [];
    authors.forEach(a => {
      a.gallery.forEach((g, i) => {
        items.push({ ...g, authorId: a.id, authorName: a.firstName + " " + a.lastName, authorIdx: a.index, cycle: a.cycle });
      });
    });
    return items;
  }, [authors]);

  const visible = filter === "all" ? all : all.filter(i => i.authorId === filter);

  function openLb(i) { setLb(i); }
  function closeLb() { setLb(null); }
  function prevLb() { setLb(i => (i - 1 + visible.length) % visible.length); }
  function nextLb() { setLb(i => (i + 1) % visible.length); }

  return (
    <main id="main">
      <section className="hero" style={{ paddingBottom: 20 }}>
        <div className="hero-meta">
          <div className="mono" style={{ color: "var(--muted)" }}>
            <a href="#/" onClick={(e) => { e.preventDefault(); go(""); }}>← Paroda</a>
          </div>
          <div className="mono" style={{ textAlign: "center", color: "var(--muted)" }}>Galerija</div>
          <div className="mono" style={{ textAlign: "right", color: "var(--muted)" }}>{all.length} kūriniai</div>
        </div>
        <div className="hero-title" style={{ padding: "50px 0 10px" }}>
          <h1 className="display" style={{ fontSize: "clamp(64px, 10vw, 160px)" }}>
            Visi <span className="accent" style={{ fontStyle: "italic" }}>darbai</span>
          </h1>
          <div className="hero-side">
            Bendra parodos galerija — visų penkių autorių kūriniai vienoje vietoje. Filtruokite pagal autorių arba atrinkite atsitiktine tvarka.
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <div style={{ padding: "10px 40px 30px", display: "flex", gap: 10, flexWrap: "wrap", borderBottom: "1px solid var(--rule)" }}>
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          Visi · {all.length}
        </FilterChip>
        {authors.map(a => (
          <FilterChip key={a.id} active={filter === a.id} onClick={() => setFilter(a.id)}>
            {a.firstName} {a.lastName} · {a.gallery.length}
          </FilterChip>
        ))}
      </div>

      <div className="gal-grid cols-4" style={{ paddingTop: 30 }}>
        {visible.map((g, i) => (
          <div key={g.src} className="gal-item"
               role="button"
               tabIndex={0}
               aria-label={`Atidaryti kūrinį ${g.title} — ${g.authorName}`}
               onClick={() => openLb(i)}
               onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i); } }}>
            <div className="img-wrap">
              <img src={g.src} alt={`${g.authorName} — ${g.title}`} loading="lazy" />
            </div>
            <div className="cap">
              <div>
                <div className="t" style={{ fontSize: 16 }}>{g.title}</div>
                <div className="n" style={{ marginTop: 4 }}>№ {g.authorIdx} · {g.authorName}</div>
              </div>
              <div className="n">{g.format}</div>
            </div>
          </div>
        ))}
      </div>

      <Footer />

      {lb != null && visible[lb] && (
        <Lightbox
          items={visible}
          index={lb}
          authorName={visible[lb].authorName + " · „" + visible[lb].cycle + "\""}
          onClose={closeLb}
          onPrev={prevLb}
          onNext={nextLb}
        />
      )}
    </main>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 18px",
        fontSize: 12,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        fontFamily: "var(--mono)",
        border: "1px solid " + (active ? "var(--accent)" : "var(--rule)"),
        color: active ? "var(--accent)" : "var(--ink-soft)",
        background: active ? "rgba(217,106,42,0.08)" : "transparent",
        borderRadius: 999,
        transition: "all .2s",
      }}
    >
      {children}
    </button>
  );
}

window.AllWorksPage = AllWorksPage;

// Author detail page — essay + gallery with layout toggle

function AuthorPage({ authorId }) {
  const authors = window.AUTHORS;
  const idx = authors.findIndex(a => a.id === authorId);
  const a = authors[idx];
  if (!a) {
    return (
      <main style={{ padding: 80, textAlign: "center" }}>
        <div className="display" style={{ fontSize: 48 }}>Autorius nerastas</div>
        <a href="#/" onClick={(e) => { e.preventDefault(); go(""); }}
           style={{ color: "var(--accent)", borderBottom: "1px solid", display: "inline-block", marginTop: 20 }}>
          ← Grįžti į pradžią
        </a>
      </main>
    );
  }

  const next = authors[(idx + 1) % authors.length];
  const [layout, setLayout] = useState("grid"); // grid | mosaic | strip
  const [lb, setLb] = useState(null);

  function openLb(i) { setLb(i); }
  function closeLb() { setLb(null); }
  function prevLb() { setLb(i => (i - 1 + a.gallery.length) % a.gallery.length); }
  function nextLb() { setLb(i => (i + 1) % a.gallery.length); }

  return (
    <main id="main">
      {/* Author hero */}
      <section className="a-hero">
        <div className="left">
          <div className="kicker">
            <a href="#/" onClick={(e) => { e.preventDefault(); go(""); }} style={{ color: "var(--muted)" }}>
              ← Visi autoriai
            </a>
            <span style={{ margin: "0 14px" }}>/</span>
            <span style={{ color: "var(--accent)" }}>№ {a.index}</span>
          </div>
          <div className="a-hero-inner">
            <div className="a-hero-portrait">
              <img src={a.portrait} alt={a.firstName + " " + a.lastName} />
              <div className="tape tape-tl" />
              <div className="tape tape-br" />
            </div>
            <div>
              <h1>
                {a.firstName}<br/>
                <span className="last">{a.lastName}</span>
              </h1>
              <div className="role">{a.role}</div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="cycle-label">Kūrinių ciklas</div>
          <h2 className="cycle-title">„{a.cycle}"</h2>
          <div className="tagline">{a.tagline}</div>
        </div>
      </section>

      {/* Essay body */}
      <section className="a-body">
        <div className="side">
          <div className="block">
            <h4>Darbų skaičius</h4>
            <div style={{ fontFamily: "var(--serif)", fontSize: 44 }}>
              <span style={{ color: "var(--accent)" }}>{String(a.gallery.length).padStart(2, "0")}</span>
              <span style={{ fontSize: 18, color: "var(--muted)", marginLeft: 8 }}>eksponatų</span>
            </div>
          </div>
          <div className="block">
            <h4>Pristatomi kūriniai</h4>
            <ul>
              {a.works.map((w, i) => <li key={i}><span>{w}</span></li>)}
            </ul>
          </div>
          <div className="block">
            <h4>Formatas</h4>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20 }}>
              A2 spauda{a.id === "aida" ? " · kubai 50×50 cm" : ""}
            </div>
          </div>
        </div>
        <div className="essay">
          {a.essay.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      {/* Gallery header */}
      <div className="a-gallery-head">
        <h3>Darbų galerija</h3>
        <div className="mono count">{String(a.gallery.length).padStart(2, "0")} {ltPlural(a.gallery.length, "kūrinys", "kūriniai", "kūrinių")}</div>
        <div className="gal-controls">
          <button className={layout === "grid" ? "active" : ""} onClick={() => setLayout("grid")}>Tinklelis</button>
          <button className={layout === "mosaic" ? "active" : ""} onClick={() => setLayout("mosaic")}>Mozaika</button>
          <button className={layout === "strip" ? "active" : ""} onClick={() => setLayout("strip")}>Juosta</button>
        </div>
      </div>

      {layout === "grid" && (
        <div className={"gal-grid" + (a.gallery.length >= 12 ? " cols-4" : a.gallery.length <= 4 ? " cols-2" : "")}>
          {a.gallery.map((g, i) => (
            <GalItem key={i} g={g} i={i} onOpen={openLb} />
          ))}
        </div>
      )}

      {layout === "mosaic" && (
        <div className="gal-mosaic">
          {a.gallery.map((g, i) => (
            <GalItem key={i} g={g} i={i} onOpen={openLb} mosaic />
          ))}
        </div>
      )}

      {layout === "strip" && (
        <div className="gal-strip">
          {a.gallery.map((g, i) => (
            <GalItem key={i} g={g} i={i} onOpen={openLb} />
          ))}
        </div>
      )}

      {/* Next author */}
      <section className="next-author"
               role="button"
               tabIndex={0}
               aria-label={`Kitas autorius: ${next.firstName} ${next.lastName}`}
               onClick={() => go("autorius/" + next.id)}
               onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go("autorius/" + next.id); } }}>
        <div className="next-portrait">
          <img src={next.portrait} alt={next.firstName + " " + next.lastName} loading="lazy" />
        </div>
        <div>
          <div className="label">Kitas autorius · № {next.index}</div>
          <div className="name">
            {next.firstName} <em>{next.lastName}</em>
          </div>
          <div style={{ marginTop: 10, color: "var(--muted)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 20 }}>
            „{next.cycle}"
          </div>
        </div>
        <div className="arrow">→</div>
      </section>

      <Footer />

      {lb != null && (
        <Lightbox
          items={a.gallery}
          index={lb}
          authorName={a.firstName + " " + a.lastName}
          onClose={closeLb}
          onPrev={prevLb}
          onNext={nextLb}
        />
      )}
    </main>
  );
}

function GalItem({ g, i, onOpen, mosaic, authorName }) {
  return (
    <div className="gal-item"
         role="button"
         tabIndex={0}
         aria-label={`Atidaryti kūrinį ${g.title}`}
         onClick={() => onOpen(i)}
         onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(i); } }}>
      <div className="img-wrap" style={mosaic ? { aspectRatio: "auto" } : undefined}>
        <img src={g.src} alt={authorName ? `${authorName} — ${g.title}` : g.title} loading="lazy"
             style={mosaic ? { height: "auto", aspectRatio: "auto" } : undefined} />
      </div>
      <div className="cap">
        <div className="t">{g.title}</div>
        <div className="n">{String(i + 1).padStart(2, "0")} · {g.format}</div>
      </div>
    </div>
  );
}

window.AuthorPage = AuthorPage;

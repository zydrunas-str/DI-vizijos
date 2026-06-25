// Home page — intro / exhibition landing

function HomePage() {
  const ex = window.EXHIBITION;
  const authors = window.AUTHORS;

  return (
    <main id="main">
      <section className="hero">
        <div className="hero-meta">
          <div className="mono l">Parodos pradžia</div>
          <div className="mono" style={{ color: "var(--muted)", textAlign: "center" }}>
            Keliaujanti paroda · 2025–2026
          </div>
          <div className="mono l" style={{ textAlign: "right", whiteSpace: "nowrap" }}>ETM · Vilnius • 2025 · balandžio 15</div>
        </div>

        <div className="hero-title">
          <h1 className="display">
            <span className="accent">DI</span> vizijos
            <span className="small-line" style={{ fontStyle: "italic" }}>algoritminiai žaidimai</span>
          </h1>
          <div className="hero-side">
            <div className="mono" style={{ color: "var(--muted)", marginBottom: 8, letterSpacing: '.12em' }}>KURATORĖ</div>
            <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, marginBottom: 16 }}>
              Aida Vėželienė
            </div>
            <div>
              Penkių autorių grupinė paroda, kurioje DI tampa kūrybine žaidimo aikštele — nuo juodai baltų metaforų iki siurrealistinių haliucinacijų.
            </div>
          </div>
        </div>

        <div className="hero-figure">
          <img src={(window.__resources && window.__resources.r_hero) || "assets/hero.jpg"} alt='Debesys ir oranžinė figūra — parodos „DI vizijos" plakatas' />
        </div>
      </section>

      {/* About / lead paragraph */}
      <section className="about" id="info">
        <div className="lead">
          <p>
            <em className="accent">Žaidybiškumas mene</em> — tai reiškinys, lydintis žmoniją nuo pat jos kūrybinės veiklos pradžios.
          </p>
          <p>
            Vaizdų generavimas su dirbtiniu intelektu — tai savotiškos žaidimo aikštelės, kur susilieja menas ir mokslas. Žmogus suteikia viziją ir emocijas, o algoritmas — beribes technines galimybes.
          </p>
          <p style={{ fontSize: 18, color: "var(--muted)", fontStyle: "italic" }}>
            Jums pristatomi parodos darbai — nuo kinematografinio siužeto iki siurrealistinės vizijos — atskleidžia dirbtinio intelekto ir kūrėjo įvairiapusiškumą.
          </p>
        </div>
        <div className="meta-stack">
          <div className="item">
            <div className="k">Paroda</div>
            <div className="v"><em>DI vizijos:</em> algoritminiai žaidimai</div>
          </div>
          <div className="item">
            <div className="k">Vieta</div>
            <div className="v">Keliaujanti paroda<br/><span style={{ fontSize: 14, color: "var(--muted)", fontFamily: "var(--sans)", fontStyle: "normal" }}>Vilnius · Anykščiai · Vilnius</span></div>
          </div>
          <div className="item">
            <div className="k">Autoriai</div>
            <div className="v">5 kūrėjai · <em>114 darbų</em></div>
          </div>
          <div className="item">
            <div className="k">Komunikacijos partneriai</div>
            <div className="v" style={{ fontSize: 16 }}>The Critical</div>
          </div>
        </div>
      </section>

      {/* Touring schedule */}
      <section className="section tour" id="tvarkarastis">
        <div className="section-head section-head-center">
          <h2>Parodos <em>maršrutas</em></h2>
          <div className="tour-sub">Keliaujanti paroda — keturios stotelės 2025–2026 m.</div>
        </div>

        <div className="tour-list">
          <div className="tour-row">
            <div className="tour-n mono">01</div>
            <div className="tour-when">
              <div className="mono k">2025</div>
              <div className="v"><em>balandžio 15</em>rugpjūčio 31</div>
            </div>
            <div className="tour-where">
              <div className="venue">Energetikos ir technikos muziejus</div>
              <div className="addr mono">Rinktinės g. 2, Vilnius</div>
            </div>
          </div>

          <div className="tour-row">
            <div className="tour-n mono">02</div>
            <div className="tour-when">
              <div className="mono k">2025</div>
              <div className="v"><em>spalio 20</em>lapkričio 20</div>
            </div>
            <div className="tour-where">
              <div className="venue">Anykščių L. ir S. Didžiulių viešosios bibliotekos<br/>Andrioniškio filialas</div>
              <div className="addr mono">Anykščių g. 48, Andrioniškis</div>
            </div>
          </div>

          <div className="tour-row">
            <div className="tour-n mono">03</div>
            <div className="tour-when">
              <div className="mono k">2026</div>
              <div className="v"><em>sausio 7</em>vasario 6</div>
            </div>
            <div className="tour-where">
              <div className="venue">Vilniaus miesto savivaldybės centrinė biblioteka<br/>Lazdynų biblioteka</div>
              <div className="addr mono">Architektų g. 17, Vilnius</div>
            </div>
          </div>

          <div className="tour-row">
            <div className="tour-n mono">04</div>
            <div className="tour-when">
              <div className="mono k">2026</div>
              <div className="v"><em>kovo 16</em>balandžio 24</div>
            </div>
            <div className="tour-where">
              <div className="venue">Žurnalistų namai</div>
              <div className="addr mono">Jogailos g. 11, III a., Vilnius</div>
            </div>
          </div>
        </div>
      </section>

      {/* Authors index */}
      <section className="section" id="autoriai">
        <div className="section-head section-head-center">
          <h2>Parodos <em>autoriai</em></h2>
        </div>

        <div className="authors-list">
          {authors.map((a, i) => (
            <div key={a.id} className="author-row"
                 onClick={() => go("autorius/" + a.id)}
                 role="button"
                 tabIndex={0}
                 aria-label={`Atidaryti autoriaus ${a.firstName} ${a.lastName} puslapį`}
                 onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go("autorius/" + a.id); } }}>
              <div className="portrait-thumb">
                <img src={a.portrait} alt={a.firstName + " " + a.lastName} loading="lazy" />
              </div>
              <div className="name">
                {a.firstName} <em>{a.lastName}</em>
                <span className="role-sub">{a.role}</span>
              </div>
              <div className="tag">
                <span className="cycle">„{a.cycle}"</span>
                {a.tagline}
              </div>
              <div className="chev">{a.gallery.length} {ltPlural(a.gallery.length, "darbas", "darbai", "darbų")}  →</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

window.HomePage = HomePage;

# DI vizijos — UI/UX auditas ir taisymo instrukcija

**Svetainė:** https://zydrunas-str.github.io/DI-vizijos/
**Auditas atliktas:** 2026 m. balandžio 25 d.
**Pagrindas:** Pilnas HTML/CSS/JSX kodo auditas (React SPA su 5 komponentais)

---

## Trumpas vertinimas

Vizualinė koncepcija stipri — redakcinė „popierinė" estetika su Cormorant Garamond serif'u, oranžiniu akcentu (#ca6022) ir grūdėtumo overlay yra tinkama meno parodos kontekstui. Architektūra švari (3 ekranai — pradžia, autoriaus puslapis, bendra galerija; hash routing). Tačiau yra **vienas tikras CSS bug'as**, **labai prastas mobile responsive** (tik vienas breakpoint visam mobile diapazonui) ir nemažai prieinamumo (a11y) problemų.

**Prioritetai:**
1. 🔴 1 kritinis CSS bug'as
2. 🟠 Mobile versijos perdarymas (svarbu — dabar lūžta <600px ekranuose)
3. 🟡 Prieinamumo (WCAG) ir tablet breakpoint'ai
4. 🟢 SEO/performance polish

---

## 🔴 KRITINĖS KLAIDOS — taisyti pirmiausia

### 1. CSS sintaksės klaida `.hero-figure img` (CSS, ~673 eil.)

Kodo bloke yra **3 nepanaudoti CSS deklaravimai už uždarančio skliausto** — naršyklė juos tiesiog ignoruoja:

```css
/* Dabartinė klaida: */
.hero-figure img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  object-position: center;
}
  object-fit: cover;          /* ← orphan, nepanaudota */
  object-position: center 30%;/* ← orphan */
  filter: contrast(1.02);     /* ← orphan */
}                             /* ← orphan uždarantis skliaustas */
```

**Pasekmė:** Hero paveikslėlis (debesys + oranžinė figūra) parodomas su `contain`, todėl plačiame ekrane atsiranda popieriaus spalvos juostos kairėje/dešinėje. Greičiausiai norėjai `cover` su poslinkiu ir kontrastu.

**Pataisymas:**
```css
.hero-figure img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center 30%;
  filter: contrast(1.02);
}
```

### 2. Tuščias hero meta vidurinis langelis (`script2.js`, ~12 eil.)

```jsx
<div className="mono" style={{ color: "var(--muted)", textAlign: "center" }}>
  { }   {/* ← literalus tuščias placeholder */}
</div>
```

**Pasekmė:** Tarp „Parodos pradžia" ir „ETM · Vilnius • 2025" yra tuščia vieta — atrodo kaip nepatvarkytas elementas. Užpildyk arba pašalink visą `<div>`.

### 3. Footer'is su trim taškais be turinio

`script1.js`, eil. 163 ir `script2.js` taip pat:
```jsx
<span style={{ color: "var(--muted)" }}>Vilnius · Anykščiai · · ·</span>
```

Trys taškai be kito teksto atrodo kaip palikti placeholder'iai. Arba surašyk visus stop'us, arba užbaik tinkamai (pvz., „Vilnius · Anykščiai · …").

### 4. Footer'io datos „2026 m. balandžio 24 d." prieštarauja maršrutui

Footer'is sako paroda iki **2026.04.24**, bet maršraste paskutinė stotelė „Žurnalistų namai" eina iki **2026.04.24** ✓ — OK, datos sutampa. Bet `EXHIBITION.dates` data.js'e: `"2025 m. balandžio 15 d. – rugpjūčio 31 d."` — tai tik **pirmas** stop'as. Reikia atnaujinti į pilną tūro datų ribą arba pažymėti, kad „pirmas stop'as".

---

## 🟠 MOBILE VERSIJA — esminiai dalykai

**Pagrindinė problema:** Yra tik **vienas** breakpoint — `@media (max-width: 900px)`. Tai reiškia, kad 901–1024px (tablet'ai) gauna desktop layout'ą, kuris jiems per platus, o 320–600px (telefonai) gauna tą patį layout'ą, kuris suprojektuotas 600–900px tabletams. Reikia bent **3 breakpoint'ų**: `≤ 480px` (telefonas), `481–900px` (didelis telefonas / tablet portrait), `901–1280px` (tablet landscape / mažas laptop).

### 5. Navigacija telefone — neturi hamburger'io

Šiuo metu mobile'e visi 4 link'ai (`Paroda · Autoriai · Galerija · Info`) lieka eilėje horizontaliai per `display: flex` su 10px font'u ir 14px gap'u. Skaičiavimas:
- 4 link'ai × ~70px (po 10px font'as su .14em letter-spacing UPPERCASE) = ~280px
- + brand'as „DI vizijos" su nowrap (~120px)
- + 40px paddings
- = **~440px** užimta navigacijos eilutei

Telefone, kur ekranas 360–414px, **nav'as fiziškai netelpa** ir lūžta arba kompresuojasi. Reikia hamburger drawer'io.

**Sprendimas:**
- ≤ 600px: rodyk hamburger ikoną dešinėje, drawer slenkasi iš dešinės
- 601–900px: dabartinis layout su mažesniu šriftu — OK
- ≥ 901px: pilnas layout

### 6. Touch target'ai per maži

Apple HIG ir WCAG 2.5.5 reikalauja **min. 44×44px** spaudžiamų zonų; Material Design — 48×48px. Dabar:

| Elementas | Dabartinis | Reikia |
|---|---|---|
| `.nav-links a` | ~24px aukščio (6px padding-y, 12px text) | min. 44px |
| `.gal-controls button` | ~28px (6px padding-y) | min. 44px |
| `.lightbox .close` | ~32px | 44px |
| Filter chips | ~36px | 44px (border-line) |
| `.lightbox .nav-btn` | 72×72 ✓ | OK |

Padidink padding'us mobile'e arba pridėk neperžiūrimą `min-height: 44px` mygtukams.

### 7. `.tour-row` neperdaroma mobile'e

Desktop grid'as `60px 1fr 1.6fr` lieka mobile'e (jokio override). 360px ekrane tai duoda ~60px + 110px + 175px su 40px gap'u — vienos eilutės vietoje datos ir vietos langeliai susispaudžia, ilgi adresai (pvz. „Anykščių L. ir S. Didžiulių viešosios bibliotekos / Andrioniškio filialas") lūžta į 4–5 eilutes ir audiotek'as išauga.

**Sprendimas:**
```css
@media (max-width: 600px) {
  .tour-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 24px 4px;
  }
  .tour-n { font-size: 11px; opacity: .7; }
}
```

### 8. `.next-author` mobile'e overflow'ina

Mobile breakpoint išlaiko `auto 1fr auto` su pavadinimu `clamp(48px, 7vw, 88px)`. „Žydrūnas **Strumila**" arba „Gerda **Lukoševičiūtė**" prie 360px ekrano + 70×90 nuotrauka + rodyklė tikrai overflow'ins arba bus apkarpytas.

**Sprendimas:** mobile'e
```css
.next-author {
  grid-template-columns: 1fr auto;
  gap: 16px;
}
.next-author .next-portrait { display: none; } /* arba mažesnė ir absolute */
.next-author .name { font-size: clamp(28px, 6vw, 40px); }
.next-author .arrow { font-size: 40px; }
```

### 9. Galerijos „Juosta" (filmstrip) layout'as nesuprantamas mobile'e

`.gal-strip` naudoja horizontalų scroll su scroll-snap'u. Mobile'e:
- nėra vizualinės užuominos, kad turinys slenkasi į šoną (Safari mobile slepia scroll bar'ą)
- 360px ekrane vienas item'as 360px platus → tiksliai vienas matomas, bet user'iui neaišku, kad yra dar

**Sprendimas:** Pridėk fade gradientą dešinėje pusėje arba mažas „‹ ›" rodykles, arba mažesnį item width'ą (pvz. 280px) kad telefone matytųsi 1.2 item'o (taip user'is supranta, kad reikia slinkti).

### 10. Lightbox'o navigacijos mygtukai mobile'e dengia paveikslėlį

```css
.lightbox .nav-btn.prev { left: 4px; }   /* mobile */
.lightbox .nav-btn.next { right: 4px; }  /* mobile */
```

72×72px mygtukas + 4px nuo krašto = mygtukas siekia 76px nuo ekrano krašto. Su `padding: 40px 12px 20px` stage'ui paveikslėlis maksimaliai naudoja apie 360-24=336px. Mygtukai dengs paveikslėlio kraštus.

**Sprendimas:** mobile'e mažesni mygtukai (48×48), permatomesnis fonas:
```css
@media (max-width: 600px) {
  .lightbox .nav-btn { width: 48px; height: 48px; font-size: 32px; }
  .lightbox .stage { padding: 60px 60px 80px; }
}
```

### 11. „Cape figure" floating SVG telefone — gerai paslėpta, bet…

Mobile'e `display: none` — gerai. Bet **tablet'uose** (901–1024px) ji vis dar `position: fixed` apačioje dešinėje su `pointer-events: none` ir gali užlįsti ant footer'io copy. Padidink media query iki `≤ 1024px` arba duok jai `mix-blend-mode: multiply` ir mažesnį dydį.

### 12. `.author-row` hover transform'as nematomas telefone

Desktop'e:
```css
.author-row:hover { transform: translateX(10px); background: rgba(217,106,42,0.04); }
```

Touch'e nėra hover. User'iui nematyti, kad eilutė yra spaudžiama. Pridėk `:active` arba ryškiau pažymėk strėlytę / chevron arba rodyk subtilų border'į kairėje pusėje:

```css
@media (hover: none) {
  .author-row { border-left: 3px solid transparent; padding-left: 12px; }
  .author-row:active { border-left-color: var(--accent); background: rgba(217,106,42,0.06); }
}
```

---

## 🟡 PRIEINAMUMAS (WCAG / a11y)

### 13. Spalvų kontrastas neatitinka WCAG AA

Patikrinau 3 didžiausio rūpesčio porus:

| Tekstas | Spalva ant `--paper #ece8df` | Kontrastas | Verdiktas |
|---|---|---|---|
| `.muted #807b72` | normalus tekstas | **~3.7:1** | ❌ AA reikia 4.5:1 |
| `.accent #ca6022` | normalus tekstas | **~3.5:1** | ❌ AA reikia 4.5:1 |
| `.ink-soft #2a2926` | bet koks | ~13.5:1 | ✅ |

`--muted` naudojamas: `.role-sub` (12px), `.tour-when .k`, `.footer .small` (10px), `.section-head` mono labels — visur fail'ina WCAG AA. **Patamsink iki bent `#6a665e`** (≈ 5.0:1).

`.accent` naudojama italic'ams pavadinimuose (didelis tekstas — 18pt+ leidžiama 3:1, čia OK kai serif'as didelis), bet `.author-row .chev` → 12px su accent on hover → **reikia patamsinti accent'ą** iki bent `#a04515` arba naudoti tik dideliems tekstams.

### 14. Trūksta `:focus-visible` stilių

Niekur kode neradau `:focus` ar `:focus-visible` stilių. Tab'u keliaujančiam user'iui nematomas focus'as. Pridėk:

```css
:where(a, button, [role="button"], [tabindex]):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}
```

### 15. Klaviatūros prieinamumas — kelios spragos

- **`.author-row`** turi `role="button"` ir `tabIndex={0}`, bet `onKeyDown` reaguoja **tik į Enter**. ARIA spec reikalauja, kad button'ai veiktų ir su **Space**:
  ```jsx
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go("autorius/" + a.id);
    }
  }}
  ```
- **`.gal-item`** apskritai neturi `role`, `tabIndex`, klaviatūros handler'io. Vartotojas, naudojantis tab'ą, negali atidaryti darbo lightbox'e.
- **`.next-author`** ta pati problema — `onClick` yra, bet jokio `role`, `tabIndex`, `onKeyDown`.
- **`.tour-row`** — neaišku, ar interaktyvus (turi `:hover` background change). Jei interaktyvus — pridėk visus a11y atributus; jei ne — pašalink hover'į arba padaryk subtilesnį.

### 16. Lightbox'as netvarko fokuso

Atidarius lightbox'ą:
- Fokusas **nepersikelia** į close mygtuką
- Tab'as išeina iš lightbox'o atgal į pagrindinį turinį (focus trap'o nėra)
- Užvėrus, fokusas **negrąžinamas** į elementą, kurį spaudėme

Tai pažeidžia WCAG 2.4.3 (Focus Order). Paprastas sprendimas — `useEffect`'e: išsaugok `document.activeElement` prieš atidarymą, fokusuok close mygtuką, uždarymo metu grąžink. Focus trap'ą galima daryti su `inert` atributu ant pagrindinio turinio.

### 17. Trūksta ARIA atributų

- `<nav className="nav">` — pridėk `aria-label="Pagrindinė navigacija"`
- Hamburger mygtukas (kai padarysi) — `aria-expanded`, `aria-controls`
- Lightbox — `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (rodančio kūrinio pavadinimo)
- Filter chips — naudok `aria-pressed` vietoj klasės `.active` arba bent kartu

### 18. Skip-to-content link'as

Pridėk pirma elementu body viduje:
```jsx
<a href="#main" className="skip-link">Pereiti prie turinio</a>
```
su CSS, kuris `position: absolute; left: -9999px` pagal default'ą, bet `:focus` rodo virš nav'o.

### 19. `<noscript>` neturi turinio

Dabar tik užrašas „This page requires JavaScript". SEO crawler'iams ir ne-JS user'iams nematyti turinio. Pridėk bent išplėstinį `<noscript>`:
- Parodos pavadinimas
- Trumpas aprašas
- Datos, vieta
- Autorių sąrašas su nuorodomis (gal į PDF arba alternatyvų puslapį)

### 20. Image `alt` tekstas

- Hero alt: `"Cloud and cape — DI vizijos"` — **angliškai** lietuviškoje svetainėje. Pataisyk į lietuvių.
- Portreto alt'as — tik vardas+pavardė. OK.
- Galerijos darbų alt — tik kūrinio pavadinimas. Geriau būtų pridėti autoriaus vardą: `alt="Aida Vėželienė — Anti-utopia, A2 spauda"`.

---

## 🟢 SEO / DALINIMOSI / PERFORMANCE

### 21. Trūksta meta tag'ų — sharing'as visai nieko nerodo

Šiuo metu `<head>` turi tik `<title>`, `charset`, `viewport`. Reikia:

```html
<meta name="description" content="DI vizijos: algoritminiai žaidimai — penkių lietuvių autorių grupinė paroda. 2025–2026 m. keliaujanti paroda Lietuvoje.">
<meta name="theme-color" content="#ece8df">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="DI vizijos: algoritminiai žaidimai">
<meta property="og:description" content="Penkių lietuvių autorių grupinė paroda — DI kaip kūrybinė žaidimo aikštelė.">
<meta property="og:image" content="https://zydrunas-str.github.io/DI-vizijos/og-image.jpg">
<meta property="og:url" content="https://zydrunas-str.github.io/DI-vizijos/">
<meta property="og:locale" content="lt_LT">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">

<!-- Favicon -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

og-image turi būti **1200×630px**. Pasidaryk vieną atskirą paveiksliuką su parodos plakatu.

### 22. Performance — viskas viename 18MB faile

Įsidėmėtina, bet tai yra **artifact bundle** (visi paveikslėliai base64'inti į HTML), o ne tradicinė svetainė. Tai veikia, bet:

- **Pirmoji peržiūra** — vartotojas atsisiunčia 18MB prieš matydamas turinį. Mobile'e per LTE tai gali užtrukti 30–60s.
- **Nėra cache strategijos** — atnaujinus svetainę, viskas atsisiunčiama iš naujo.
- **Babel transformacija naršyklėje** lėtina pirmąjį render'į (vidutiniškai +200–500ms).

**Sprendimas:**
1. Iškelk paveikslėlius į atskirus failus (jpg, optimizuotus su `mozjpeg` arba `sharp` -> webp/avif), užkrauk lazy.
2. Kompiliuok JSX su Vite/esbuild į statinius .js failus.
3. Pridėk responsive `srcset`:
   ```html
   <img srcset="hero-800.jpg 800w, hero-1200.jpg 1200w, hero-2000.jpg 2000w"
        sizes="(max-width: 900px) 100vw, 90vw"
        src="hero-1200.jpg" alt="..." loading="eager" fetchpriority="high">
   ```

### 23. Šriftų užkrovimas — daug nereikalingų subset'ų

Cormorant Garamond užkrauna **5 unicode-range subsetus** (cyrillic-ext, cyrillic, vietnamese, latin-ext, latin) × 4 styles (italic 400, italic 500, regular 400, regular 500) = **20 šrifto failų**. Lietuvių kalbai reikia tik `latin` + `latin-ext`. Pakeisk Google Fonts URL'ą:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap&subset=latin-ext"
      rel="stylesheet">
```

Arba (geriau) self-host'ink šriftus (woff2) — Google Fonts CDN reikalauja papildomo DNS lookup'o.

### 24. Reduced motion

Pridėk:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 25. SEO — be pre-render'io Google nemato turinio

React SPA su client-side rendering'u + Babel = robotai mato tuščią body. Sprendimai:
- **Statiškai pre-render'ink** namų puslapį ir 5 autoriaus puslapius (galima rankomis, nes turinio nedaug)
- Arba mažiausiai įdėk pilną tekstinę versiją `<noscript>` viduje

---

## 📐 DESKTOP — papildomi polish'ai

### 26. Tablet breakpoint'as (901–1280px)

Dabar šio diapazono nėra. `.gal-grid.cols-4` 1024px ekrane = 4 stulpeliai po ~230px → kūriniai per maži, A2 proporcija (1:1.414) atrodo telefoniškai. Pridėk:

```css
@media (max-width: 1280px) {
  .gal-grid.cols-4 { grid-template-columns: repeat(3, 1fr); }
  .a-hero { gap: 40px; }
  .section { padding: 60px var(--page-gutter); }
}
```

### 27. Hero h1 dydis ant ultrawide ekranų

`clamp(72px, 12vw, 200px)` — ant 2560px ekrano 12vw=307px, bet maksimumas 200px. Tai gerai. Bet ant 1440px → 172px, o tarpas tarp `<h1>` ir `.hero-side` (320px max-width) padaro keistą balansą — pavadinimas nustelbia šalutinę informaciją. Apsvarstyk maxinti iki 160px.

### 28. `.section-head` desktop'e turi 200px dešinę juostą — ne visada panaudojama

```css
.section-head { grid-template-columns: 80px 1fr 200px; }
```

Bet daugumoje `<SectionHead>` kvietimų dešinė juosta tuščia. Tai sukuria neaiškų asimetrišką tarpą. Apsvarstyk default'ą `auto 1fr` ir tik tame, kur reikia, prijunk fiksuotą trečiąją koloną.

### 29. Sticky nav'as su backdrop-filter

```css
.nav { backdrop-filter: blur(8px); }
```

Veikia gerai modern naršyklėse, bet:
- Safari iki 16 reikia `-webkit-backdrop-filter` ✓ (turima)
- Firefox <103 visiškai nepalaiko (ten matosi 82% opacity fonas, kuris vis tiek gana neperžiūrimas — OK)

Tačiau **fizinis galvos skausmas** — sticky `.nav` su `.hero` ploniausiu tarpu sukelia situaciją, kur nav'o `border-bottom` ir hero `border-top` arba meta-row susiglaudžia. Pridėk `.hero { padding-top: 60px }` jau yra ✓ — viskas OK.

### 30. Lightbox'o desktop padding'as 100px iš šono

```css
.lightbox .stage { padding: 60px 100px 40px; }
```

Ant 1280px ekrano paveikslėlis maksimaliai 1080px platus. Galerijoje yra A2 darbai (~1414×2000px portrait'as). 1080px tinka, bet ant 1024px laptop'o paveikslas tampa 824px platus → tampa pernelyg mažas išryškinti detales. Apsvarstyk 60px arba responsive padding'ą.

---

## 🛠 KODŲ PATAISYMŲ SUVESTINĖ

Greita „turi padaryti" priorityzuota lentelė — viskas surašyta sąrašu, kad galėtum žymėti baigtus:

### Blokuotojai (1 diena)
- [ ] Pataisyti `.hero-figure img` CSS (#1)
- [ ] Pašalinti tuščią hero-meta langelį (#2)
- [ ] Sutvarkyti placeholder taškus footer'yje (#3)
- [ ] Atnaujinti EXHIBITION.dates lauką (#4)

### Mobile (2–3 dienos)
- [ ] Įvesti 3 breakpoint'us: 480 / 768 / 1024 (#5–6, 26)
- [ ] Hamburger nav drawer (#5)
- [ ] Padidinti touch target'us iki 44px (#6)
- [ ] Perdaryti `.tour-row`, `.next-author`, `.lightbox .nav-btn` mobile'e (#7, 8, 10)
- [ ] Filmstrip vizualinė užuomina (#9)
- [ ] `:active` būsenos vietoj hover'o (#12)

### A11y (1–2 dienos)
- [ ] Patamsinti `--muted` ir `.accent` spalvas (#13)
- [ ] Pridėti `:focus-visible` visiems (#14)
- [ ] Sutvarkyti klaviatūros nav'ą (#15)
- [ ] Lightbox focus trap (#16)
- [ ] ARIA atributai (#17)
- [ ] Skip link (#18)
- [ ] Lietuviškas hero alt + papildomi alt'ai (#20)

### SEO/Performance (1 diena)
- [ ] og: + meta description + favicon (#21)
- [ ] Šriftų subset'as tik latin + latin-ext (#23)
- [ ] `prefers-reduced-motion` (#24)
- [ ] Plėsti `<noscript>` su pagrindiniu turiniu (#19, 25)

### Desktop polish (pasirinktinai)
- [ ] Tablet breakpoint'as (#26)
- [ ] `.section-head` lankstesnis (#28)
- [ ] Hero h1 maksimumas (#27)

---

## Užbaigimas

Svetainė yra **labai gražiai sukurta vizualiai**, paroda turi tikrą charakterį, ir kūrinių pristatymas su 3 layout'o variantais (Tinklelis / Mozaika / Juosta) yra tikrai geras editorial'inis sprendimas. Pagrindiniai darbai sutelkti į (1) vieną CSS bug'ą, (2) mobile responsive'o pertvarkymą su tinkamais breakpoint'ais ir hamburger'iu, (3) prieinamumo skoles. Po šių pataisymų svetainė bus production-ready ir parodos kontekste atrodys profesionaliai bet kuriame įrenginyje.

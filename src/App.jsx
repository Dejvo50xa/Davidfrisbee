import { useState, useEffect, useRef, useCallback } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const WBUC_RESULTS = [
  { phase: "Pool B",       opponent: "Venezuela",    us: 13, them: 3  },
  { phase: "Pool B",       opponent: "Lebanon",      us: 13, them: 3  },
  { phase: "Pool B",       opponent: "Spain",        us: 8,  them: 9  },
  { phase: "Pool B",       opponent: "Japan",        us: 13, them: 8  },
  { phase: "Pool B",       opponent: "Portugal",     us: 13, them: 9  },
  { phase: "Pool B",       opponent: "Australia",    us: 10, them: 9  },
  { phase: "Power Pool F", opponent: "Germany",      us: 6,  them: 13 },
  { phase: "Power Pool F", opponent: "India",        us: 8,  them: 9  },
  { phase: "Power Pool F", opponent: "Great Britain",us: 13, them: 7  },
  { phase: "Playoffs",     opponent: "Philippines",  us: 13, them: 11 },
  { phase: "Playoffs",     opponent: "Canada",       us: 12, them: 9  },
  { phase: "Playoffs",     opponent: "Australia",    us: 6,  them: 10 },
  { phase: "Bronze Medal", opponent: "Spain",        us: 12, them: 11, final: true },
];

const WBUC_PHOTOS = [
  { file: "_MG_2645.jpg", caption: "Bronze medal moment" },
  { file: "_MG_2658.jpg", caption: "Celebrations on the beach" },
  { file: "_MG_2659.jpg", caption: "Czech team — the moment" },
  { file: "_MG_2663.jpg", caption: "Together on the beach" },
  { file: "_MG_2676.jpg", caption: "The embrace" },
  { file: "_MG_2681.jpg", caption: "Pure joy" },
  { file: "_MG_2685.jpg", caption: "After the battle" },
];

const MIX_PHOTOS = [
  { file: "_MG_1453.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1456.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1459.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1462.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1486.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1503.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1518.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1522.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1533.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1539.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1551.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1554.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1561.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1564.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1783.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1901.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1921.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1938.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1945.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1971.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1975.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1989.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2526.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2533.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2544.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2549.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2561.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2621.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2623.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2631.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2649.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2667.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2672.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3272.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3296.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3326.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3344.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3471.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3490.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3510.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3513.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3515.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3517.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3518.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3520.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3534.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3539.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3553.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3559.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3562.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3565.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3576.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3584.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3589.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3597.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3663.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3668.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3674.jpg", caption: "Czech Mixed 2026" },
];

const TEAMS = [
  { name: "Rhino Slam!", country: "United States", years: "2024", note: "US National Champions" },
  { name: "Gentle", country: "Belgium", years: "", note: "Belgian Elite Club" },
  { name: "Chupacabras", country: "Czech Republic", years: "", note: "Czech Elite Club" },
  { name: "Fuj", country: "Czech Republic", years: "", note: "Czech Elite Club" },
  { name: "3sb", country: "Czech Republic", years: "", note: "Czech Elite Club" },
  { name: "Czech Open", country: "Czech Republic", years: "2015 · 2019 · 2023", note: "National Team" },
  { name: "Czech Mixed", country: "Czech Republic", years: "2016 · 2026", note: "National Team" },
];

// ── GLOBE CANVAS ──────────────────────────────────────────────────────────────

function Globe() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener("resize", resize);
    const R = () => Math.min(canvas.width, canvas.height) * 0.38;
    const LAT = 18, LON = 24;
    const meshLines = [];
    for (let i = 0; i <= LAT; i++) {
      const phi = (i / LAT) * Math.PI;
      const pts = [];
      for (let j = 0; j <= LON * 2; j++) pts.push({ phi, theta: (j / (LON * 2)) * Math.PI * 2 });
      meshLines.push(pts);
    }
    for (let j = 0; j <= LON; j++) {
      const theta = (j / LON) * Math.PI * 2;
      const pts = [];
      for (let i = 0; i <= LAT * 2; i++) pts.push({ phi: (i / (LAT * 2)) * Math.PI, theta });
      meshLines.push(pts);
    }
    const STARS = Array.from({ length: 200 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.7 + 0.1 }));
    const PARTICLES = Array.from({ length: 60 }, () => ({ phi: Math.random() * Math.PI, theta: Math.random() * Math.PI * 2, r: Math.random() * 1.5 + 0.5 }));
    const project = (phi, theta, rot, cx, cy, radius) => {
      const x = Math.sin(phi) * Math.cos(theta + rot);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta + rot);
      return { x: cx + x * radius, y: cy - y * radius, z };
    };
    function draw() {
      const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2, radius = R();
      t += 0.003;
      ctx.clearRect(0, 0, w, h);
      STARS.forEach(s => { ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${s.a})`; ctx.fill(); });
      meshLines.forEach(pts => {
        ctx.beginPath(); let started = false;
        pts.forEach(({ phi, theta }) => {
          const p = project(phi, theta, t, cx, cy, radius);
          if (p.z >= -0.1) { if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y); }
          else { if (started) { ctx.strokeStyle = "rgba(180,200,255,0.18)"; ctx.lineWidth = 0.5; ctx.stroke(); ctx.beginPath(); started = false; } }
        });
        if (started) { ctx.strokeStyle = "rgba(180,200,255,0.18)"; ctx.lineWidth = 0.5; ctx.stroke(); }
      });
      PARTICLES.forEach(p => {
        const proj = project(p.phi, p.theta, t, cx, cy, radius);
        if (proj.z > 0) { ctx.beginPath(); ctx.arc(proj.x, proj.y, p.r * proj.z, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${proj.z * 0.8})`; ctx.fill(); }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

// ── HOOKS ─────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Fade({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.9s ${delay}s ease, transform 0.9s ${delay}s ease` }}>
      {children}
    </div>
  );
}

function SectionHeader({ num, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "4rem" }}>
      <span style={{ fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(100,150,255,0.7)" }}>{num}</span>
      <span style={{ width: 32, height: 1, background: "rgba(100,150,255,0.4)", display: "block" }} />
      <span style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{label}</span>
    </div>
  );
}

// ── LIGHTBOX WITH PREV / NEXT ─────────────────────────────────────────────────

function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index];
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  const handlePrev = useCallback((e) => { e?.stopPropagation(); if (hasPrev) onPrev(); }, [hasPrev, onPrev]);
  const handleNext = useCallback((e) => { e?.stopPropagation(); if (hasNext) onNext(); }, [hasNext, onNext]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, handlePrev, handleNext]);

  const arrowBtn = (enabled, onClick, side, char) => (
    <button
      onClick={onClick}
      style={{
        position: "absolute", top: "50%", [side]: "1.5rem", transform: "translateY(-50%)",
        background: enabled ? "rgba(255,255,255,0.1)" : "transparent",
        border: `1px solid ${enabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"}`,
        color: enabled ? "#fff" : "rgba(255,255,255,0.1)",
        borderRadius: "50%", width: 52, height: 52, fontSize: "1.4rem",
        cursor: enabled ? "pointer" : "default",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 10, transition: "all 0.2s",
      }}
      onMouseEnter={e => { if (enabled) e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
      onMouseLeave={e => { if (enabled) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
    >{char}</button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.96)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
      {arrowBtn(hasPrev, handlePrev, "left", "‹")}
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "86vw", maxHeight: "90vh", cursor: "default" }}>
        <img src={"/" + photo.file} alt={photo.caption} style={{ maxWidth: "86vw", maxHeight: "82vh", objectFit: "contain", display: "block" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.8rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{photo.caption}</p>
          <p style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(100,150,255,0.7)" }}>{index + 1} / {photos.length}</p>
        </div>
      </div>
      {arrowBtn(hasNext, handleNext, "right", "›")}
    </div>
  );
}

// ── PHOTO TILE ────────────────────────────────────────────────────────────────

function PhotoTile({ photo, onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", overflow: "hidden", cursor: "zoom-in", ...style }}
    >
      <img
        src={"/" + photo.file}
        alt={photo.caption}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }}
        onError={e => { e.target.style.background = "#111"; e.target.style.minHeight = "80px"; }}
      />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.85rem", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>{photo.caption}</p>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (photos, index) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const prevPhoto = useCallback(() => setLightbox(s => s && s.index > 0 ? { ...s, index: s.index - 1 } : s), []);
  const nextPhoto = useCallback(() => setLightbox(s => s && s.index < s.photos.length - 1 ? { ...s, index: s.index + 1 } : s), []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = [
      "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');",
      "*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }",
      "html { scroll-behavior:smooth; }",
      "body { background:#000; color:#fff; -webkit-font-smoothing:antialiased; }",
      "a { text-decoration:none; color:inherit; }",
      "::-webkit-scrollbar { width:3px; }",
      "::-webkit-scrollbar-track { background:#000; }",
      "::-webkit-scrollbar-thumb { background:#4466ff; }",
    ].join("\n");
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const phases = ["Pool B", "Power Pool F", "Playoffs", "Bronze Medal"];
  const resultsByPhase = phases.map(p => ({ phase: p, games: WBUC_RESULTS.filter(r => r.phase === p) }));
  const wins = WBUC_RESULTS.filter(r => r.us > r.them).length;
  const losses = WBUC_RESULTS.filter(r => r.us < r.them).length;

  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>

      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 3rem", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: "1rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>David</span>
        <ul style={{ display: "flex", gap: "2rem", listStyle: "none" }}>
          {["WBUC", "Results", "Career", "Teams", "Czech Mixed", "WUCC 2025"].map(l => (
            <li key={l}>
              <a href={"#" + l.replace(/\s/g, "")}
                style={{ fontSize: "0.78rem", fontWeight: 300, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
              >{l}</a>
            </li>
          ))}
        </ul>
        <a href="#WBUC" style={{ fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.08em", padding: "0.45rem 1.1rem", border: "1px solid rgba(255,170,51,0.5)", color: "rgba(255,200,100,0.9)", borderRadius: "4px", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,170,51,0.1)"; e.currentTarget.style.borderColor = "#ffaa33"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,170,51,0.5)"; }}
        >🥉 Bronze</a>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Globe />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", animation: "fade-in 1s 0.2s both" }}>
            World Beach Ultimate Championship
          </p>
          <h1 style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 300, lineHeight: 1.05, animation: "fade-in 1s 0.4s both" }}>
            Czech Republic<br /><span style={{ color: "#ffaa33" }}>Bronze Medal.</span>
          </h1>
          <p style={{ fontSize: "clamp(0.85rem, 1.4vw, 1rem)", fontWeight: 300, color: "rgba(255,255,255,0.5)", animation: "fade-in 1s 0.6s both" }}>
            16 years · 4 countries · 1 world podium
          </p>
          <div style={{ display: "flex", gap: "2rem", marginTop: "0.8rem", animation: "fade-in 1s 0.8s both" }}>
            {[["13", "Games"], [`${wins}W`, "Wins"], [`${losses}L`, "Losses"], ["🥉", "Medal"]].map(([v, l]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 300, color: "#fff", lineHeight: 1 }}>{v}</span>
                <span style={{ fontSize: "0.58rem", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", animation: "fade-in 1s 1.2s both", zIndex: 2 }}>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
        </div>
        <style>{`@keyframes fade-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </section>

      {/* ── WBUC PHOTOS ── */}
      <section id="WBUC" style={{ padding: "7rem 3rem 4rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,170,51,0.02)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade><SectionHeader num="01" label="WBUC — Road to Bronze" /></Fade>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginBottom: "5rem" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.2, marginBottom: "1.5rem" }}>
                World Beach Ultimate<br /><span style={{ color: "#ffaa33" }}>Bronze Medal.</span>
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.85 }}>
                Czech Republic at the World Beach Ultimate Championships. 13 games across pool play, power pool and playoffs. A tournament culminating in a dramatic 12–11 win over Spain in the bronze medal match.
              </p>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                {[["10", "Wins"], ["3", "Losses"], ["12–11", "Final score"]].map(([v, l]) => (
                  <div key={l} style={{ flex: 1, padding: "1.5rem 1rem", border: "1px solid rgba(255,170,51,0.15)", borderRadius: "6px", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 300, color: "#ffaa33", marginBottom: "0.5rem" }}>{v}</div>
                    <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          <Fade delay={0.05}>
            <p style={{ fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1.5rem" }}>
              Gallery — click to expand · ← → for next/prev
            </p>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
            {WBUC_PHOTOS.map((photo, i) => (
              <Fade key={photo.file} delay={i * 0.06}>
                <PhotoTile
                  photo={photo}
                  onClick={() => openLightbox(WBUC_PHOTOS, i)}
                  style={{
                    aspectRatio: i === 0 || i === 3 ? "16/10" : "4/3",
                    gridColumn: i === 0 ? "span 2" : "auto",
                  }}
                />
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS TABLE ── */}
      <section id="Results" style={{ padding: "5rem 3rem 7rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade><SectionHeader num="02" label="Match Results" /></Fade>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            {resultsByPhase.map(({ phase, games }) => {
              const isBronze = phase === "Bronze Medal";
              return (
                <Fade key={phase} delay={0.05}>
                  <div style={{ border: `1px solid ${isBronze ? "rgba(255,170,51,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: "8px", overflow: "hidden" }}>
                    <div style={{ padding: "0.8rem 1.2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: isBronze ? "rgba(255,170,51,0.07)" : "rgba(255,255,255,0.02)" }}>
                      <span style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: isBronze ? "#ffaa33" : "rgba(100,150,255,0.8)" }}>
                        {isBronze ? "🥉 " : ""}{phase}
                      </span>
                    </div>
                    {games.map((g, i) => {
                      const win = g.us > g.them;
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1rem", alignItems: "center", padding: "0.75rem 1.2rem", borderBottom: i < games.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: g.final ? "rgba(255,170,51,0.05)" : "transparent" }}>
                          <span style={{ fontSize: "0.82rem", color: g.final ? "#fff" : "rgba(255,255,255,0.65)", fontWeight: g.final ? 400 : 300 }}>
                            {g.opponent}
                          </span>
                          <span style={{ fontFamily: "monospace", fontSize: "0.88rem", fontWeight: 500, color: g.final ? "#ffaa33" : win ? "#6699ff" : "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
                            {g.us}–{g.them}
                          </span>
                          <span style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: g.final ? "#ffaa33" : win ? "rgba(100,220,100,0.8)" : "rgba(255,80,80,0.6)", minWidth: 18, textAlign: "right" }}>
                            {g.final ? "🥉" : win ? "W" : "L"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Fade>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CAREER ── */}
      <section id="Career" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade><SectionHeader num="03" label="Career" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.2, marginBottom: "1.5rem" }}>
                <span style={{ color: "#6699ff" }}>Sixteen years</span> of elite competition across four countries.
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.85 }}>
                Czech Open (2015, 2019, 2023) · Czech Mixed (2016, 2026) · Rhino Slam! US champions 2024 · WBUC bronze · WUCC 2025.
              </p>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
                {[
                  ["2009", "Began competitive ultimate frisbee"],
                  ["2015", "Czech Open National Team — debut"],
                  ["2016", "Czech Mixed National Team"],
                  ["2019", "Czech Open — second appearance"],
                  ["2020", "Windmill Windup medals (silver + 2× bronze)"],
                  ["2021", "World Beach Ultimate — bronze medal"],
                  ["2023", "Czech Open — third appearance"],
                  ["2024", "Rhino Slam! — US National Champions"],
                  ["2025", "WUCC — World Club Championships"],
                  ["2026", "Czech Mixed National Team"],
                ].map(([year, event], i) => (
                  <div key={year} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.8rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#6699ff", minWidth: 36 }}>{year}</span>
                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{event}</span>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── TEAMS ── */}
      <section id="Teams" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade><SectionHeader num="04" label="Teams" /></Fade>
          {TEAMS.map((t, i) => (
            <Fade key={t.name} delay={i * 0.05}>
              <div style={{ display: "grid", gridTemplateColumns: "2rem 1fr 1fr 1fr auto", gap: "1.5rem", alignItems: "center", padding: "1.2rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", borderTop: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "all 0.25s", opacity: hoveredTeam === null ? 1 : hoveredTeam === t.name ? 1 : 0.2 }}
                onMouseEnter={() => setHoveredTeam(t.name)}
                onMouseLeave={() => setHoveredTeam(null)}
              >
                <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(100,150,255,0.5)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: "1rem", fontWeight: 400 }}>{t.name}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{t.country}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>{t.note}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#6699ff", textAlign: "right" }}>{t.years || "—"}</span>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ── CZECH MIXED ── */}
      <section id="CzechMixed" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(100,150,255,0.015)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade><SectionHeader num="05" label="Czech Mixed" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginBottom: "5rem" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.2, marginBottom: "1.5rem" }}>
                Czech Republic<br /><span style={{ color: "#6699ff" }}>Mixed National Team.</span>
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.85 }}>
                Two appearances in the Czech Mixed national jersey — 2016 and 2026. Representing the country at the highest level of mixed ultimate, competing internationally with the best players in Czech frisbee.
              </p>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ border: "1px solid rgba(100,150,255,0.15)", borderRadius: "8px", overflow: "hidden" }}>
                {[["2016", "First mixed national team appearance"], ["2026", "Return to the national jersey — a decade of growth"]].map(({ 0: year, 1: detail }, i) => (
                  <div key={year} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "1.5rem", padding: "1.5rem", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none", alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "1.2rem", fontWeight: 300, color: "#6699ff" }}>{year}</span>
                    <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{detail}</span>
                  </div>
                ))}
                <div style={{ padding: "1rem 1.5rem", background: "rgba(100,150,255,0.06)", borderTop: "1px solid rgba(100,150,255,0.1)" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(100,150,255,0.7)" }}>Czech Republic · Mixed National Team · 2016 · 2026</span>
                </div>
              </div>
            </Fade>
          </div>
          <Fade delay={0.05}>
            <p style={{ fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1.5rem" }}>
              Gallery — click to expand · ← → for next/prev
            </p>
          </Fade>
          <div style={{ columnCount: 4, columnGap: "4px" }}>
            {MIX_PHOTOS.map((photo, i) => (
              <div key={photo.file} style={{ breakInside: "avoid", marginBottom: "4px" }}>
                <PhotoTile photo={photo} onClick={() => openLightbox(MIX_PHOTOS, i)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WUCC ── */}
      <section id="WUCC2025" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(100,150,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade><SectionHeader num="06" label="WUCC 2025" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.2, marginBottom: "1.5rem" }}>
                The <span style={{ color: "#6699ff" }}>World Stage.</span><br />August 2025.
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.85 }}>
                The World Ultimate Club Championships — the pinnacle of club competition globally. David enters as one of the most experienced players on a squad that has qualified and is ready to compete at the highest level.
              </p>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ border: "1px solid rgba(100,150,255,0.15)", borderRadius: "8px", overflow: "hidden" }}>
                {[
                  { label: "O-Line", text: "Primary system architect. Spread as the core offensive identity, vertical as emergency fallback." },
                  { label: "D-Line", text: "Smart poaching — reading passing lanes before the disc moves. Turnovers through anticipation." },
                  { label: "Leadership", text: "One of seven in the leadership group. Mentor and institutional memory for the squad." },
                ].map(({ label, text }, i) => (
                  <div key={label} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "1.5rem", padding: "1.5rem", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none", alignItems: "start" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6699ff" }}>{label}</span>
                    <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{text}</span>
                  </div>
                ))}
                <div style={{ padding: "1rem 1.5rem", background: "rgba(100,150,255,0.06)", borderTop: "1px solid rgba(100,150,255,0.1)" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(100,150,255,0.7)" }}>Czech Republic · August 2025 · World Stage</span>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>David</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Ultimate Frisbee · Czech Republic · 2009 — Present</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.1em", color: "#ffaa33" }}>WBUC 🥉 · WUCC 2025</span>
      </footer>

    </div>
  );
}

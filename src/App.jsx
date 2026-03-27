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

const TOURNAMENT_NARRATIVE = [
  {
    phase: "Pool Play",
    label: "Mon–Wed",
    score: "5W – 1L",
    heading: "Building momentum.",
    body: "Czech Republic opened pool play with back-to-back demolitions — 13–3 against Venezuela, 13–3 against Lebanon. Calm, structured, efficient. Then came Spain, the pool's top seed: an 8–9 loss that stung but also clarified the task ahead. The team responded with three straight wins, including a nervy 10–9 over Australia that went down to the wire. Portimão's heat didn't slow anyone down.",
    accent: false,
    canada: false,
  },
  {
    phase: "Power Pool F",
    label: "Wed–Thu",
    score: "1W – 2L",
    heading: "Two losses. One lesson.",
    body: "The power pool brought Germany and India — and two consecutive losses. 6–13, then 8–9. The India defeat, by a single point, was the kind of result that could unravel a team. It didn't. Czech Republic answered with a composed 13–7 win over Great Britain and moved into the playoff bracket carrying something more valuable than a perfect record: the knowledge they could absorb a punch and keep going.",
    accent: false,
    canada: false,
  },
  {
    phase: "vs Canada",
    label: "Thu 20 Nov",
    score: "12 – 9",
    heading: "Underdogs. One turnover. Done.",
    body: "Canada entered the bracket undefeated. They were the tournament's form team — consistent, powerful, and widely expected to reach the medal round. Czech Republic were clear underdogs on paper. What followed wasn't a thriller. It was a statement. The team played near-perfect offense across the entire game, committing just a single turnover from start to finish. Canada never found an answer. The final score — 12–9 — only told half the story.",
    accent: true,
    canada: true,
  },
  {
    phase: "Bronze Medal",
    label: "Fri 21 Nov · Portimão",
    score: "12 – 11",
    heading: "The hardest game.",
    body: "After a 6–10 loss to Australia in the semifinal, Czech Republic faced Spain in the bronze medal match — the same team that had beaten them in pool play. This time it went to the very wire. 12–11. Every point contested, nothing given, nothing assumed. When it ended, the scoreboard told you the margin. What it couldn't tell you is what it felt like to stand on that sand with a bronze medal.",
    accent: false,
    canada: false,
    isBronze: true,
  },
];

const WBUC_PHOTOS = [
  { file: "_MG_2645.jpg", caption: "Bronze medal moment" },
  { file: "_MG_2658.jpg", caption: "Celebrations on the beach" },
  { file: "_MG_2659.jpg", caption: "Czech team — together" },
  { file: "_MG_2663.jpg", caption: "On the beach" },
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

// ── GLOBE ─────────────────────────────────────────────────────────────────────

function Globe() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const R = () => Math.min(canvas.width, canvas.height) * 0.38;
    const LAT = 18, LON = 24;
    const meshLines = [];
    for (let i = 0; i <= LAT; i++) {
      const phi = (i / LAT) * Math.PI, pts = [];
      for (let j = 0; j <= LON * 2; j++) pts.push({ phi, theta: (j / (LON * 2)) * Math.PI * 2 });
      meshLines.push(pts);
    }
    for (let j = 0; j <= LON; j++) {
      const theta = (j / LON) * Math.PI * 2, pts = [];
      for (let i = 0; i <= LAT * 2; i++) pts.push({ phi: (i / (LAT * 2)) * Math.PI, theta });
      meshLines.push(pts);
    }
    const STARS = Array.from({ length: 200 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.7 + 0.1 }));
    const PARTICLES = Array.from({ length: 60 }, () => ({ phi: Math.random() * Math.PI, theta: Math.random() * Math.PI * 2, r: Math.random() * 1.5 + 0.5 }));
    const project = (phi, theta, rot, cx, cy, radius) => {
      const x = Math.sin(phi) * Math.cos(theta + rot), y = Math.cos(phi), z = Math.sin(phi) * Math.sin(theta + rot);
      return { x: cx + x * radius, y: cy - y * radius, z };
    };
    const draw = () => {
      const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2, radius = R();
      t += 0.003;
      ctx.clearRect(0, 0, w, h);
      STARS.forEach(s => { ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${s.a})`; ctx.fill(); });
      meshLines.forEach(pts => {
        ctx.beginPath(); let started = false;
        pts.forEach(({ phi, theta }) => {
          const p = project(phi, theta, t, cx, cy, radius);
          if (p.z >= -0.1) { if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y); }
          else if (started) { ctx.strokeStyle = "rgba(180,200,255,0.15)"; ctx.lineWidth = 0.5; ctx.stroke(); ctx.beginPath(); started = false; }
        });
        if (started) { ctx.strokeStyle = "rgba(180,200,255,0.15)"; ctx.lineWidth = 0.5; ctx.stroke(); }
      });
      PARTICLES.forEach(p => {
        const proj = project(p.phi, p.theta, t, cx, cy, radius);
        if (proj.z > 0) { ctx.beginPath(); ctx.arc(proj.x, proj.y, p.r * proj.z, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${proj.z * 0.8})`; ctx.fill(); }
      });
      animId = requestAnimationFrame(draw);
    };
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
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Fade({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.8s ${delay}s ease, transform 0.8s ${delay}s ease`, ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ num, label, sub }) {
  return (
    <div style={{ marginBottom: "4.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: sub ? "0.6rem" : 0 }}>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(100,150,255,0.6)", fontFamily: "monospace" }}>{num}</span>
        <span style={{ width: 28, height: 1, background: "rgba(100,150,255,0.35)", display: "block" }} />
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{label}</span>
      </div>
      {sub && <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", paddingLeft: "3.5rem" }}>{sub}</p>}
    </div>
  );
}

// ── LIGHTBOX ──────────────────────────────────────────────────────────────────

function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index];
  const hasPrev = index > 0, hasNext = index < photos.length - 1;
  const handlePrev = useCallback((e) => { e?.stopPropagation(); if (hasPrev) onPrev(); }, [hasPrev, onPrev]);
  const handleNext = useCallback((e) => { e?.stopPropagation(); if (hasNext) onNext(); }, [hasNext, onNext]);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") handlePrev(); if (e.key === "ArrowRight") handleNext(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [onClose, handlePrev, handleNext]);

  const Btn = ({ enabled, onClick, side, char }) => (
    <button onClick={onClick} style={{ position: "absolute", top: "50%", [side]: "2rem", transform: "translateY(-50%)", background: enabled ? "rgba(255,255,255,0.08)" : "transparent", border: `1px solid ${enabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}`, color: enabled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.08)", borderRadius: "50%", width: 56, height: 56, fontSize: "1.6rem", cursor: enabled ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "all 0.2s", backdropFilter: "blur(8px)" }}
      onMouseEnter={e => { if (enabled) e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
      onMouseLeave={e => { if (enabled) e.currentTarget.style.background = enabled ? "rgba(255,255,255,0.08)" : "transparent"; }}
    >{char}</button>
  );
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.97)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
      <Btn enabled={hasPrev} onClick={handlePrev} side="left" char="‹" />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", cursor: "default" }}>
        <img src={"/" + photo.file} alt={photo.caption} style={{ maxWidth: "84vw", maxHeight: "80vh", objectFit: "contain", display: "block" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", padding: "0 0.1rem" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{photo.caption}</p>
          <p style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,170,51,0.6)" }}>{index + 1} / {photos.length}</p>
        </div>
      </div>
      <Btn enabled={hasNext} onClick={handleNext} side="right" char="›" />
    </div>
  );
}

// ── PHOTO TILE ────────────────────────────────────────────────────────────────

function PhotoTile({ photo, onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", overflow: "hidden", cursor: "zoom-in", ...style }}>
      <img src={"/" + photo.file} alt={photo.caption}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease", transform: hovered ? "scale(1.06)" : "scale(1)" }}
        onError={e => { e.target.style.background = "#111"; e.target.style.minHeight = "80px"; }} />
      <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.15)" : "transparent", transition: "background 0.3s" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.2rem 1rem 0.8rem", background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)", opacity: hovered ? 1 : 0, transition: "opacity 0.35s" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>{photo.caption}</p>
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
    const s = document.createElement("style");
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
      *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
      html { scroll-behavior:smooth; }
      body { background:#000; color:#fff; -webkit-font-smoothing:antialiased; }
      a { text-decoration:none; color:inherit; }
      ::-webkit-scrollbar { width:2px; }
      ::-webkit-scrollbar-track { background:#000; }
      ::-webkit-scrollbar-thumb { background:#333; border-radius:2px; }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const phases = ["Pool B", "Power Pool F", "Playoffs", "Bronze Medal"];
  const resultsByPhase = phases.map(p => ({ phase: p, games: WBUC_RESULTS.filter(r => r.phase === p) }));

  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>

      {lightbox && <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />}

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 3rem", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>David</span>
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none" }}>
          {["WBUC", "Results", "Career", "Teams", "Czech Mixed"].map(l => (
            <li key={l}>
              <a href={"#" + l.replace(/\s/g, "")}
                style={{ fontSize: "0.75rem", fontWeight: 300, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", transition: "color 0.25s" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.9)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
              >{l}</a>
            </li>
          ))}
        </ul>
        <a href="#WBUC" style={{ fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.1em", padding: "0.42rem 1rem", border: "1px solid rgba(255,170,51,0.4)", color: "#ffaa33", borderRadius: "3px", transition: "all 0.25s", background: "transparent" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,170,51,0.1)"; e.currentTarget.style.borderColor = "rgba(255,170,51,0.8)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,170,51,0.4)"; }}
        >🥉 Bronze</a>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Globe />
        {/* Subtle warm glow behind title */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(255,140,30,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", animation: "fi 1s 0.1s both" }}>
            <div style={{ width: 20, height: 1, background: "rgba(255,170,51,0.4)" }} />
            <p style={{ fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,170,51,0.7)" }}>
              Portimão, Portugal · 2025
            </p>
            <div style={{ width: 20, height: 1, background: "rgba(255,170,51,0.4)" }} />
          </div>
          <p style={{ fontSize: "0.72rem", fontWeight: 300, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", animation: "fi 1s 0.2s both" }}>
            World Beach Ultimate Championship
          </p>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", animation: "fi 1s 0.35s both" }}>
            Czech Republic
          </h1>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", color: "#ffaa33", animation: "fi 1s 0.5s both" }}>
            Bronze Medal.
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", marginTop: "1.5rem", animation: "fi 1s 0.7s both" }}>
            {[["13", "games"], ["9W – 4L", "record"], ["12–11", "bronze final"]].map(([v, l]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 300, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em", lineHeight: 1 }}>{v}</span>
                <span style={{ fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", animation: "fi 1s 1.1s both", zIndex: 2 }}>
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)" }} />
        </div>
        <style>{`@keyframes fi { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </section>

      {/* ── ROAD TO BRONZE — TIMELINE ── */}
      <section id="WBUC" style={{ padding: "8rem 3rem 5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Fade><SectionHeader num="01" label="Road to Bronze" sub="Portimão, Portugal · November 2025" /></Fade>

          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.08) 90%, rgba(255,255,255,0.0))", pointerEvents: "none" }} />

            {TOURNAMENT_NARRATIVE.map((block, i) => (
              <Fade key={block.phase} delay={i * 0.08}>
                <div style={{ display: "flex", gap: 0, marginBottom: block.canada ? "0" : "0", position: "relative" }}>

                  {/* Left: label + score */}
                  <div style={{ width: 110, flexShrink: 0, paddingRight: "1.5rem", paddingTop: "0.15rem", textAlign: "right" }}>
                    <p style={{ fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: block.canada ? "#ffaa33" : block.isBronze ? "rgba(255,170,51,0.6)" : "rgba(100,150,255,0.6)", marginBottom: "0.3rem", lineHeight: 1.3 }}>{block.phase}</p>
                    <p style={{ fontFamily: "monospace", fontSize: block.canada ? "1.1rem" : "0.85rem", fontWeight: block.canada ? 500 : 300, color: block.canada ? "#ffaa33" : block.isBronze ? "rgba(255,170,51,0.8)" : "rgba(255,255,255,0.5)", lineHeight: 1 }}>{block.score}</p>
                  </div>

                  {/* Dot on the line */}
                  <div style={{ position: "relative", flexShrink: 0, width: 0 }}>
                    <div style={{ position: "absolute", top: "0.4rem", left: -6, width: 13, height: 13, borderRadius: "50%", background: block.canada ? "#ffaa33" : block.isBronze ? "rgba(255,170,51,0.5)" : "rgba(255,255,255,0.12)", border: `1px solid ${block.canada ? "#ffaa33" : block.isBronze ? "rgba(255,170,51,0.4)" : "rgba(255,255,255,0.15)"}`, boxShadow: block.canada ? "0 0 12px rgba(255,170,51,0.4)" : "none" }} />
                  </div>

                  {/* Right: content */}
                  <div style={{ flex: 1, paddingLeft: "2.5rem", paddingBottom: "3.5rem" }}>
                    {block.canada ? (
                      /* Canada game — special full treatment */
                      <div style={{ background: "rgba(255,170,51,0.04)", border: "1px solid rgba(255,170,51,0.2)", borderRadius: "8px", padding: "2rem 2rem 2rem 2rem", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle, rgba(255,170,51,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
                        <p style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,170,51,0.5)", marginBottom: "0.7rem" }}>{block.label}</p>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 400, color: "#fff", marginBottom: "1rem", lineHeight: 1.25 }}>{block.heading}</h3>
                        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: "1.5rem" }}>{block.body}</p>
                        <div style={{ display: "flex", gap: "1.5rem" }}>
                          {[["1", "offensive turnover"], ["12–9", "final score"], ["0–0", "on paper"]].map(([v, l]) => (
                            <div key={l} style={{ padding: "0.6rem 1rem", border: "1px solid rgba(255,170,51,0.15)", borderRadius: "4px", textAlign: "center" }}>
                              <div style={{ fontSize: "1.1rem", fontWeight: 300, color: "#ffaa33", lineHeight: 1 }}>{v}</div>
                              <div style={{ fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: "0.3rem" }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Normal narrative block */
                      <div>
                        <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>{block.label}</p>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 400, color: block.isBronze ? "rgba(255,220,150,0.95)" : "#fff", marginBottom: "0.9rem", lineHeight: 1.3 }}>{block.heading}</h3>
                        <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.9 }}>{block.body}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Fade>
            ))}
          </div>

          {/* Photo gallery */}
          <Fade delay={0.1}>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "4rem", marginTop: "1rem" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "1.2rem" }}>
                Gallery · click to expand · ← → to navigate
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3px" }}>
                {WBUC_PHOTOS.map((photo, i) => (
                  <PhotoTile key={photo.file} photo={photo} onClick={() => openLightbox(WBUC_PHOTOS, i)}
                    style={{ aspectRatio: i === 0 || i === 3 ? "16/10" : "4/3", gridColumn: i === 0 ? "span 2" : "auto" }} />
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section id="Results" style={{ padding: "6rem 3rem 7rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.008)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Fade><SectionHeader num="02" label="Match Results" sub="9 wins · 4 losses · Bronze medal" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.2rem" }}>
            {resultsByPhase.map(({ phase, games }) => {
              const isBronze = phase === "Bronze Medal";
              const wins = games.filter(g => g.us > g.them).length;
              const total = games.length;
              return (
                <Fade key={phase} delay={0.05}>
                  <div style={{ border: `1px solid ${isBronze ? "rgba(255,170,51,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "6px", overflow: "hidden" }}>
                    {/* Phase header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: isBronze ? "rgba(255,170,51,0.06)" : "rgba(255,255,255,0.02)" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: isBronze ? "#ffaa33" : "rgba(100,150,255,0.75)" }}>
                        {isBronze ? "🥉 " : ""}{phase}
                      </span>
                      {!isBronze && <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>{wins}W – {total - wins}L</span>}
                    </div>
                    {/* Games */}
                    {games.map((g, i) => {
                      const win = g.us > g.them;
                      const isCanada = g.opponent === "Canada";
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 28px", alignItems: "center", padding: `${isCanada ? "0.85rem" : "0.65rem"} 1.1rem`, borderBottom: i < games.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", background: g.final ? "rgba(255,170,51,0.04)" : isCanada ? "rgba(255,170,51,0.025)" : "transparent", transition: "background 0.2s" }}>
                          <div>
                            <span style={{ fontSize: "0.8rem", color: g.final || isCanada ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)", fontWeight: g.final || isCanada ? 400 : 300, display: "block" }}>{g.opponent}</span>
                            {isCanada && <span style={{ fontSize: "0.56rem", letterSpacing: "0.1em", color: "rgba(255,170,51,0.55)", display: "block", marginTop: "2px" }}>Undefeated · 1 offensive turnover</span>}
                          </div>
                          <span style={{ fontFamily: "monospace", fontSize: "0.92rem", fontWeight: 500, color: g.final ? "#ffaa33" : win ? "#6699ff" : "rgba(255,255,255,0.22)", letterSpacing: "0.03em", textAlign: "right" }}>
                            {g.us}–{g.them}
                          </span>
                          <span style={{ fontSize: "0.58rem", fontWeight: 500, color: g.final ? "#ffaa33" : win ? "rgba(80,200,100,0.85)" : "rgba(255,70,70,0.55)", textAlign: "right", letterSpacing: "0.05em" }}>
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
      <section id="Career" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Fade><SectionHeader num="03" label="Career" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", fontWeight: 300, lineHeight: 1.25, marginBottom: "1.4rem", letterSpacing: "-0.01em" }}>
                <span style={{ color: "#6699ff" }}>Sixteen years.</span><br />Four countries.
              </h2>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.9 }}>
                Czech Open national team three times (2015, 2019, 2023). Czech Mixed twice (2016, 2026). A club season with Rhino Slam! — 2024 US national champions. Bronze at WBUC Portimão 2025. WUCC 2025.
              </p>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", overflow: "hidden" }}>
                {[
                  ["2009", "Began competing in ultimate frisbee"],
                  ["2015", "Czech Open National Team — debut"],
                  ["2016", "Czech Mixed National Team"],
                  ["2019", "Czech Open — second appearance"],
                  ["2020", "Windmill Windup: silver + 2× bronze"],
                  ["2021", "WBUC Portimão — bronze medal"],
                  ["2023", "Czech Open — third appearance"],
                  ["2024", "Rhino Slam! — US National Champions"],
                  ["2025", "WUCC — World Club Championships"],
                  ["2026", "Czech Mixed National Team"],
                ].map(([year, event], i) => (
                  <div key={year} style={{ display: "flex", alignItems: "center", gap: "1.2rem", padding: "0.75rem 1.2rem", borderBottom: "1px solid rgba(255,255,255,0.03)", background: i % 2 === 0 ? "rgba(255,255,255,0.008)" : "transparent" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#6699ff", minWidth: 36, opacity: 0.9 }}>{year}</span>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{event}</span>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── TEAMS ── */}
      <section id="Teams" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.008)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Fade><SectionHeader num="04" label="Teams" /></Fade>
          {TEAMS.map((t, i) => (
            <Fade key={t.name} delay={i * 0.04}>
              <div style={{ display: "grid", gridTemplateColumns: "2rem 1fr 1fr 1fr auto", gap: "1.5rem", alignItems: "center", padding: "1.1rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)", borderTop: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "opacity 0.2s", opacity: hoveredTeam === null ? 1 : hoveredTeam === t.name ? 1 : 0.18 }}
                onMouseEnter={() => setHoveredTeam(t.name)} onMouseLeave={() => setHoveredTeam(null)}>
                <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(100,150,255,0.4)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 400, color: "rgba(255,255,255,0.9)" }}>{t.name}</span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{t.country}</span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>{t.note}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#6699ff", textAlign: "right", opacity: 0.8 }}>{t.years || "—"}</span>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ── CZECH MIXED ── */}
      <section id="CzechMixed" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Fade><SectionHeader num="05" label="Czech Mixed" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", marginBottom: "4.5rem" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", fontWeight: 300, lineHeight: 1.25, marginBottom: "1.4rem", letterSpacing: "-0.01em" }}>
                Czech Republic<br /><span style={{ color: "#6699ff" }}>Mixed National Team.</span>
              </h2>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.9 }}>
                Two appearances in the Czech Mixed national jersey — 2016 and 2026. A decade apart. Competing internationally at the highest level of mixed ultimate alongside the best players in Czech frisbee.
              </p>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ border: "1px solid rgba(100,150,255,0.12)", borderRadius: "6px", overflow: "hidden" }}>
                {[["2016", "First mixed national team appearance"], ["2026", "Return to the jersey — ten years on"]].map(([year, detail], i) => (
                  <div key={year} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "1.5rem", padding: "1.5rem 1.2rem", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 300, color: "#6699ff", opacity: 0.85 }}>{year}</span>
                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{detail}</span>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
          <Fade delay={0.05}>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: "1.2rem" }}>
              Gallery · click to expand · ← → to navigate
            </p>
          </Fade>
          <div style={{ columnCount: 4, columnGap: "3px" }}>
            {MIX_PHOTOS.map((photo, i) => (
              <div key={photo.file} style={{ breakInside: "avoid", marginBottom: "3px" }}>
                <PhotoTile photo={photo} onClick={() => openLightbox(MIX_PHOTOS, i)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.8rem 3rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>David</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>Ultimate Frisbee · Czech Republic · 2009–Present</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.08em", color: "rgba(255,170,51,0.6)" }}>WBUC Portimão 2025 · 🥉</span>
      </footer>

    </div>
  );
}

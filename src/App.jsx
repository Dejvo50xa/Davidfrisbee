import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const TEAMS = [
  { name: "Rhino Slam!", country: "United States", years: "2024", note: "US National Champions" },
  { name: "Gentle", country: "Belgium", years: "", note: "Belgian Elite Club" },
  { name: "Chupacabras", country: "Czech Republic", years: "", note: "Czech Elite Club" },
  { name: "Fuj", country: "Czech Republic", years: "", note: "Czech Elite Club" },
  { name: "3sb", country: "Czech Republic", years: "", note: "Czech Elite Club" },
  { name: "Czech Open", country: "Czech Republic", years: "2015 · 2019 · 2023", note: "National Team" },
  { name: "Czech Mixed", country: "Czech Republic", years: "2016 · 2026", note: "National Team" },
];

const ACHIEVEMENTS = [
  { num: "01", title: "World Beach Ultimate Championship", detail: "Bronze Medal" },
  { num: "02", title: "Windmill Windup Amsterdam", detail: "Silver Medal" },
  { num: "03", title: "Windmill Windup Amsterdam", detail: "Two Bronze Medals" },
  { num: "04", title: "Czech National Championships", detail: "Multiple National Titles" },
  { num: "05", title: "Club Captain", detail: "Five Consecutive Seasons" },
  { num: "06", title: "WUCC 2025", detail: "World Ultimate Club Championships" },
];

const WBUC_PHOTOS = [
  { file: "_MG_2645.jpg", caption: "Layout in the sand" },
  { file: "_MG_2658.jpg", caption: "Bronze medal celebrations" },
  { file: "_MG_2659.jpg", caption: "Czech team — the moment" },
  { file: "_MG_2663.jpg", caption: "Together on the beach" },
  { file: "_MG_2676.jpg", caption: "The embrace" },
  { file: "_MG_2681.jpg", caption: "Pure joy" },
  { file: "_MG_2685.jpg", caption: "After the battle" },
];

const WBUC_ROAD = [
  { stage: "Pool Play", result: "Qualified from group unbeaten" },
  { stage: "Quarterfinal", result: "Hard-fought victory" },
  { stage: "Semifinal", result: "Narrow defeat — bronze match bound" },
  { stage: "Bronze Medal", result: "Czech Republic 🥉 World Beach Ultimate Championship" },
];

// ── GLOBE CANVAS ──────────────────────────────────────────────────────────────

function Globe() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    const R = () => canvas.width < canvas.height ? canvas.width * 0.38 : canvas.height * 0.38;
    const LAT = 18, LON = 24;
    const meshLines = [];
    for (let i = 0; i <= LAT; i++) {
      const phi = (i / LAT) * Math.PI;
      const pts = [];
      for (let j = 0; j <= LON * 2; j++) {
        pts.push({ phi, theta: (j / (LON * 2)) * Math.PI * 2 });
      }
      meshLines.push(pts);
    }
    for (let j = 0; j <= LON; j++) {
      const theta = (j / LON) * Math.PI * 2;
      const pts = [];
      for (let i = 0; i <= LAT * 2; i++) {
        pts.push({ phi: (i / (LAT * 2)) * Math.PI, theta });
      }
      meshLines.push(pts);
    }
    const STARS = Array.from({ length: 200 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.7 + 0.1 }));
    const PARTICLES = Array.from({ length: 60 }, () => ({ phi: Math.random() * Math.PI, theta: Math.random() * Math.PI * 2, r: Math.random() * 1.5 + 0.5 }));
    function project(phi, theta, rot, cx, cy, radius) {
      const x = Math.sin(phi) * Math.cos(theta + rot);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta + rot);
      return { x: cx + x * radius, y: cy - y * radius, z };
    }
    function draw() {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      const radius = R();
      t += 0.003;
      ctx.clearRect(0, 0, w, h);
      STARS.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + s.a + ")";
        ctx.fill();
      });
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - radius * 1.8, cy + radius * 1.2);
      ctx.lineTo(cx + radius * 1.4, cy - radius * 1.5);
      ctx.stroke();
      ctx.restore();
      for (let ring = 0; ring < 2; ring++) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * (1.15 + ring * 0.12), 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      meshLines.forEach(pts => {
        ctx.beginPath();
        let started = false;
        pts.forEach(({ phi, theta }) => {
          const p = project(phi, theta, t, cx, cy, radius);
          if (p.z >= -0.1) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true; }
            else ctx.lineTo(p.x, p.y);
          } else {
            if (started) {
              ctx.strokeStyle = "rgba(180,200,255,0.18)";
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.beginPath();
              started = false;
            }
          }
        });
        if (started) { ctx.strokeStyle = "rgba(180,200,255,0.18)"; ctx.lineWidth = 0.5; ctx.stroke(); }
      });
      PARTICLES.forEach(p => {
        const proj = project(p.phi, p.theta, t, cx, cy, radius);
        if (proj.z > 0) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, p.r * proj.z, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255," + (proj.z * 0.8) + ")";
          ctx.fill();
        }
      });
      const topProj = project(0, 0, t, cx, cy, radius);
      for (let i = 0; i < 5; i++) {
        const angle = (-0.3 + i * 0.15);
        ctx.beginPath();
        ctx.moveTo(topProj.x, topProj.y);
        ctx.lineTo(cx + Math.sin(angle) * radius * 1.6, cy - radius * 1.5);
        ctx.strokeStyle = "rgba(255,255,255," + (0.06 - i * 0.01) + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
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
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Fade({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.9s " + delay + "s ease, transform 0.9s " + delay + "s ease" }}>
      {children}
    </div>
  );
}

// ── SECTION HEADER ────────────────────────────────────────────────────────────

function SectionHeader({ num, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "4rem" }}>
      <span style={{ fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(100,150,255,0.7)" }}>{num}</span>
      <span style={{ width: 32, height: 1, background: "rgba(100,150,255,0.4)", display: "block" }} />
      <span style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{label}</span>
    </div>
  );
}

// ── PHOTO LIGHTBOX ────────────────────────────────────────────────────────────

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
    >
      <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
        <img src={"/" + photo.file} alt={photo.caption} style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", display: "block" }} />
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{photo.caption}</p>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [lightbox, setLightbox] = useState(null);

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

  const navLinks = ["Career", "Teams", "Achievements", "WBUC", "WUCC 2025"];

  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>

      {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />}

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.4rem 3rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: "1rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>David</span>
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none" }}>
          {navLinks.map(l => (
            <li key={l}>
              <a href={"#" + l.replace(/\s/g, "")}
                style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}
              >{l}</a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a href="#WUCC2025" style={{ fontSize: "0.75rem", fontWeight: 400, letterSpacing: "0.08em", padding: "0.5rem 1.2rem", border: "1px solid rgba(100,150,255,0.6)", color: "rgba(150,190,255,0.9)", borderRadius: "4px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(100,150,255,0.1)"; e.currentTarget.style.borderColor = "rgba(100,150,255,1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(100,150,255,0.6)"; }}
          >WUCC 2025</a>
          <a href="#Teams" style={{ fontSize: "0.75rem", fontWeight: 400, letterSpacing: "0.08em", padding: "0.5rem 1.2rem", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)", borderRadius: "4px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
          >All Teams</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Globe />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", animation: "fade-in 1s 0.2s both" }}>Ultimate Frisbee · Czech Republic</p>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.01em", animation: "fade-in 1s 0.4s both" }}>
            <span style={{ color: "#6699ff" }}>Elite</span>{" "}Player
          </h1>
          <p style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", fontWeight: 300, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em", animation: "fade-in 1s 0.6s both" }}>
            16 years of elite ultimate frisbee across four countries
          </p>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.8rem", animation: "fade-in 1s 0.8s both" }}>
            {[["16", "Years"], ["7+", "Teams"], ["5x", "Captain"], ["3", "World Events"]].map(([v, l]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 300, color: "#fff", lineHeight: 1 }}>{v}</span>
                <span style={{ fontSize: "0.6rem", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{l}</span>
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

      {/* ── CAREER ── */}
      <section id="Career" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade><SectionHeader num="01" label="Career" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.2, color: "#fff", marginBottom: "1.5rem" }}>
                <span style={{ color: "#6699ff" }}>Sixteen years</span> of elite competition across four countries.
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.85 }}>
                Three appearances with the Czech Open national team (2015, 2019, 2023). Two with Czech Mixed (2016, 2026). A season with Rhino Slam! — 2024 US national champions. Currently one of the most experienced players on a WUCC 2025-bound squad.
              </p>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
                {[
                  ["2009", "Began competitive ultimate frisbee"],
                  ["2015", "Czech Open National Team — debut"],
                  ["2016", "Czech Mixed National Team"],
                  ["2019", "Czech Open — second appearance"],
                  ["2020", "Windmill Windup medals (silver + 2x bronze)"],
                  ["2021", "World Beach Ultimate — bronze medal"],
                  ["2023", "Czech Open — third appearance"],
                  ["2024", "Rhino Slam! — US National Champions"],
                  ["2025", "WUCC — World Club Championships"],
                ].map(([year, event], i) => (
                  <div key={year} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.85rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
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
      <section id="Teams" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade><SectionHeader num="02" label="Teams" /></Fade>
          <div>
            {TEAMS.map((t, i) => (
              <Fade key={t.name} delay={i * 0.05}>
                <div
                  style={{ display: "grid", gridTemplateColumns: "2rem 1fr 1fr 1fr auto", gap: "1.5rem", alignItems: "center", padding: "1.2rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", borderTop: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "all 0.25s", cursor: "default", opacity: hoveredTeam === null ? 1 : hoveredTeam === t.name ? 1 : 0.2 }}
                  onMouseEnter={() => setHoveredTeam(t.name)}
                  onMouseLeave={() => setHoveredTeam(null)}
                >
                  <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(100,150,255,0.5)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: "1rem", fontWeight: 400, color: "#fff" }}>{t.name}</span>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{t.country}</span>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>{t.note}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#6699ff", textAlign: "right" }}>{t.years || "—"}</span>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section id="Achievements" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade><SectionHeader num="03" label="Achievements" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {ACHIEVEMENTS.map((a, i) => (
              <Fade key={a.num} delay={i * 0.07}>
                <div
                  style={{ padding: "2.5rem 2rem", background: "#000", transition: "background 0.25s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(100,150,255,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = "#000"}
                >
                  <span style={{ display: "block", fontFamily: "monospace", fontSize: "0.6rem", color: "#6699ff", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>{a.num}</span>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 400, color: "#fff", lineHeight: 1.4, marginBottom: "0.5rem" }}>{a.title}</h3>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{a.detail}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── WBUC ROAD TO BRONZE ── */}
      <section id="WBUC" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,215,0,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade>
            <SectionHeader num="04" label="WBUC — Road to Bronze" />
          </Fade>

          {/* Story intro */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginBottom: "5rem" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.2, color: "#fff", marginBottom: "1.5rem" }}>
                World Beach Ultimate<br /><span style={{ color: "#ffaa33" }}>Bronze Medal.</span>
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.85 }}>
                The World Beach Ultimate Championships. Czech Republic mixed national team. A tournament that went all the way to the bronze medal match — and a result earned through grit, cohesion, and belief on the sand.
              </p>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ border: "1px solid rgba(255,170,51,0.15)", borderRadius: "8px", overflow: "hidden" }}>
                {WBUC_ROAD.map(({ stage, result }, i) => (
                  <div key={stage} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1.5rem", padding: "1.2rem 1.5rem", borderBottom: i < WBUC_ROAD.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", alignItems: "center", background: i === WBUC_ROAD.length - 1 ? "rgba(255,170,51,0.06)" : "transparent" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: i === WBUC_ROAD.length - 1 ? "#ffaa33" : "rgba(100,150,255,0.6)" }}>{stage}</span>
                    <span style={{ fontSize: "0.85rem", color: i === WBUC_ROAD.length - 1 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)", lineHeight: 1.6, fontWeight: i === WBUC_ROAD.length - 1 ? 400 : 300 }}>{result}</span>
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          {/* Photo grid */}
          <Fade delay={0.1}>
            <p style={{ fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1.5rem" }}>Gallery — click to expand</p>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
            {WBUC_PHOTOS.map((photo, i) => (
              <Fade key={photo.file} delay={i * 0.06}>
                <div
                  onClick={() => setLightbox(photo)}
                  style={{ position: "relative", aspectRatio: i === 0 || i === 3 ? "16/10" : "4/3", overflow: "hidden", cursor: "zoom-in", gridColumn: i === 0 ? "span 2" : "auto" }}
                  onMouseEnter={e => {
                    e.currentTarget.querySelector("img").style.transform = "scale(1.04)";
                    e.currentTarget.querySelector(".cap").style.opacity = "1";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.querySelector("img").style.transform = "scale(1)";
                    e.currentTarget.querySelector(".cap").style.opacity = "0";
                  }}
                >
                  <img
                    src={"/" + photo.file}
                    alt={photo.caption}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                  />
                  <div className="cap" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", opacity: 0, transition: "opacity 0.3s" }}>
                    <p style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>{photo.caption}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── WUCC ── */}
      <section id="WUCC2025" style={{ padding: "7rem 3rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(100,150,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Fade><SectionHeader num="05" label="WUCC 2025" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <Fade delay={0.05}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.2, color: "#fff", marginBottom: "1.5rem" }}>
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
                    <span style={{ fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6699ff", paddingTop: "0.1rem" }}>{label}</span>
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
        <span style={{ fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.1em", color: "#6699ff" }}>WUCC 2025</span>
      </footer>

    </div>
  );
}

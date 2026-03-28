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

// Point-by-point score progression
const CANADA_GAME = {
  czs: [0,0,1,1,2,2,3,3,4,4,5,6,7,7,8,8,9,9,10,10,11,12],
  ops: [0,1,1,2,2,3,3,4,4,5,5,5,5,6,6,7,7,8,8,9,9,9],
  opName: "Canada",
};

const BRONZE_GAME = {
  czs: [0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,8,9,9,10,10,11,12],
  ops: [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,9,9,10,10,11,11,11],
  opName: "Spain",
};

const TOURNAMENT_NARRATIVE = [
  {
    phase: "Pool Play",
    label: "Mon\u2013Wed",
    score: "5W \u2013 1L",
    heading: "Building momentum.",
    body: "Czech Republic opened pool play with back-to-back demolitions \u2014 13\u20133 against Venezuela, 13\u20133 against Lebanon. Calm, structured, efficient. Then came Spain, the pool\u2019s top seed: an 8\u20139 loss that stung but also clarified the task ahead. The team responded with three straight wins, including a nervy 10\u20139 over Australia that went down to the wire. Portim\u00e3o\u2019s heat didn\u2019t slow anyone down.",
    canada: false, isBronze: false,
  },
  {
    phase: "Power Pool F",
    label: "Wed\u2013Thu",
    score: "1W \u2013 2L",
    heading: "Two losses. One lesson.",
    body: "The power pool brought Germany and India \u2014 and two consecutive losses. 6\u201313, then 8\u20139. The India defeat, by a single point, was the kind of result that could unravel a team. It didn\u2019t. Czech Republic answered with a composed 13\u20137 win over Great Britain and moved into the playoff bracket carrying something more valuable than a perfect record: the knowledge they could absorb a punch and keep going.",
    canada: false, isBronze: false,
  },
  {
    phase: "vs Canada",
    label: "Thu 20 Nov",
    score: "12 \u2013 9",
    heading: "Underdogs. One turnover. Done.",
    body: "Canada entered the bracket undefeated \u2014 the tournament\u2019s form team, consistent and widely expected to reach the medal round. Czech Republic were clear underdogs. Through the opening exchanges, both teams traded points evenly, with Canada taking an early lead before Czech pulled level at 5\u20135. Then, in the game\u2019s defining stretch, Czech scored three consecutive points \u2014 racing to 7\u20135 \u2014 committing just a single offensive turnover across the entire game. Canada never found an answer. The final score, 12\u20139, flatters Canada.",
    canada: true, isBronze: false,
    gameData: CANADA_GAME,
    stats: [["1", "offensive turnover"], ["12\u20139", "final score"], ["3", "consecutive to break away"]],
  },
  {
    phase: "Bronze Medal",
    label: "Fri 21 Nov \u00b7 Portim\u00e3o",
    score: "12 \u2013 11",
    heading: "The hardest game.",
    body: "After a 6\u201310 semifinal loss to Australia, Czech Republic faced Spain in the bronze medal match \u2014 the same team that had beaten them 8\u20139 in pool play. This time, it went to the very edge. Spain led three times in the second half \u2014 first at 9\u20138, then 10\u20139, then 11\u201310 \u2014 and each time Czech found the answer. With the score level at 11\u201311, one final point would decide everything. Czech Republic got it. 12\u201311. Every point earned. Nothing given. What the scoreboard couldn\u2019t tell you is what it felt like to stand on that sand with a bronze medal.",
    canada: false, isBronze: true,
    gameData: BRONZE_GAME,
  },
];

const PLAYERS = [
  { name: "Filip Halamka",    initials: "FH", photo: "_MG_1940.jpg", feelings: "" },
  { name: "Patrik Novak",     initials: "PN", photo: "_MG_2004.jpg", feelings: "" },
  { name: "Jachym Hrusak",    initials: "JH", photo: "_MG_1561.jpg", feelings: "" },
  { name: "Ondrej Rydlo",     initials: "OR", photo: "_MG_3543.jpg", feelings: "" },
  { name: "Vojtech Rybka",    initials: "VR", photo: "_MG_2691.jpg", feelings: "" },
  { name: "Michal Schvob",    initials: "MS", photo: "_MG_1469.jpg", feelings: "" },
  { name: "David Novak",      initials: "DN", photo: "_MG_2649.jpg", feelings: "" },
  { name: "Sarah Nemeckova",  initials: "SN", photo: "_MG_2667.jpg", feelings: "" },
  { name: "Tereza Mrazova",   initials: "TM", photo: "_MG_3480.jpg", feelings: "" },
  { name: "Tereza Havelcova", initials: "TH", photo: "_MG_2685.jpg", feelings: "" },
  { name: "Bara Hrusakova",   initials: "BH", photo: "_MG_3629.jpg", feelings: "" },
  { name: "Anicka Dvorakova", initials: "AD", photo: "_MG_3569.jpg", feelings: "" },
  { name: "Klara Svecova",    initials: "KS", photo: "_MG_3482.jpg", feelings: "" },
  { name: "Maja Volkova",     initials: "MV", photo: "_MG_1516.jpg", feelings: "" },
];

// Featured team photo shown full-width at top of gallery
const FEATURED_PHOTO = { file: "_MG_2659.jpg", caption: "Czech team \u2014 together \u00b7 Portim\u00e3o 2025" };

// All other photos (WBUC + Mix combined, excluding the featured one)
const ALL_PHOTOS = [
  { file: "_MG_2645.jpg", caption: "Bronze medal moment" },
  { file: "_MG_2658.jpg", caption: "Celebrations on the beach" },
  { file: "_MG_2663.jpg", caption: "On the beach" },
  { file: "_MG_2676.jpg", caption: "The embrace" },
  { file: "_MG_2681.jpg", caption: "Pure joy" },
  { file: "_MG_2685.jpg", caption: "After the battle" },
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
  // — additional picks —
  { file: "_MG_1452.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1469.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1471.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1472.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1474.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1495.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1500.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1502.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1516.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1549.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1550.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1875.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1884.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1890.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1904.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1907.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1915.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1936.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1950.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1955.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1958.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_1973.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2531.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2599.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2611.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_2644.jpg", caption: "Bronze medal · Portimão 2025" },
  { file: "_MG_2646.jpg", caption: "Bronze medal · Portimão 2025" },
  { file: "_MG_2650.jpg", caption: "Bronze medal · Portimão 2025" },
  { file: "_MG_2665.jpg", caption: "Bronze medal · Portimão 2025" },
  { file: "_MG_2670.jpg", caption: "Bronze medal · Portimão 2025" },
  { file: "_MG_2691.jpg", caption: "Bronze medal · Portimão 2025" },
  { file: "_MG_3268.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3321.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3324.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3423.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3447.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3453.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3456.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3478.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3480.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3482.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3500.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3521.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3522.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3528.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3531.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3546.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3572.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3593.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3594.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3600.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3607.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3632.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3634.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3640.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3656.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3659.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3709.jpg", caption: "Czech Mixed 2026" },
  { file: "_MG_3717.jpg", caption: "Czech Mixed 2026" },
];

// Full gallery array for lightbox (featured first, then rest)
const GALLERY = [FEATURED_PHOTO, ...ALL_PHOTOS];

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

// ── SCORE CHART ───────────────────────────────────────────────────────────────

function ScoreChart({ data, annotations = [] }) {
  const { czs, ops, opName } = data;
  const n = czs.length;
  const maxScore = Math.max(...czs, ...ops) + 1;
  const W = 580, H = 150;
  const pad = { l: 28, r: 16, t: 20, b: 32 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const px = (i) => pad.l + (i / (n - 1)) * pw;
  const py = (s) => pad.t + ph - (s / maxScore) * ph;
  const toPath = (arr) => arr.map((s, i) => `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(s).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 150, display: "block", overflow: "visible" }}>
      {[0, 3, 6, 9, 12].filter(s => s <= maxScore).map(s => (
        <line key={s} x1={pad.l} y1={py(s)} x2={W - pad.r} y2={py(s)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      {[0, 6, 12].filter(s => s <= maxScore).map(s => (
        <text key={s} x={pad.l - 5} y={py(s) + 3.5} textAnchor="end" fontSize={8} fill="rgba(255,255,255,0.18)" fontFamily="monospace">{s}</text>
      ))}
      <path d={`${toPath(ops)} L ${px(n-1)} ${py(0)} L ${px(0)} ${py(0)} Z`} fill="rgba(255,90,90,0.04)" />
      <path d={`${toPath(czs)} L ${px(n-1)} ${py(0)} L ${px(0)} ${py(0)} Z`} fill="rgba(100,150,255,0.06)" />
      <path d={toPath(ops)} fill="none" stroke="rgba(255,90,90,0.55)" strokeWidth={1.5} strokeLinejoin="round" />
      <path d={toPath(czs)} fill="none" stroke="rgba(100,153,255,0.95)" strokeWidth={2} strokeLinejoin="round" />
      {annotations.map(({ i, label, cze }, idx) => {
        const x = px(i), y = cze ? py(czs[i]) : py(ops[i]);
        return (
          <g key={idx}>
            <circle cx={x} cy={y} r={3.5} fill={cze ? "#6699ff" : "rgba(255,90,90,0.9)"} />
            <text x={x} y={cze ? y - 9 : y + 14} textAnchor="middle" fontSize={7.5} fill="rgba(255,255,255,0.45)" fontFamily="monospace">{label}</text>
          </g>
        );
      })}
      <line x1={pad.l} y1={H - 10} x2={pad.l + 18} y2={H - 10} stroke="rgba(100,153,255,0.9)" strokeWidth={2} />
      <text x={pad.l + 22} y={H - 6} fontSize={8} fill="rgba(255,255,255,0.35)" fontFamily="monospace">CZE</text>
      <line x1={pad.l + 60} y1={H - 10} x2={pad.l + 78} y2={H - 10} stroke="rgba(255,90,90,0.55)" strokeWidth={1.5} />
      <text x={pad.l + 82} y={H - 6} fontSize={8} fill="rgba(255,255,255,0.35)" fontFamily="monospace">{opName}</text>
    </svg>
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
      <Btn enabled={hasPrev} onClick={handlePrev} side="left" char="&#8249;" />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", cursor: "default" }}>
        <img src={"/" + photo.file} alt={photo.caption} style={{ maxWidth: "84vw", maxHeight: "80vh", objectFit: "contain", display: "block" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", padding: "0 0.1rem" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{photo.caption}</p>
          <p style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,170,51,0.6)" }}>{index + 1} / {photos.length}</p>
        </div>
      </div>
      <Btn enabled={hasNext} onClick={handleNext} side="right" char="&#8250;" />
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

// ── PLAYER CARD ───────────────────────────────────────────────────────────────

function PlayerCard({ player, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <Fade delay={index * 0.03}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: "relative", aspectRatio: "3/4", background: hovered ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.6)", cursor: "pointer", transition: "background 0.3s", overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {player.photo && !imgError ? (
            <img
              src={"/" + player.photo}
              alt={player.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.5s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: "2rem", fontWeight: 200, letterSpacing: "0.08em", color: "rgba(255,255,255,0.1)", fontFamily: "monospace" }}>{player.initials}</span>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(100,150,255,0.08)" : "transparent", transition: "background 0.3s" }} />
        </div>
        <div style={{ padding: "0.9rem 1rem", background: hovered ? "rgba(100,150,255,0.06)" : "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background 0.3s" }}>
          <p style={{ fontSize: "0.78rem", fontWeight: hovered ? 400 : 300, color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)", letterSpacing: "0.02em", transition: "all 0.2s", lineHeight: 1.2 }}>
            {player.name}
          </p>
        </div>
      </div>
    </Fade>
  );
}

// ── TEAM PAGE ─────────────────────────────────────────────────────────────────

function TeamPage({ onSelectPlayer }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#000", paddingTop: 80 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "5rem 3rem 8rem" }}>
        <Fade>
          <div style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(100,150,255,0.6)", fontFamily: "monospace" }}>Team</span>
              <span style={{ width: 28, height: 1, background: "rgba(100,150,255,0.35)", display: "block" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Czech Republic Mixed</span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", paddingLeft: "3.5rem" }}>
              WBUC Portim&#227;o 2025 &middot; Bronze Medal &middot; 14 players
            </p>
          </div>
        </Fade>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "6px", overflow: "hidden" }}>
          {PLAYERS.map((player, i) => (
            <PlayerCard key={player.name} player={player} index={i} onClick={() => onSelectPlayer(player)} />
          ))}
        </div>

        <Fade delay={0.2}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.12)", textAlign: "center", marginTop: "3rem" }}>
            Click a player to see their story
          </p>
        </Fade>
      </div>
    </div>
  );
}

// ── PLAYER PAGE ───────────────────────────────────────────────────────────────

function PlayerPage({ player, onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#000", paddingTop: 80 }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", padding: "1.1rem 3rem", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <button onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
        >
          <span style={{ fontSize: "1rem" }}>&#8592;</span> Team
        </button>
        <span style={{ marginLeft: "auto", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,170,51,0.5)", fontFamily: "monospace" }}>
          WBUC 2025 &middot; &#x1F949;
        </span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "4rem 3rem 8rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

          {/* Photo */}
          <Fade>
            <div style={{ position: "relative", aspectRatio: "3/4", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {player.photo && !imgError ? (
                <img
                  src={"/" + player.photo}
                  alt={player.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3.5rem", fontWeight: 200, letterSpacing: "0.1em", color: "rgba(255,255,255,0.08)", fontFamily: "monospace", lineHeight: 1 }}>{player.initials}</div>
                  <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.1)", marginTop: "0.8rem" }}>Photo coming soon</div>
                </div>
              )}
            </div>
          </Fade>

          {/* Info */}
          <Fade delay={0.1}>
            <div>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,170,51,0.5)", marginBottom: "1rem", fontFamily: "monospace" }}>
                WBUC &middot; Portim&#227;o 2025 &middot; &#x1F949;
              </p>
              <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: "3rem" }}>
                {player.name}
              </h1>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem" }}>
                <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "1.5rem" }}>
                  Feelings from the week
                </p>
                {player.feelings ? (
                  <p style={{ fontSize: "1.05rem", fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontStyle: "italic" }}>
                    &ldquo;{player.feelings}&rdquo;
                  </p>
                ) : (
                  <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "rgba(255,255,255,0.18)", lineHeight: 1.8, fontStyle: "italic" }}>
                    Coming soon.
                  </p>
                )}
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [activePlayer, setActivePlayer] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (photos, index) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const prevPhoto = useCallback(() => setLightbox(s => s && s.index > 0 ? { ...s, index: s.index - 1 } : s), []);
  const nextPhoto = useCallback(() => setLightbox(s => s && s.index < s.photos.length - 1 ? { ...s, index: s.index + 1 } : s), []);

  const goHome = (anchor) => {
    setPage("home");
    setActivePlayer(null);
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }
  };

  const goTeam = () => { setPage("team"); setActivePlayer(null); window.scrollTo(0, 0); };
  const openPlayer = (player) => { setActivePlayer(player); setPage("player"); };

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
      @keyframes fi { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const phases = ["Pool B", "Power Pool F", "Playoffs", "Bronze Medal"];
  const resultsByPhase = phases.map(p => ({ phase: p, games: WBUC_RESULTS.filter(r => r.phase === p) }));

  // Shared nav
  const Nav = () => (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 3rem", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <button onClick={() => goHome()} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>David</span>
      </button>
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none" }}>
        {[
          { label: "WBUC",    action: () => goHome("WBUC") },
          { label: "Results", action: () => goHome("Results") },
          { label: "Gallery", action: () => goHome("Gallery") },
          { label: "Team",    action: goTeam, active: page === "team" || page === "player" },
        ].map(({ label, action, active }) => (
          <li key={label}>
            <button onClick={action}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 300, color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)", letterSpacing: "0.05em", transition: "color 0.25s", padding: 0 }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.9)"}
              onMouseLeave={e => e.target.style.color = active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)"}
            >{label}</button>
          </li>
        ))}
      </ul>
      <button onClick={() => goHome("WBUC")} style={{ fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.1em", padding: "0.42rem 1rem", border: "1px solid rgba(255,170,51,0.4)", color: "#ffaa33", borderRadius: "3px", transition: "all 0.25s", background: "transparent", cursor: "pointer" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,170,51,0.1)"; e.currentTarget.style.borderColor = "rgba(255,170,51,0.8)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,170,51,0.4)"; }}
      >&#x1F949; Bronze</button>
    </nav>
  );

  // ── PLAYER PAGE ──
  if (page === "player" && activePlayer) {
    return (
      <div style={{ background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
        {lightbox && <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />}
        <PlayerPage player={activePlayer} onBack={() => setPage("team")} />
      </div>
    );
  }

  // ── TEAM PAGE ──
  if (page === "team") {
    return (
      <div style={{ background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
        {lightbox && <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />}
        <Nav />
        <TeamPage onSelectPlayer={openPlayer} />
      </div>
    );
  }

  // ── HOME PAGE ──
  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
      {lightbox && <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />}

      <Nav />

      {/* ── HERO ── */}
      <section style={{ position: "relative", width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Globe />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(255,140,30,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", animation: "fi 1s 0.1s both" }}>
            <div style={{ width: 20, height: 1, background: "rgba(255,170,51,0.4)" }} />
            <p style={{ fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,170,51,0.7)" }}>Portim&#227;o, Portugal &middot; 2025</p>
            <div style={{ width: 20, height: 1, background: "rgba(255,170,51,0.4)" }} />
          </div>
          <p style={{ fontSize: "0.72rem", fontWeight: 300, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", animation: "fi 1s 0.2s both" }}>World Beach Ultimate Championship</p>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", animation: "fi 1s 0.35s both" }}>Czech Republic</h1>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", color: "#ffaa33", animation: "fi 1s 0.5s both" }}>Bronze Medal.</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", marginTop: "1.5rem", animation: "fi 1s 0.7s both" }}>
            {[["13", "games"], ["9W \u2013 4L", "record"], ["12\u201311", "bronze final"]].map(([v, l]) => (
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
      </section>

      {/* ── ROAD TO BRONZE ── */}
      <section id="WBUC" style={{ padding: "8rem 3rem 5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Fade><SectionHeader num="01" label="Road to Bronze" sub="Portim\u00e3o, Portugal \u00b7 November 2025" /></Fade>

          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.08) 90%, rgba(255,255,255,0.0))", pointerEvents: "none" }} />

            {TOURNAMENT_NARRATIVE.map((block, i) => (
              <Fade key={block.phase} delay={i * 0.08}>
                <div style={{ display: "flex", gap: 0, position: "relative" }}>
                  {/* Left: label + score */}
                  <div style={{ width: 110, flexShrink: 0, paddingRight: "1.5rem", paddingTop: "0.15rem", textAlign: "right" }}>
                    <p style={{ fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: block.canada ? "#ffaa33" : block.isBronze ? "rgba(255,170,51,0.6)" : "rgba(100,150,255,0.6)", marginBottom: "0.3rem", lineHeight: 1.3 }}>{block.phase}</p>
                    <p style={{ fontFamily: "monospace", fontSize: block.canada ? "1.1rem" : "0.85rem", fontWeight: block.canada ? 500 : 300, color: block.canada ? "#ffaa33" : block.isBronze ? "rgba(255,170,51,0.8)" : "rgba(255,255,255,0.5)", lineHeight: 1 }}>{block.score}</p>
                  </div>
                  {/* Dot */}
                  <div style={{ position: "relative", flexShrink: 0, width: 0 }}>
                    <div style={{ position: "absolute", top: "0.4rem", left: -6, width: 13, height: 13, borderRadius: "50%", background: block.canada ? "#ffaa33" : block.isBronze ? "rgba(255,170,51,0.5)" : "rgba(255,255,255,0.12)", border: `1px solid ${block.canada ? "#ffaa33" : block.isBronze ? "rgba(255,170,51,0.4)" : "rgba(255,255,255,0.15)"}`, boxShadow: block.canada ? "0 0 12px rgba(255,170,51,0.4)" : "none" }} />
                  </div>
                  {/* Right: content */}
                  <div style={{ flex: 1, paddingLeft: "2.5rem", paddingBottom: block.canada || block.isBronze ? "2rem" : "3.5rem" }}>
                    {block.canada ? (
                      <div style={{ background: "rgba(255,170,51,0.04)", border: "1px solid rgba(255,170,51,0.2)", borderRadius: "8px", padding: "2rem", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle, rgba(255,170,51,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
                        <p style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,170,51,0.5)", marginBottom: "0.7rem" }}>{block.label}</p>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 400, color: "#fff", marginBottom: "1rem", lineHeight: 1.25 }}>{block.heading}</h3>
                        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: "1.8rem" }}>{block.body}</p>
                        <div style={{ marginBottom: "1.8rem", borderRadius: "4px", overflow: "hidden", background: "rgba(0,0,0,0.3)", padding: "1rem 0.5rem 0.5rem" }}>
                          <ScoreChart data={CANADA_GAME} annotations={[
                            { i: 10, label: "5\u20135", cze: true },
                            { i: 12, label: "7\u20135 run", cze: true },
                            { i: 21, label: "12\u20139", cze: true },
                          ]} />
                        </div>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          {block.stats.map(([v, l]) => (
                            <div key={l} style={{ padding: "0.6rem 1rem", border: "1px solid rgba(255,170,51,0.15)", borderRadius: "4px", textAlign: "center" }}>
                              <div style={{ fontSize: "1.1rem", fontWeight: 300, color: "#ffaa33", lineHeight: 1 }}>{v}</div>
                              <div style={{ fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: "0.3rem" }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : block.isBronze ? (
                      <div>
                        <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>{block.label}</p>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 400, color: "rgba(255,220,150,0.95)", marginBottom: "0.9rem", lineHeight: 1.3 }}>{block.heading}</h3>
                        <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.9, marginBottom: "1.8rem" }}>{block.body}</p>
                        <div style={{ borderRadius: "4px", overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "1rem 0.5rem 0.5rem", marginBottom: "3.5rem" }}>
                          <ScoreChart data={BRONZE_GAME} annotations={[
                            { i: 17, label: "9\u20138 ESP", cze: false },
                            { i: 19, label: "10\u20139 ESP", cze: false },
                            { i: 21, label: "11\u201310 ESP", cze: false },
                            { i: 23, label: "12\u201311 \u2713", cze: true },
                          ]} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>{block.label}</p>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 400, color: "#fff", marginBottom: "0.9rem", lineHeight: 1.3 }}>{block.heading}</h3>
                        <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.9 }}>{block.body}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section id="Results" style={{ padding: "6rem 3rem 7rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.008)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Fade><SectionHeader num="02" label="Match Results" sub="9 wins \u00b7 4 losses \u00b7 Bronze medal" /></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.2rem" }}>
            {resultsByPhase.map(({ phase, games }) => {
              const isBronze = phase === "Bronze Medal";
              const wins = games.filter(g => g.us > g.them).length;
              const total = games.length;
              return (
                <Fade key={phase} delay={0.05}>
                  <div style={{ border: `1px solid ${isBronze ? "rgba(255,170,51,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: isBronze ? "rgba(255,170,51,0.06)" : "rgba(255,255,255,0.02)" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: isBronze ? "#ffaa33" : "rgba(100,150,255,0.75)" }}>
                        {isBronze ? "\uD83E\uDD49 " : ""}{phase}
                      </span>
                      {!isBronze && <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>{wins}W \u2013 {total - wins}L</span>}
                    </div>
                    {games.map((g, i) => {
                      const win = g.us > g.them;
                      const isCanada = g.opponent === "Canada";
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 28px", alignItems: "center", padding: `${isCanada ? "0.85rem" : "0.65rem"} 1.1rem`, borderBottom: i < games.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", background: g.final ? "rgba(255,170,51,0.04)" : isCanada ? "rgba(255,170,51,0.025)" : "transparent" }}>
                          <div>
                            <span style={{ fontSize: "0.8rem", color: g.final || isCanada ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)", fontWeight: g.final || isCanada ? 400 : 300, display: "block" }}>{g.opponent}</span>
                            {isCanada && <span style={{ fontSize: "0.56rem", letterSpacing: "0.1em", color: "rgba(255,170,51,0.55)", display: "block", marginTop: "2px" }}>Undefeated \u00b7 1 offensive turnover</span>}
                          </div>
                          <span style={{ fontFamily: "monospace", fontSize: "0.92rem", fontWeight: 500, color: g.final ? "#ffaa33" : win ? "#6699ff" : "rgba(255,255,255,0.22)", letterSpacing: "0.03em", textAlign: "right" }}>{g.us}\u2013{g.them}</span>
                          <span style={{ fontSize: "0.58rem", fontWeight: 500, color: g.final ? "#ffaa33" : win ? "rgba(80,200,100,0.85)" : "rgba(255,70,70,0.55)", textAlign: "right", letterSpacing: "0.05em" }}>
                            {g.final ? "\uD83E\uDD49" : win ? "W" : "L"}
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

      {/* ── GALLERY ── */}
      <section id="Gallery" style={{ padding: "7rem 3rem 8rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Fade><SectionHeader num="03" label="Gallery" sub="Portim\u00e3o 2025 \u00b7 Czech Mixed 2026" /></Fade>

          {/* Featured team photo full-width */}
          <Fade delay={0.05}>
            <div style={{ marginBottom: "3px" }}>
              <PhotoTile photo={FEATURED_PHOTO} onClick={() => openLightbox(GALLERY, 0)} style={{ width: "100%", aspectRatio: "21/9", borderRadius: "4px 4px 0 0" }} />
            </div>
          </Fade>

          {/* Masonry grid */}
          <Fade delay={0.1}>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", margin: "1.5rem 0 1.2rem" }}>
              click to expand &middot; &#8592; &#8594; to navigate
            </p>
            <div style={{ columnCount: 4, columnGap: "3px" }}>
              {ALL_PHOTOS.map((photo, i) => (
                <div key={photo.file} style={{ breakInside: "avoid", marginBottom: "3px" }}>
                  <PhotoTile photo={photo} onClick={() => openLightbox(GALLERY, i + 1)} />
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.8rem 3rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>David</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>Czech Republic &middot; Ultimate Frisbee</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.08em", color: "rgba(255,170,51,0.6)" }}>WBUC Portim&#227;o 2025 &middot; &#x1F949;</span>
      </footer>

    </div>
  );
}

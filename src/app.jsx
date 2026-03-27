import { useState, useEffect, useRef } from "react";

const TEAMS = [
  { name: "Rhino Slam!", note: "US Champions 2024", country: "🇺🇸", years: "2024" },
  { name: "Gentle", note: "Belgian Club", country: "🇧🇪", years: "" },
  { name: "Chupacabras", note: "Czech Club", country: "🇨🇿", years: "" },
  { name: "Fuj", note: "Czech Club", country: "🇨🇿", years: "" },
  { name: "3sb", note: "Czech Club", country: "🇨🇿", years: "" },
  { name: "Czech Open", note: "National Team", country: "🇨🇿", years: "2015 · 2019 · 2023" },
  { name: "Czech Mixed", note: "National Team", country: "🇨🇿", years: "2016 · 2026" },
];

const ACHIEVEMENTS = [
  {
    medal: "🥉",
    title: "World Beach Ultimate Championship",
    detail: "Bronze Medal — World Stage",
    year: "Beach Worlds",
  },
  {
    medal: "🥈",
    title: "Windmill Windup",
    detail: "Silver Medal — Amsterdam",
    year: "Windmill",
  },
  {
    medal: "🥉",
    title: "Windmill Windup ×2",
    detail: "Two Bronze Medals — Amsterdam",
    year: "Windmill",
  },
  {
    medal: "🏆",
    title: "Czech National Championships",
    detail: "Multiple National Titles",
    year: "Czech",
  },
  {
    medal: "©",
    title: "Club Captain — 5 Years",
    detail: "Led European campaign roster",
    year: "5 Seasons",
  },
  {
    medal: "🌍",
    title: "WUCC 2025",
    detail: "World Ultimate Club Championships — August",
    year: "2025",
  },
];

const NAV_LINKS = ["Career", "Teams", "Achievements", "WUCC 2025"];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s ${delay}s ease, transform 0.75s ${delay}s ease`,
      }}
    >
      {children}
    </div>
  );
}

function DiscIcon({ size = 40, spinning = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={spinning ? { animation: "spin 10s linear infinite" } : {}}
    >
      <ellipse cx="20" cy="20" rx="18" ry="18" fill="none" stroke="#D94F1E" strokeWidth="1.5" />
      <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="#D94F1E" strokeWidth="1" opacity="0.45" />
      <ellipse cx="20" cy="20" rx="4" ry="4" fill="#D94F1E" opacity="0.7" />
    </svg>
  );
}

export default function DavidUltimate() {
  const [activeSection, setActiveSection] = useState("Career");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fade-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      * { margin:0; padding:0; box-sizing:border-box; }
      html { scroll-behavior: smooth; }
      body { background:#F7F4EE; }
      ::-webkit-scrollbar { width:4px; }
      ::-webkit-scrollbar-track { background:#F7F4EE; }
      ::-webkit-scrollbar-thumb { background:#D94F1E; border-radius:2px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const s = styles;

  return (
    <div style={s.root}>

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <span style={s.navLogo}>D · V</span>
        <ul style={s.navLinks}>
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <a href={`#${l.replace(" ", "")}`} style={s.navLink}
                onMouseEnter={e => e.target.style.color = "#D94F1E"}
                onMouseLeave={e => e.target.style.color = "#6b6560"}
              >{l}</a>
            </li>
          ))}
        </ul>
        <div style={s.navDisc}><DiscIcon size={28} spinning /></div>
      </nav>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroLeft}>
          <p style={s.heroEyebrow}>Ultimate Frisbee · Czech Republic</p>
          <h1 style={s.heroName}>
            <span style={s.heroNameLine1}>David</span>
            <span style={s.heroNameLine2}>16 Years<br />on the Field.</span>
          </h1>
          <p style={s.heroSub}>
            Athlete. Captain. Competitor. From Czech club fields to US champions, Belgian squads, and World Championships.
          </p>
          <div style={s.heroBadges}>
            <span style={s.badge}>WUCC 2025</span>
            <span style={s.badge}>Czech National Team</span>
            <span style={s.badge}>Rhino Slam! 2024</span>
          </div>
        </div>
        <div style={s.heroRight}>
          <div style={s.heroAccentBox}>
            <div style={s.heroAccentInner}>
              <span style={s.heroAccentNum}>16</span>
              <span style={s.heroAccentLabel}>Years of Elite Play</span>
            </div>
          </div>
          <div style={s.heroStatRow}>
            {[["7+", "Teams"], ["3", "World Events"], ["5×", "Captain"]].map(([v, l]) => (
              <div key={l} style={s.heroStat}>
                <span style={s.heroStatVal}>{v}</span>
                <span style={s.heroStatLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={s.ruleLine} />

      {/* ── CAREER OVERVIEW ── */}
      <section id="Career" style={s.section}>
        <Reveal>
          <p style={s.sectionLabel}>Career Overview</p>
          <h2 style={s.sectionTitle}>The Journey</h2>
        </Reveal>
        <div style={s.careerGrid}>
          <Reveal delay={0.05}>
            <p style={s.bodyText}>
              Sixteen years of elite ultimate frisbee across club, national, and international competition. Started in the Czech club scene before breaking onto national and European stages — ultimately reaching the game's highest levels alongside US champions and world-class competition.
            </p>
            <p style={s.bodyText} style={{...s.bodyText, marginTop: "1rem"}}>
              Three appearances with the Czech national open team (2015, 2019, 2023) and two with the Czech mixed team (2016, 2026) mark a career of consistent selection at the top level. Currently one of the most experienced players on a WUCC 2025-bound squad, holding O-line strategy and D-line smart poaching responsibility.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={s.timelineBox}>
              {[
                ["2009", "Started competitive ultimate"],
                ["2015", "Czech Open National Team debut"],
                ["2016", "Czech Mixed National Team"],
                ["2019", "Czech Open — second call-up"],
                ["2024", "Rhino Slam! — US Champions"],
                ["2025", "WUCC — World Club Champs"],
              ].map(([year, event]) => (
                <div key={year} style={s.timelineRow}>
                  <span style={s.timelineYear}>{year}</span>
                  <span style={s.timelineDot} />
                  <span style={s.timelineEvent}>{event}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div style={s.ruleLine} />

      {/* ── TEAMS ── */}
      <section id="Teams" style={{ ...s.section, background: "#111010" }}>
        <Reveal>
          <p style={{ ...s.sectionLabel, color: "#D94F1E" }}>Clubs & Nations</p>
          <h2 style={{ ...s.sectionTitle, color: "#F7F4EE" }}>Teams Played For</h2>
        </Reveal>
        <div style={s.teamsGrid}>
          {TEAMS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <div
                style={s.teamCard}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#D94F1E"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              >
                <span style={s.teamFlag}>{t.country}</span>
                <h3 style={s.teamName}>{t.name}</h3>
                <p style={s.teamNote}>{t.note}</p>
                {t.years && <p style={s.teamYears}>{t.years}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div style={s.ruleLine} />

      {/* ── ACHIEVEMENTS ── */}
      <section id="Achievements" style={s.section}>
        <Reveal>
          <p style={s.sectionLabel}>On the Podium</p>
          <h2 style={s.sectionTitle}>Achievements</h2>
        </Reveal>
        <div style={s.achieveGrid}>
          {ACHIEVEMENTS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div
                style={s.achieveCard}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#D94F1E";
                  e.currentTarget.querySelector(".achieve-title").style.color = "#fff";
                  e.currentTarget.querySelector(".achieve-detail").style.color = "rgba(255,255,255,0.75)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.querySelector(".achieve-title").style.color = "#111010";
                  e.currentTarget.querySelector(".achieve-detail").style.color = "#6b6560";
                }}
              >
                <span style={s.achieveMedal}>{a.medal}</span>
                <h3 className="achieve-title" style={s.achieveTitle}>{a.title}</h3>
                <p className="achieve-detail" style={s.achieveDetail}>{a.detail}</p>
                <span style={s.achieveYear}>{a.year}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div style={s.ruleLine} />

      {/* ── WUCC ── */}
      <section id="WUCC2025" style={{ ...s.section, background: "#1a1a1a" }}>
        <div style={s.wuccInner}>
          <Reveal>
            <p style={{ ...s.sectionLabel, color: "#D94F1E" }}>Next Chapter</p>
            <h2 style={{ ...s.sectionTitle, color: "#F7F4EE", fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
              WUCC<br />2025
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ ...s.bodyText, color: "rgba(247,244,238,0.7)", maxWidth: 520, marginTop: "1.5rem" }}>
              The World Ultimate Club Championships — August 2025. The peak of club competition globally. After 16 years building toward moments like this, David enters as one of the most experienced players on a squad that qualified and is ready to compete.
            </p>
            <div style={s.wuccRoles}>
              {[
                ["O-Line", "Primary system architect. Spread as the core identity."],
                ["D-Line", "Smart poaching — reading lanes before the disc moves."],
                ["Leadership", "One of seven in the leadership group. Mentor and anchor."],
              ].map(([role, desc]) => (
                <div key={role} style={s.wuccRole}>
                  <span style={s.wuccRoleTitle}>{role}</span>
                  <span style={s.wuccRoleDesc}>{desc}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div style={s.wuccBigNum}>2025</div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <span style={s.footerLogo}>D · V</span>
        <span style={s.footerNote}>16 Years · Czech Republic · World Stage</span>
        <DiscIcon size={24} spinning />
      </footer>
    </div>
  );
}

// ── STYLES ──
const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#F7F4EE",
    color: "#111010",
    minHeight: "100vh",
    overflowX: "hidden",
  },

  // NAV
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.1rem 4rem",
    background: "rgba(247,244,238,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.07)",
  },
  navLogo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "#D94F1E",
  },
  navLinks: {
    display: "flex",
    gap: "2.5rem",
    listStyle: "none",
  },
  navLink: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.72rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#6b6560",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  navDisc: { display: "flex", alignItems: "center" },

  // HERO
  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4rem",
    padding: "6rem 4rem 5rem",
    alignItems: "center",
    minHeight: "90vh",
  },
  heroLeft: {
    animation: "fade-in 0.9s ease forwards",
  },
  heroEyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.72rem",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#D94F1E",
    marginBottom: "1.5rem",
  },
  heroName: {
    fontFamily: "'Playfair Display', serif",
    lineHeight: 1.0,
    marginBottom: "1.8rem",
  },
  heroNameLine1: {
    display: "block",
    fontSize: "clamp(3rem, 7vw, 6rem)",
    fontWeight: 900,
    fontStyle: "italic",
    color: "#111010",
  },
  heroNameLine2: {
    display: "block",
    fontSize: "clamp(1.8rem, 4vw, 3rem)",
    fontWeight: 700,
    color: "#D94F1E",
    lineHeight: 1.15,
    marginTop: "0.3rem",
  },
  heroSub: {
    fontSize: "1rem",
    fontWeight: 300,
    color: "#6b6560",
    lineHeight: 1.75,
    maxWidth: 440,
    marginBottom: "2rem",
  },
  heroBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.6rem",
  },
  badge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.68rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.35rem 0.85rem",
    border: "1px solid #D94F1E",
    color: "#D94F1E",
    background: "transparent",
  },
  heroRight: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    alignItems: "flex-end",
  },
  heroAccentBox: {
    width: "100%",
    maxWidth: 340,
    aspectRatio: "1",
    border: "1px solid rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111010",
    position: "relative",
    overflow: "hidden",
  },
  heroAccentInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  heroAccentNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(5rem, 10vw, 8rem)",
    fontWeight: 900,
    color: "#D94F1E",
    lineHeight: 1,
  },
  heroAccentLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.7rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "rgba(247,244,238,0.5)",
  },
  heroStatRow: {
    display: "flex",
    gap: "2rem",
    width: "100%",
    maxWidth: 340,
    justifyContent: "space-between",
  },
  heroStat: { display: "flex", flexDirection: "column", gap: "0.2rem" },
  heroStatVal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#111010",
    lineHeight: 1,
  },
  heroStatLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.62rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#9b9590",
  },

  // RULE
  ruleLine: {
    height: "1px",
    background: "linear-gradient(to right, transparent, rgba(0,0,0,0.12), transparent)",
    margin: "0 4rem",
  },

  // SECTIONS
  section: {
    padding: "6rem 4rem",
  },
  sectionLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.7rem",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "#D94F1E",
    marginBottom: "0.6rem",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 700,
    color: "#111010",
    marginBottom: "3rem",
    lineHeight: 1.1,
  },
  bodyText: {
    fontSize: "1rem",
    fontWeight: 300,
    color: "#4a4540",
    lineHeight: 1.8,
  },

  // CAREER
  careerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "5rem",
    alignItems: "start",
  },
  timelineBox: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    borderLeft: "1px solid rgba(217,79,30,0.25)",
    paddingLeft: "1.5rem",
  },
  timelineRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.8rem 0",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    position: "relative",
  },
  timelineYear: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.72rem",
    letterSpacing: "0.1em",
    color: "#D94F1E",
    minWidth: 36,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#D94F1E",
    flexShrink: 0,
    position: "absolute",
    left: -19,
  },
  timelineEvent: {
    fontSize: "0.9rem",
    color: "#4a4540",
    fontWeight: 400,
  },

  // TEAMS
  teamsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    marginTop: "1rem",
  },
  teamCard: {
    padding: "2rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#1a1a1a",
    transition: "border-color 0.25s",
    cursor: "default",
  },
  teamFlag: { fontSize: "1.4rem", marginBottom: "0.4rem" },
  teamName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#F7F4EE",
    lineHeight: 1.2,
  },
  teamNote: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(247,244,238,0.35)",
  },
  teamYears: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.68rem",
    letterSpacing: "0.08em",
    color: "#D94F1E",
    marginTop: "0.5rem",
  },

  // ACHIEVEMENTS
  achieveGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1px",
    background: "rgba(0,0,0,0.06)",
  },
  achieveCard: {
    padding: "2.2rem 2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.07)",
    transition: "background 0.25s",
    cursor: "default",
  },
  achieveMedal: { fontSize: "1.6rem", marginBottom: "0.4rem" },
  achieveTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#111010",
    transition: "color 0.25s",
    lineHeight: 1.3,
  },
  achieveDetail: {
    fontSize: "0.85rem",
    color: "#6b6560",
    fontWeight: 300,
    transition: "color 0.25s",
  },
  achieveYear: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.62rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(217,79,30,0.6)",
    marginTop: "0.5rem",
  },

  // WUCC
  wuccInner: {
    maxWidth: 580,
    position: "relative",
    zIndex: 2,
  },
  wuccRoles: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    marginTop: "2.5rem",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  wuccRole: {
    display: "flex",
    gap: "2rem",
    alignItems: "baseline",
    padding: "1rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  wuccRoleTitle: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#D94F1E",
    minWidth: 80,
  },
  wuccRoleDesc: {
    fontSize: "0.9rem",
    color: "rgba(247,244,238,0.6)",
    fontWeight: 300,
    lineHeight: 1.6,
  },
  wuccBigNum: {
    position: "absolute",
    right: "4rem",
    top: "50%",
    transform: "translateY(-50%)",
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(6rem, 14vw, 12rem)",
    fontWeight: 900,
    color: "rgba(255,255,255,0.03)",
    lineHeight: 1,
    userSelect: "none",
    pointerEvents: "none",
  },

  // FOOTER
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "2rem 4rem",
    borderTop: "1px solid rgba(0,0,0,0.08)",
    background: "#F7F4EE",
  },
  footerLogo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "#D94F1E",
  },
  footerNote: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.65rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#9b9590",
  },
};

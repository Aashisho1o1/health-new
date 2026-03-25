import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Clock, CheckCircle, ArrowRight, Filter } from "lucide-react";
import { CASES } from "../data/cases";

const DIFFICULTY_COLOR: Record<string, { color: string; bg: string; border: string }> = {
  Foundational: { color: "#42a083", bg: "#e8f4f1", border: "#b8ddd5" },
  Intermediate: { color: "#ed9822", bg: "#fff5e6", border: "#f5d6a0" },
  Advanced: { color: "#af1d27", bg: "#fdf2f3", border: "#f0c4c6" },
};

const STATUS_COLOR: Record<string, { color: string; bg: string; label: string }> = {
  "not-started": { color: "#5d615a", bg: "#f4f4f4", label: "Not Started" },
  "in-progress": { color: "#005a93", bg: "#e8f1f8", label: "In Progress" },
  completed: { color: "#42a083", bg: "#e8f4f1", label: "Completed" },
};

const SYSTEMS = ["All Systems", ...Array.from(new Set(CASES.map(c => c.system)))];
const DIFFICULTIES = ["All Levels", "Foundational", "Intermediate", "Advanced"];
const SETTINGS = ["All Settings", ...Array.from(new Set(CASES.map(c => c.setting)))];

export function Cases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [system, setSystem] = useState("All Systems");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [setting, setSetting] = useState("All Settings");

  const filtered = CASES.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.patient.name.toLowerCase().includes(q) || c.chiefComplaint.toLowerCase().includes(q) || c.system.toLowerCase().includes(q) || c.condition.toLowerCase().includes(q);
    const matchSystem = system === "All Systems" || c.system === system;
    const matchDiff = difficulty === "All Levels" || c.difficulty === difficulty;
    const matchSetting = setting === "All Settings" || c.setting === setting;
    return matchSearch && matchSystem && matchDiff && matchSetting;
  });

  return (
    <div style={{ fontFamily: "var(--font-ui)", maxWidth: 1440, margin: "0 auto", padding: "40px 32px", display: "flex", gap: 28, alignItems: "flex-start" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 20, position: "sticky", top: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "#5d615a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
          <Filter size={12} /> Filters
        </div>
        {[
          { label: "Body System", options: SYSTEMS, val: system, set: setSystem },
          { label: "Difficulty", options: DIFFICULTIES, val: difficulty, set: setDifficulty },
          { label: "Setting", options: SETTINGS, val: setting, set: setSetting },
        ].map(({ label, options, val, set }) => (
          <div key={label} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>{label}</div>
            {options.map(opt => (
              <button key={opt} onClick={() => set(opt)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 10px", borderRadius: 6, border: "none", fontSize: 13, color: val === opt ? "#af1d27" : "#5d615a", background: val === opt ? "#fdf2f3" : "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontWeight: val === opt ? 600 : 400, marginBottom: 1 }}>
                {opt}
              </button>
            ))}
          </div>
        ))}
        <div style={{ paddingTop: 14, borderTop: "1px solid #e0e0e0", fontSize: 12, color: "#5d615a" }}>
          <div><strong style={{ color: "#42a083" }}>1</strong> completed</div>
          <div><strong style={{ color: "#005a93" }}>1</strong> in progress</div>
          <div><strong style={{ color: "#5d615a" }}>2</strong> not started</div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#af1d27", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Case Library</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Patient Cases</h1>
          <p style={{ fontSize: 14, color: "#5d615a" }}>{CASES.length} simulated patient encounters available this semester</p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#5d615a" }} />
          <input type="text" placeholder="Search by patient name, complaint, system…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, color: "#1a1a1a", background: "#fff", fontFamily: "var(--font-ui)", outline: "none", boxSizing: "border-box" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#af1d27")}
            onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
        </div>

        {search && <p style={{ fontSize: 13, color: "#5d615a", marginBottom: 14 }}>Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "<strong>{search}</strong>"</p>}

        {/* Cases list */}
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: "60px 32px", textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>No cases found</p>
            <p style={{ fontSize: 13, color: "#5d615a", marginBottom: 16 }}>Try adjusting your filters or search terms.</p>
            <button onClick={() => { setSearch(""); setSystem("All Systems"); setDifficulty("All Levels"); setSetting("All Settings"); }}
              style={{ padding: "7px 18px", background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-ui)" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(c => {
              const diff = DIFFICULTY_COLOR[c.difficulty];
              const st = STATUS_COLOR[c.status || "not-started"];
              const pct = c.progress || 0;
              return (
                <div key={c.id}
                  onClick={() => navigate(`/interview/${c.id}`)}
                  style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden", cursor: "pointer", display: "flex", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"}>
                  {/* Portrait */}
                  <div style={{ width: 110, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                    <img src={c.patient.portrait} alt={c.patient.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "brightness(0.85)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.15))" }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>{c.patient.name}</div>
                        <div style={{ fontSize: 12, color: "#5d615a" }}>{c.patient.age} years old · {c.patient.gender} · {c.setting}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ padding: "3px 10px", background: st.bg, borderRadius: 20, fontSize: 11, color: st.color, fontWeight: 600 }}>{st.label}</span>
                        <span style={{ padding: "3px 10px", background: diff.bg, border: `1px solid ${diff.border}`, borderRadius: 20, fontSize: 11, color: diff.color, fontWeight: 500 }}>{c.difficulty}</span>
                        <span style={{ padding: "3px 10px", background: "#f0f6fb", border: "1px solid #cce0f0", borderRadius: 20, fontSize: 11, color: "#005a93", fontWeight: 500 }}>{c.system}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: 14, color: "#1a1a1a", fontStyle: "italic", marginBottom: 10 }}>"{c.chiefComplaint}"</p>
                    <p style={{ fontSize: 13, color: "#5d615a", lineHeight: 1.6, marginBottom: 12 }}>
                      Identify the diagnosis by asking about symptoms, history, and risk factors. Clinical images are revealed upon correct diagnosis.
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#5d615a" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {c.estimatedTime}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={11} /> {c.clues.length} clues to uncover</span>
                      </div>
                      {pct > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 90, height: 4, background: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: c.status === "completed" ? "#42a083" : "#af1d27", borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 11, color: "#5d615a" }}>{pct}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", padding: "0 20px", borderLeft: "1px solid #f0f0f0", color: "#af1d27", flexShrink: 0 }}>
                    <ArrowRight size={18} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

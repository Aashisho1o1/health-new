import { useNavigate } from "react-router";
import { BarChart2, CheckCircle2, PlayCircle, Circle, ArrowRight, Clock, MessageSquare, Stethoscope, Target, Award, BookOpen } from "lucide-react";
import { CASES } from "../data/cases";

const STATS = [
  { label: "Cases Attempted", value: 2, icon: MessageSquare, color: "#005a93", bg: "#e8f1f8" },
  { label: "Diagnoses Made", value: 1, icon: Stethoscope, color: "#af1d27", bg: "#fdf2f3" },
  { label: "Cases Completed", value: 1, icon: Award, color: "#42a083", bg: "#e8f4f1" },
  { label: "Clues Uncovered", value: 19, icon: Target, color: "#ed9822", bg: "#fff5e6" },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  "not-started": { color: "#5d615a", bg: "#f4f4f4", label: "Not Started", icon: Circle },
  "in-progress": { color: "#005a93", bg: "#e8f1f8", label: "In Progress", icon: PlayCircle },
  completed: { color: "#42a083", bg: "#e8f4f1", label: "Completed", icon: CheckCircle2 },
};

const FEEDBACK = [
  { case: "James Okafor", note: "Good identification of migratory pain pattern. Consider exploring the urological differential earlier.", score: 78, time: "Today" },
  { case: "Sophie Chen", note: "Excellent history-taking. The visual aura and contraceptive pill interaction were both identified correctly.", score: 94, time: "Yesterday" },
];

export function Progress() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "var(--font-ui)", maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#af1d27", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Your Learning</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Clinical Progress</h1>
        <p style={{ fontSize: 14, color: "#5d615a" }}>Track your patient interview practice and diagnostic accuracy this semester.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 36 }}>
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#1a1a1a", fontFamily: "var(--font-serif)", lineHeight: 1, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 13, color: "#5d615a" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "flex-start" }}>
        {/* Case progress list */}
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, color: "#1a1a1a", marginBottom: 16 }}>Case History</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {CASES.map(c => {
              const s = STATUS_CONFIG[c.status || "not-started"];
              const StatusIcon = s.icon;
              const pct = c.progress || 0;
              return (
                <div key={c.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <img src={c.patient.portrait} alt={c.patient.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", objectPosition: "top", flexShrink: 0, filter: "brightness(0.88)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{c.patient.name}, {c.patient.age}</div>
                        <div style={{ fontSize: 12, color: "#5d615a", fontStyle: "italic" }}>"{c.chiefComplaint}"</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", background: s.bg, borderRadius: 20, fontSize: 11, color: s.color, fontWeight: 600 }}>
                        <StatusIcon size={11} />{s.label}
                      </div>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5d615a", marginBottom: 3 }}>
                        <span>{Math.round((pct / 100) * c.clues.length)}/{c.clues.length} clues found</span>
                        <span>{pct}%</span>
                      </div>
                      <div style={{ height: 4, background: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: c.status === "completed" ? "#42a083" : c.status === "in-progress" ? "#af1d27" : "#e0e0e0", borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#5d615a" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} /> {c.estimatedTime}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><BarChart2 size={10} /> {c.difficulty}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Stethoscope size={10} /> {c.system}</span>
                      </div>
                      <button onClick={() => navigate(`/interview/${c.id}`)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: c.status === "completed" ? "#e8f4f1" : c.status === "in-progress" ? "#fdf2f3" : "#f7f7f6", border: c.status === "completed" ? "1px solid #b8ddd5" : c.status === "in-progress" ? "1px solid #f0c4c6" : "1px solid #e0e0e0", borderRadius: 6, fontSize: 12, fontWeight: 500, color: c.status === "completed" ? "#42a083" : c.status === "in-progress" ? "#af1d27" : "#5d615a", cursor: "pointer", fontFamily: "var(--font-ui)" }}>
                        {c.status === "completed" ? "Review" : c.status === "in-progress" ? "Continue" : "Start"} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Recent feedback */}
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #e0e0e0", background: "#fafafa", display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={14} color="#af1d27" />
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Session Feedback</h3>
            </div>
            {FEEDBACK.map((f, i) => (
              <div key={i} style={{ padding: "14px 18px", borderBottom: i < FEEDBACK.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{f.case}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: f.score >= 90 ? "#42a083" : f.score >= 70 ? "#ed9822" : "#af1d27" }}>{f.score}%</span>
                    <span style={{ fontSize: 10, color: "#9e9e9e" }}>{f.time}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#5d615a", lineHeight: 1.6 }}>{f.note}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 14 }}>Quick Actions</h3>
            {[
              { icon: PlayCircle, label: "Resume James Okafor", sub: "Appendicitis case — 40% complete", color: "#af1d27", to: "/interview/case-002" },
              { icon: Target, label: "Start a new case", sub: "4 cases available this semester", color: "#005a93", to: "/cases" },
              { icon: CheckCircle2, label: "Review completed case", sub: "Sophie Chen — Migraine, 100%", color: "#42a083", to: "/interview/case-003" },
            ].map(({ icon: Icon, label, sub, color, to }) => (
              <button key={label} onClick={() => navigate(to)}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", background: "transparent", border: "1px solid #e0e0e0", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-ui)", marginBottom: 8, textAlign: "left", transition: "border-color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#e0e0e0")}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={15} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{label}</div>
                  <div style={{ fontSize: 11, color: "#5d615a" }}>{sub}</div>
                </div>
                <ArrowRight size={13} color="#5d615a" style={{ marginLeft: "auto" }} />
              </button>
            ))}
          </div>

          {/* Notice */}
          <div style={{ background: "#f0f6fb", border: "1px solid #cce0f0", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <BookOpen size={14} color="#005a93" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: "#005a93", lineHeight: 1.7 }}>
                Progress is tracked locally during your session. Your formal OSCE assessment is managed separately through your clinical education platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

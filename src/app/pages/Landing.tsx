import { useNavigate } from "react-router";
import { ArrowRight, MessageCircle, Search, CheckCircle, Image, RotateCcw, Shield, Users, Clock, BookOpen } from "lucide-react";
import { CASES } from "../data/cases";

const DIFFICULTY_COLOR: Record<string, { color: string; bg: string }> = {
  Foundational: { color: "#42a083", bg: "#e8f4f1" },
  Intermediate: { color: "#ed9822", bg: "#fff5e6" },
  Advanced: { color: "#af1d27", bg: "#fdf2f3" },
};

const STATUS_COLOR: Record<string, { color: string; bg: string; label: string }> = {
  "not-started": { color: "#5d615a", bg: "#f4f4f4", label: "Not started" },
  "in-progress": { color: "#005a93", bg: "#e8f1f8", label: "In progress" },
  completed: { color: "#42a083", bg: "#e8f4f1", label: "Completed" },
};

export function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "var(--font-ui)", background: "#f7f7f6" }}>
      {/* Hero */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "72px 32px 64px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", background: "#fdf2f3", border: "1px solid #f0c4c6", borderRadius: 20, marginBottom: 28 }}>
            <Shield size={13} color="#af1d27" />
            <span style={{ fontSize: 12, color: "#7f1118", fontWeight: 500 }}>Simulated patient encounters - structured clinical communication training</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 46, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 20 }}>
            Let's learn medicine with the chatbot
          </h1>

          <p style={{ fontSize: 17, color: "#5d615a", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 40px" }}>
            Ask questions, review the image, and learn step by step.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/interview/case-001")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "#af1d27", color: "#ffffff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-ui)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#7f1118")}
              onMouseLeave={e => (e.currentTarget.style.background = "#af1d27")}>
              Start a consultation <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate("/cases")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "#ffffff", color: "#1a1a1a", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-ui)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#af1d27")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#e0e0e0")}>
              <BookOpen size={16} /> Browse patient cases
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#1a1a1a", padding: "48px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#af1d27", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", marginBottom: 36 }}>How it works</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
            {[
              { icon: Users, step: "1", title: "Meet your patient", desc: "A simulated patient presents with a chief complaint. Read their opening statement.", color: "#af1d27" },
              { icon: MessageCircle, step: "2", title: "Ask your questions", desc: "Interview the patient. Probe symptoms, history, lifestyle - just like a real consultation.", color: "#2499a9" },
              { icon: Search, step: "3", title: "Make your diagnosis", desc: "Once you've gathered enough information, submit your clinical diagnosis.", color: "#ed9822" },
              { icon: Image, step: "4", title: "Explore the findings", desc: "Correct diagnosis unlocks the clinical image. Discuss findings in depth with the patient.", color: "#42a083" },
            ].map(({ icon: Icon, step, title, desc, color }) => (
              <div key={step} style={{ padding: "28px 24px", background: "#1a1a1a" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}25`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${color}50` }}>
                    <Icon size={16} color={color} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: "0.1em" }}>STEP {step}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#ffffff", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cases */}
      <section style={{ padding: "60px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#af1d27", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Patient Cases</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600, color: "#1a1a1a" }}>Your current cases</h2>
          </div>
          <button onClick={() => navigate("/cases")}
            style={{ fontSize: 14, color: "#005a93", background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
            See all cases <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {CASES.map(c => {
            const diff = DIFFICULTY_COLOR[c.difficulty];
            const st = STATUS_COLOR[c.status || "not-started"];
            return (
              <div key={c.id}
                onClick={() => navigate(`/interview/${c.id}`)}
                style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s, transform 0.15s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; el.style.transform = "translateY(0)"; }}>
                {/* Patient photo */}
                <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
                  <img src={c.patient.portrait} alt={c.patient.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "brightness(0.82)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                  <div style={{ position: "absolute", bottom: 10, left: 12, color: "#fff" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{c.patient.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>{c.patient.age}y | {c.patient.gender} | {c.setting}</div>
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 9px", background: st.bg, borderRadius: 20, fontSize: 10, color: st.color, fontWeight: 600 }}>
                    {st.label}
                  </div>
                </div>

                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ padding: "2px 8px", background: "#f0f6fb", border: "1px solid #cce0f0", borderRadius: 20, fontSize: 10, color: "#005a93", fontWeight: 500 }}>{c.system}</span>
                    <span style={{ padding: "2px 8px", background: diff.bg, borderRadius: 20, fontSize: 10, color: diff.color, fontWeight: 500 }}>{c.difficulty}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#5d615a", lineHeight: 1.55, fontStyle: "italic", marginBottom: 12 }}>"{c.chiefComplaint}"</p>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#5d615a", marginBottom: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {c.estimatedTime}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><CheckCircle size={11} /> {c.clues.length} clues</span>
                  </div>
                  {(c.status === "in-progress" || c.status === "completed") && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ height: 3, background: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${c.progress}%`, background: c.status === "completed" ? "#42a083" : "#af1d27", borderRadius: 4 }} />
                      </div>
                    </div>
                  )}
                  <button style={{ width: "100%", padding: "8px 0", background: "#fdf2f3", border: "1.5px solid #f0c4c6", borderRadius: 7, fontSize: 13, fontWeight: 600, color: "#af1d27", cursor: "pointer", fontFamily: "var(--font-ui)" }}
                    onClick={e => { e.stopPropagation(); navigate(`/interview/${c.id}`); }}>
                    {c.status === "completed" ? "Review Case" : c.status === "in-progress" ? "Continue Interview" : "Begin Consultation"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Notice */}
      <section style={{ padding: "0 32px 48px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", background: "#f0f6fb", border: "1px solid #cce0f0", borderRadius: 10, padding: "16px 20px", display: "flex", gap: 12 }}>
          <RotateCcw size={15} color="#005a93" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: "#005a93", lineHeight: 1.7 }}>
            <strong>All patient cases are fictional simulations</strong> designed for educational purposes only. No real patient data is used. This tool does not replace clinical practice or real patient interaction.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Outlet, Link, useLocation } from "react-router";
import { GraduationCap, LayoutGrid, BarChart2, Home } from "lucide-react";

export function AppShell() {
  const location = useLocation();
  const isInterview = location.pathname.startsWith("/interview");

  return (
    <div style={{ fontFamily: "var(--font-ui)", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f7f7f6" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: "#af1d27", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={18} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.01em" }}>
                Clinical Communication Lab
              </span>
              <span style={{ display: "block", fontSize: 10, color: "#5d615a", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: -2 }}>
                Patient Interview Simulator
              </span>
            </div>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[
              { to: "/", label: "Home", icon: Home },
              { to: "/cases", label: "Patient Cases", icon: LayoutGrid },
              { to: "/progress", label: "My Progress", icon: BarChart2 },
            ].map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
              return (
                <Link key={to} to={to} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, textDecoration: "none", fontSize: 14, fontWeight: 500, color: active ? "#af1d27" : "#5d615a", background: active ? "#fdf2f3" : "transparent", transition: "all 0.15s" }}>
                  <Icon size={15} />{label}
                </Link>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "#f7f7f6", border: "1px solid #e0e0e0", borderRadius: 6, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#7f1118", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600 }}>JS</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a" }}>J. Smith</div>
              <div style={{ fontSize: 10, color: "#5d615a" }}>Year 2 | Cohort A</div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {!isInterview && (
        <footer style={{ borderTop: "1px solid #e0e0e0", background: "#fff", padding: "18px 32px" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 12, color: "#5d615a" }}>2026 Clinical Communication Lab. Simulated cases only. Not for clinical use.</div>
            <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
              {["Privacy Policy", "Accessibility", "Course Materials"].map(l => (
                <span key={l} style={{ color: "#005a93", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

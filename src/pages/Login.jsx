import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPw, setShowPw]   = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("access_token",  "fake_token");
      localStorage.setItem("refresh_token", "fake_refresh");
      localStorage.setItem("user_name",     form.username || "Doctor");
      localStorage.setItem("user_id",       "1");
      localStorage.setItem("user_role",     "doctor");
      navigate("/dashboard");
    }, 700);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Lexend', sans-serif" }}>

      {/* ── LEFT PANEL — branding ───────────────────────────────────────── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 64px", background: "linear-gradient(145deg, #004D40 0%, #00796B 55%, #26A69A 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position:"absolute", top:-80, left:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"absolute", bottom:-120, right:-60, width:400, height:400, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
        <div style={{ position:"absolute", top:"40%", right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:56 }}>
            <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span className="material-symbols-outlined" style={{ color:"#fff", fontSize:28, fontVariationSettings:"'FILL' 1" }}>ecg_heart</span>
            </div>
            <div>
              <h1 style={{ color:"#fff", fontSize:28, fontWeight:800, margin:0, letterSpacing:"-0.5px" }}>GenVeda</h1>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:11, fontWeight:600, letterSpacing:2, margin:0 }}>CLINICAL INTELLIGENCE</p>
            </div>
          </div>

          <h2 style={{ color:"#fff", fontSize:42, fontWeight:800, lineHeight:1.15, marginBottom:20, letterSpacing:"-1px" }}>
            AI-Powered<br />Diagnostics<br />at Your Fingertips
          </h2>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:17, lineHeight:1.7, marginBottom:48, maxWidth:400 }}>
            Empowering clinicians with real-time skin analysis, automated risk scoring, and intelligent case escalation.
          </p>

          {/* Feature pills */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { icon:"biotech",        text:"AI-Powered Scan Analysis" },
              { icon:"emergency",      text:"Automated Risk Stratification" },
              { icon:"person_search",  text:"Multi-Role Clinical Workflow" },
              { icon:"auto_awesome",   text:"Voice-Assisted Documentation" },
            ].map(f => (
              <div key={f.text} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span className="material-symbols-outlined" style={{ color:"rgba(255,255,255,0.9)", fontSize:18, fontVariationSettings:"'FILL' 1" }}>{f.icon}</span>
                </div>
                <span style={{ color:"rgba(255,255,255,0.85)", fontSize:14, fontWeight:500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ─────────────────────────────────────────── */}
      <div style={{
        width: 480, display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"60px 56px", backgroundColor:"var(--c-background)", overflowY:"auto",
      }}>
        <div style={{ marginBottom:40 }}>
          <p style={{ color:"var(--c-on-surface-variant)", fontSize:13, fontWeight:600, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>Welcome back</p>
          <h2 style={{ color:"var(--c-on-surface)", fontSize:34, fontWeight:800, margin:0, letterSpacing:"-0.5px", lineHeight:1.2 }}>Sign in to<br />your account</h2>
        </div>

        {error && (
          <div style={{ background:"var(--c-error-container)", color:"var(--c-on-error-container)", padding:"12px 16px", borderRadius:12, marginBottom:20, fontSize:14, fontWeight:500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Username */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--c-on-surface-variant)", marginBottom:8 }}>Username</label>
            <div style={{ position:"relative" }}>
              <span className="material-symbols-outlined" style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"var(--c-outline)", fontSize:20 }}>person</span>
              <input
                id="login-username"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                placeholder="Enter your username"
                style={{
                  width:"100%", padding:"14px 16px 14px 48px", borderRadius:14,
                  border:"2px solid var(--c-outline-variant)", background:"var(--c-surface-container-low)",
                  color:"var(--c-on-surface)", fontSize:15, outline:"none",
                  boxSizing:"border-box", fontFamily:"'Lexend', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor="var(--c-primary)"}
                onBlur={e => e.target.style.borderColor="var(--c-outline-variant)"}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--c-on-surface-variant)", marginBottom:8 }}>Password</label>
            <div style={{ position:"relative" }}>
              <span className="material-symbols-outlined" style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"var(--c-outline)", fontSize:20 }}>lock</span>
              <input
                id="login-password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                placeholder="Enter your password"
                style={{
                  width:"100%", padding:"14px 48px 14px 48px", borderRadius:14,
                  border:"2px solid var(--c-outline-variant)", background:"var(--c-surface-container-low)",
                  color:"var(--c-on-surface)", fontSize:15, outline:"none",
                  boxSizing:"border-box", fontFamily:"'Lexend', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor="var(--c-primary)"}
                onBlur={e => e.target.style.borderColor="var(--c-outline-variant)"}
              />
              <button type="button" onClick={() => setShowPw(p=>!p)}
                style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--c-outline)", padding:0 }}>
                <span className="material-symbols-outlined" style={{ fontSize:20 }}>{showPw ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {/* Role selector (quick login demo) */}
          <div style={{ background:"var(--c-surface-container)", borderRadius:14, padding:"12px 16px" }}>
            <p style={{ color:"var(--c-on-surface-variant)", fontSize:12, fontWeight:600, marginBottom:10, letterSpacing:1, textTransform:"uppercase" }}>Sign in as (Demo)</p>
            <div style={{ display:"flex", gap:8 }}>
              {[
                { role:"doctor",  label:"Doctor",       icon:"stethoscope" },
                { role:"nurse",   label:"Health Worker", icon:"medical_services" },
                { role:"patient", label:"Patient",       icon:"person" },
              ].map(r => (
                <button key={r.role} type="button"
                  onClick={() => {
                    localStorage.setItem("access_token","fake_token");
                    localStorage.setItem("user_name", form.username || r.label);
                    localStorage.setItem("user_role", r.role);
                    const dest = { doctor:"/dashboard", nurse:"/nurse/dashboard", patient:"/patient/dashboard" };
                    navigate(dest[r.role]);
                  }}
                  style={{
                    flex:1, padding:"10px 8px", borderRadius:10,
                    border:"2px solid var(--c-outline-variant)", background:"var(--c-surface-container-low)",
                    cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="var(--c-primary)"; e.currentTarget.style.background="var(--c-primary-container)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--c-outline-variant)"; e.currentTarget.style.background="var(--c-surface-container-low)"; }}
                >
                  <span className="material-symbols-outlined" style={{ color:"var(--c-primary)", fontSize:20, fontVariationSettings:"'FILL' 1" }}>{r.icon}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:"var(--c-on-surface)", textAlign:"center", lineHeight:1.2 }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button id="login-submit" type="submit" disabled={loading}
            style={{
              width:"100%", padding:"16px", borderRadius:14, border:"none",
              background:"linear-gradient(135deg, #00796B, #26A69A)",
              color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer",
              marginTop:4, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              opacity: loading ? 0.75 : 1, fontFamily:"'Lexend', sans-serif",
              boxShadow:"0 4px 20px rgba(0,121,107,0.35)",
            }}
          >
            {loading
              ? <><span className="material-symbols-outlined" style={{ fontSize:20, animation:"spin 1s linear infinite" }}>refresh</span> Signing in...</>
              : <><span className="material-symbols-outlined" style={{ fontSize:20 }}>login</span> Sign In</>}
          </button>
        </form>

        <p style={{ color:"var(--c-on-surface-variant)", textAlign:"center", marginTop:28, fontSize:14 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color:"var(--c-primary)", fontWeight:700, textDecoration:"none" }}>Create one</Link>
        </p>

        <p style={{ color:"var(--c-outline)", textAlign:"center", marginTop:40, fontSize:12 }}>
          © 2024 GenVeda · AI Clinical Intelligence Platform
        </p>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getPatients, getScans } from "../../services/api";

export default function NurseDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("user_name") || "Nurse";

  useEffect(() => {
    Promise.all([getPatients(), getScans()])
      .then(([pRes, sRes]) => { setPatients(pRes.data); setScans(sRes.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const highRisk = scans.filter(s => s.risk_category === "HIGH" || (s.risk_score ?? 0) >= 67).length;
  const pending  = scans.filter(s => !s.reviewed).length;
  const recentScans = scans.slice(0, 5);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="material-symbols-outlined text-primary text-5xl animate-spin">refresh</span>
    </div>
  );

  return (
    <div className="pt-24 px-6 md:px-10 pb-12 max-w-6xl mx-auto w-full flex flex-col gap-8 fade-in">
      {/* Hero */}
      <div className="bg-surface-container-low p-7 rounded-[2rem] flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <p className="text-on-surface-variant text-sm tracking-widest uppercase mb-1">Health Worker Portal</p>
          <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Welcome, Nurse {userName.split(' ')[0]}</h2>
          <p className="text-on-surface-variant text-base">
            {highRisk > 0
              ? <span><strong className="text-error">{highRisk} high-risk patient(s)</strong> need escalation to doctor.</span>
              : "Shift overview looks good. Start a new scan below."}
          </p>
        </div>
        <button
          onClick={() => navigate("/nurse/scan")}
          className="bg-primary text-white font-semibold px-7 py-3.5 rounded-full shadow-lg hover:opacity-90 transition-all flex items-center gap-2 shrink-0 text-base"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings:"'FILL' 1" }}>biotech</span>
          New Scan
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: "group",   label: "Patients Registered", value: patients.length, color: "text-primary",   bg: "bg-primary-container/20" },
          { icon: "warning", label: "High Risk — Escalate", value: highRisk,        color: "text-error",     bg: "bg-error-container/30" },
          { icon: "biotech", label: "Scans Done Today",    value: scans.length,    color: "text-secondary", bg: "bg-secondary-container/30" },
        ].map(c => (
          <div key={c.label} className="bg-surface-container-lowest p-6 rounded-[1.75rem] hover:shadow-lg transition-shadow">
            <div className={`${c.bg} p-2.5 rounded-2xl w-fit mb-4`}>
              <span className={`material-symbols-outlined ${c.color} text-2xl`} style={{ fontVariationSettings:"'FILL' 1" }}>{c.icon}</span>
            </div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">{c.label}</p>
            <p className="font-headline text-4xl font-extrabold text-on-surface tracking-tighter">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Scans */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-headline text-lg font-bold text-on-surface">Recent Scans</h3>
          <Link to="/nurse/scan" className="text-primary text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity">
            New Scan <span className="material-symbols-outlined text-sm">add</span>
          </Link>
        </div>
        {recentScans.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl">biotech</span>
            <p className="text-base">No scans yet. Start a new scan!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead>
                <tr className="text-on-surface-variant text-sm border-b border-surface-variant">
                  <th className="pb-3 font-semibold">Disease Detected</th>
                  <th className="pb-3 font-semibold">Risk Score</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map(sc => {
                  const score = sc.risk_score ?? sc.confidence ?? 0;
                  const cat   = sc.risk_category || (score >= 67 ? "HIGH" : score >= 44 ? "MEDIUM" : "LOW");
                  return (
                    <tr key={sc.id} className="border-b border-surface-container-high hover:bg-surface-container-low transition-colors">
                      <td className="py-3.5 font-semibold text-on-surface">{sc.predicted_disease}</td>
                      <td className="py-3.5 text-on-surface-variant">{score.toFixed(1)}%</td>
                      <td className="py-3.5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cat === "HIGH"   ? "bg-error-container text-on-error-container" :
                          cat === "MEDIUM" ? "bg-amber-100 text-amber-800" :
                                            "bg-secondary-container/50 text-on-secondary-container"
                        }`}>{cat}</span>
                      </td>
                      <td className="py-3.5 text-on-surface-variant text-sm">{new Date(sc.created_at).toLocaleDateString()}</td>
                      <td className="py-3.5 text-right">
                        {cat === "HIGH"
                          ? <button onClick={() => navigate("/nurse/submit")} className="text-error text-sm font-semibold hover:opacity-80 flex items-center gap-1 ml-auto">
                              Escalate <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                          : <span className="text-secondary text-sm font-semibold">Auto-resolved</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "biotech",          label: "New Scan",       to: "/nurse/scan" },
          { icon: "person_add",       label: "Add Patient",    to: "/nurse/patients" },
          { icon: "assignment",       label: "Triage Queue",   to: "/nurse/triage" },
          { icon: "send",             label: "Submit Case",    to: "/nurse/submit" },
        ].map(a => (
          <Link key={a.label} to={a.to}
            className="bg-surface-container-lowest p-5 rounded-[1.5rem] flex flex-col items-center gap-3 hover:bg-primary-container/10 hover:shadow-md transition-all text-center group"
          >
            <div className="bg-primary-container/20 p-3 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl" style={{ fontVariationSettings:"'FILL' 1" }}>{a.icon}</span>
            </div>
            <p className="font-semibold text-on-surface text-sm">{a.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

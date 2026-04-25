import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getScans } from "../../services/api";

export default function PatientReports() {
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getScans().then(r => setScans(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? scans : scans.filter(s => s.risk_category === filter);

  const getRiskColor = (cat) => ({ HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#10b981" }[cat] || "#6b7280");
  const getRiskBg   = (cat) => ({ HIGH: "#fee2e2", MEDIUM: "#fef3c7", LOW: "#dcfce7" }[cat] || "#f1f5f9");
  const getRiskIcon = (cat) => ({ HIGH: "🚨", MEDIUM: "⚠️", LOW: "✅" }[cat] || "🔬");

  const layman = {
    HIGH:   "Urgent attention needed — please consult a doctor.",
    MEDIUM: "Moderate concern — schedule a follow-up visit.",
    LOW:    "Stable — continue monitoring and sun protection.",
  };

  const getStatus = (scan) => {
    if (scan.is_reviewed) return { label: "Reviewed by Doctor", color: "#16a34a", bg: "#dcfce7" };
    if (scan.is_escalated) return { label: "Referred to Doctor", color: "#d97706", bg: "#fef3c7" };
    return { label: "Pending Review", color: "#64748b", bg: "#f1f5f9" };
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={() => navigate("/patient/dashboard")} style={s.backBtn}>← Back</button>
        <div>
          <h1 style={s.title}>My Health Reports</h1>
          <p style={s.subtitle}>All past scans, AI results, and doctor feedback.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={s.filterRow}>
        {["ALL", "HIGH", "MEDIUM", "LOW"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            ...s.filterBtn,
            background: filter === f ? "#004D40" : "var(--card-bg)",
            color: filter === f ? "#fff" : "var(--text-muted)",
            borderColor: filter === f ? "#004D40" : "var(--border-color)",
          }}>
            {f === "ALL" ? `All (${scans.length})` : `${getRiskIcon(f)} ${f} (${scans.filter(s => s.risk_category === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={s.empty}>Loading your reports...</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <p style={{ fontWeight: "700", margin: "0 0 8px 0" }}>No reports yet</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px 0" }}>Complete your first skin scan to see results here.</p>
          <button onClick={() => navigate("/patient/scan")} style={s.scanBtn}>🔬 Start Your First Scan</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.map((scan, i) => {
            const status = getStatus(scan);
            return (
              <div key={scan.id || i} style={{ ...s.reportCard, borderLeft: `4px solid ${getRiskColor(scan.risk_category)}` }}>
                <div style={s.reportTop}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ fontSize: "28px" }}>{getRiskIcon(scan.risk_category)}</div>
                    <div>
                      <p style={{ fontWeight: "700", color: "var(--text-main)", margin: "0 0 2px 0", fontSize: "16px" }}>
                        {scan.predicted_disease || "Analysis Complete"}
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                        {new Date(scan.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                    <span style={{ ...s.badge, background: getRiskBg(scan.risk_category), color: getRiskColor(scan.risk_category) }}>
                      {scan.risk_category} RISK
                    </span>
                    <span style={{ ...s.badge, background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Risk bar */}
                <div style={{ margin: "12px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    <span>Risk Score</span>
                    <span style={{ fontWeight: "700" }}>{scan.risk_score?.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${scan.risk_score || 0}%`, background: getRiskColor(scan.risk_category), borderRadius: "3px" }} />
                  </div>
                </div>

                {/* Plain language explanation */}
                <div style={{ ...s.explanationBox, borderColor: getRiskColor(scan.risk_category) + "30", background: getRiskBg(scan.risk_category) + "60" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: getRiskColor(scan.risk_category), marginBottom: "4px" }}>What this means</p>
                  <p style={{ fontSize: "13px", color: "var(--text-main)", margin: 0 }}>{layman[scan.risk_category] || "Refer to your doctor for more details."}</p>
                </div>

                {/* Doctor feedback */}
                {scan.doctor_notes && (
                  <div style={s.doctorNote}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", marginBottom: "6px" }}>🩺 DOCTOR'S CLINICAL NOTE</p>
                    <p style={{ fontSize: "13px", color: "var(--text-main)", margin: 0, lineHeight: 1.6 }}>{scan.doctor_notes}</p>
                    {scan.doctor_validated_disease && scan.doctor_validated_disease !== scan.predicted_disease && (
                      <div style={{ marginTop: "8px", padding: "8px 10px", background: "#f0fdf4", borderRadius: "8px" }}>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", margin: "0 0 2px 0" }}>Confirmed Diagnosis</p>
                        <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-main)", margin: 0 }}>{scan.doctor_validated_disease}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Scan image thumbnail */}
                {scan.image && (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>SCAN IMAGE</p>
                    <img
                      src={`http://127.0.0.1:8000${scan.image}`}
                      alt="Scan"
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", border: "2px solid var(--border-color)" }}
                      onError={e => e.target.style.display = "none"}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  container: { paddingTop: "32px", maxWidth: "800px", margin: "0 auto", paddingBottom: "60px" },
  header: { marginBottom: "28px" },
  backBtn: { background: "none", border: "none", color: "var(--text-muted)", fontWeight: "600", cursor: "pointer", fontSize: "14px", padding: "0 0 12px 0", fontFamily: "'Lexend', sans-serif", display: "block" },
  title: { fontSize: "28px", fontWeight: "800", color: "var(--text-main)", margin: "0 0 4px 0", letterSpacing: "-0.5px" },
  subtitle: { fontSize: "14px", color: "var(--text-muted)", margin: 0 },
  filterRow: { display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" },
  filterBtn: { padding: "8px 16px", borderRadius: "20px", border: "2px solid", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Lexend', sans-serif" },
  empty: { color: "var(--text-muted)", textAlign: "center", padding: "48px 0" },
  emptyState: { textAlign: "center", padding: "60px 0", color: "var(--text-main)" },
  scanBtn: { background: "#004D40", color: "#fff", border: "none", borderRadius: "40px", padding: "12px 28px", fontWeight: "700", cursor: "pointer", fontSize: "14px", fontFamily: "'Lexend', sans-serif" },
  reportCard: { background: "var(--card-bg)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-sm)" },
  reportTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" },
  badge: { fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.5px" },
  explanationBox: { border: "1px solid", borderRadius: "10px", padding: "12px 14px" },
  doctorNote: { background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "14px 16px", marginTop: "12px" },
};

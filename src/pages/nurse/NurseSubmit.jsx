import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createScan, escalateScan } from "../../services/api";

export default function NurseSubmit() {
  const navigate  = useNavigate();
  const notes     = localStorage.getItem("scan_notes") || "";
  const patientId = localStorage.getItem("scan_patient") || "";
  const lastResult = JSON.parse(localStorage.getItem("lastResult") || "null");

  const [urgency,  setUrgency]  = useState("HIGH");
  const [message,  setMessage]  = useState("");
  const [status,   setStatus]   = useState("idle"); // idle | sending | sent | error
  const [extraNote, setExtraNote] = useState("");

  const disease  = lastResult?.predicted_disease ?? "Unknown";
  const score    = lastResult?.risk_score ?? lastResult?.confidence ?? 0;
  const category = lastResult?.risk_category ?? "HIGH";

  const handleSubmit = async () => {
    setStatus("sending");
    setMessage("");
    try {
      // Try lastResult first, then fall back to most recent scan from localStorage
      const scanId = lastResult?.id;
      if (!scanId) {
        setMessage("No scan found to escalate. Please complete a scan first.");
        setStatus("error");
        return;
      }
      
      const combinedNote = [notes, extraNote.trim() ? `Nurse message: ${extraNote.trim()}` : ""].filter(Boolean).join(" | ");
      await escalateScan(scanId, { notes: combinedNote, urgency });
      
      localStorage.setItem("escalated_case", JSON.stringify({
        patientId, disease, score, category, notes: combinedNote, urgency, timestamp: new Date().toISOString()
      }));
      
      setStatus("sent");
    } catch (err) {
      console.error("Escalation failed:", err);
      const detail = err?.response?.data?.detail || err?.response?.statusText || err?.message || "Unknown error";
      setMessage(`Failed to submit: ${detail}`);
      setStatus("error");
    }
  };

  if (status === "sent") return (
    <div className="pt-24 px-6 md:px-10 pb-12 max-w-2xl mx-auto w-full flex flex-col items-center justify-center gap-6 text-center fade-in" style={{ minHeight: "70vh" }}>
      <div className="bg-primary-container/30 p-7 rounded-full">
        <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings:"'FILL' 1" }}>check_circle</span>
      </div>
      <div>
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Case Submitted!</h2>
        <p className="text-on-surface-variant text-base leading-relaxed">
          This case has been escalated to the doctor dashboard.<br />
          The doctor will review and respond shortly.
        </p>
      </div>
      <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 w-full text-left">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary">biotech</span>
          <span className="font-semibold text-on-surface text-base">{disease}</span>
        </div>
        <p className="text-on-surface-variant text-sm">Risk: <strong className="text-error">{score.toFixed(1)}%</strong> · Urgency: <strong>{urgency}</strong></p>
        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{notes}</p>
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={() => navigate("/nurse/scan")} className="flex-1 bg-primary text-white font-semibold py-3.5 rounded-full hover:opacity-90 transition-all text-base">
          New Scan
        </button>
        <button onClick={() => navigate("/nurse/dashboard")} className="flex-1 border-2 border-surface-variant text-on-surface-variant font-semibold py-3.5 rounded-full hover:border-primary hover:text-primary transition-all text-base">
          Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-8 px-6 md:px-10 pb-12 max-w-2xl mx-auto w-full flex flex-col gap-7 fade-in">
      <div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-sm font-semibold mb-4 transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <h2 className="font-headline text-3xl font-bold text-on-surface">Submit Case to Doctor</h2>
        <p className="text-on-surface-variant text-base mt-1">Review details and send to the doctor's dashboard.</p>
      </div>

      {/* Case Summary */}
      <div className="bg-error-container/20 border-2 border-error rounded-[1.5rem] p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings:"'FILL' 1" }}>emergency</span>
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface">{disease}</h3>
            <p className="text-on-surface-variant text-sm">Risk: <strong className="text-error">{score.toFixed(1)}%</strong> · Category: <strong className="text-error">{category}</strong></p>
          </div>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed">{notes}</p>
      </div>

      {/* Urgency */}
      <div className="bg-surface-container-lowest rounded-[1.5rem] p-6">
        <h3 className="font-headline text-base font-semibold text-on-surface mb-4">Urgency Level</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "CRITICAL", label: "🔴 Critical",   desc: "Immediate" },
            { key: "HIGH",     label: "🟠 High",       desc: "< 2 hours" },
            { key: "MEDIUM",   label: "🟡 Medium",     desc: "Today"     },
          ].map(u => (
            <button key={u.key} onClick={() => setUrgency(u.key)}
              className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                urgency === u.key ? "border-primary bg-primary text-white" : "border-surface-variant text-on-surface-variant hover:border-primary"
              }`}>
              <p className="font-semibold text-sm">{u.label}</p>
              <p className={`text-xs mt-0.5 ${urgency === u.key ? "text-white/80" : "text-on-surface-variant"}`}>{u.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Extra message */}
      <div className="bg-surface-container-lowest rounded-[1.5rem] p-6">
        <h3 className="font-headline text-base font-semibold text-on-surface mb-3">Message to Doctor (optional)</h3>
        <textarea rows={3} value={extraNote} onChange={e => setExtraNote(e.target.value)}
          placeholder="Any additional context for the doctor..."
          className="w-full p-4 rounded-xl border border-surface-variant bg-surface-container-low text-on-surface text-base focus:outline-none focus:border-primary resize-none" />
      </div>

      {status === "error" && (
        <p className="text-error text-base font-semibold text-center">
          {message || "Failed to submit. Please try again."}
        </p>
      )}

      <button onClick={handleSubmit} disabled={status === "sending"}
        className="w-full bg-error text-white font-headline font-bold py-4 rounded-full text-base shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
        <span className="material-symbols-outlined" style={{ fontVariationSettings:"'FILL' 1" }}>send</span>
        {status === "sending" ? "Sending..." : "Escalate to Doctor Dashboard"}
      </button>
    </div>
  );
}

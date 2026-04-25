import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AI_SCRIPT = [
  { from: "ai", text: "Hello! I'm GenVeda AI 👋 I'm here to help you understand your skin health. What's bothering you today?" },
];

const QUICK_REPLIES = [
  "I have a mole that changed colour",
  "My skin is itching a lot",
  "I noticed a new growth on my skin",
  "I want to know about my scan results",
  "What is ABCDE in dermatology?",
];

const AI_RESPONSES = {
  default: "I understand. Can you describe the affected area a bit more? For example — where on your body is it, and when did you first notice it?",
  mole: "Changes in mole colour can be significant. The ABCDE rule helps — look for Asymmetry, irregular Border, multiple Colours, Diameter over 6mm, or Evolution (change). Would you like to upload an image for AI analysis? 📷",
  itch: "Persistent itching on a lesion can be a symptom called Pruritus. It's worth examining. Have you noticed any redness, swelling, or discharge around the area?",
  growth: "A new growth should be monitored carefully. When did you first notice it? Is it raised or flat? I recommend uploading a scan image so our AI can analyse it.",
  results: "You can view all your past scan results and doctor feedback in the Reports section. Would you like me to take you there?",
  abcde: "The ABCDE rule is a simple guide for checking moles:\n\n🔴 A — Asymmetry: One half doesn't match the other\n🔴 B — Border: Irregular or ragged edges\n🔴 C — Colour: Multiple colours or uneven colouring\n🔴 D — Diameter: Larger than 6mm (pencil eraser size)\n🔴 E — Evolution: Any change in size, shape, or colour\n\nIf you notice any of these, please scan the area!",
  scan: "To start a scan, just tap the 🔬 Scan button below. I'll guide you through uploading an image and entering your symptoms.",
};

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes("mole") || m.includes("colour") || m.includes("color") || m.includes("pigment")) return AI_RESPONSES.mole;
  if (m.includes("itch") || m.includes("pruritus")) return AI_RESPONSES.itch;
  if (m.includes("growth") || m.includes("lump") || m.includes("bump")) return AI_RESPONSES.growth;
  if (m.includes("result") || m.includes("report") || m.includes("scan result")) return AI_RESPONSES.results;
  if (m.includes("abcde") || m.includes("rule")) return AI_RESPONSES.abcde;
  if (m.includes("scan") || m.includes("upload") || m.includes("analyse")) return AI_RESPONSES.scan;
  return AI_RESPONSES.default;
}

export default function PatientChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(AI_SCRIPT);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = getAIResponse(text);
      setMessages(prev => [...prev, { from: "ai", text: reply }]);
      setIsTyping(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 900 + Math.random() * 600);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <button onClick={() => navigate("/patient/dashboard")} style={s.backBtn}>←</button>
        <div style={s.avatar}>🤖</div>
        <div>
          <p style={{ fontWeight: "700", color: "var(--text-main)", margin: 0 }}>GenVeda AI Assistant</p>
          <p style={{ fontSize: "12px", color: "#16a34a", margin: 0, fontWeight: "600" }}>● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div style={s.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
            {msg.from === "ai" && <div style={s.aiAvatar}>🤖</div>}
            <div style={{
              maxWidth: "75%", padding: "12px 16px", borderRadius: msg.from === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              background: msg.from === "user" ? "#004D40" : "var(--card-bg)",
              color: msg.from === "user" ? "#fff" : "var(--text-main)",
              fontSize: "14px", lineHeight: 1.6, boxShadow: "var(--shadow-sm)",
              whiteSpace: "pre-wrap",
            }}>
              {msg.text}
              {msg.from === "ai" && msg.text.includes("upload") && (
                <button onClick={() => navigate("/patient/scan")} style={s.inlineBtn}>🔬 Start Scan</button>
              )}
              {msg.from === "ai" && msg.text.includes("Reports section") && (
                <button onClick={() => navigate("/patient/reports")} style={s.inlineBtn}>📋 View Reports</button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={s.aiAvatar}>🤖</div>
            <div style={{ ...s.typingBubble }}>
              <span style={s.dot} /><span style={{ ...s.dot, animationDelay: "0.2s" }} /><span style={{ ...s.dot, animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {messages.length <= 2 && (
        <div style={s.quickReplies}>
          {QUICK_REPLIES.map(r => (
            <button key={r} onClick={() => sendMessage(r)} style={s.quickBtn}>{r}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={s.inputRow}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          placeholder="Type your symptoms or question..."
          style={s.input}
        />
        <button onClick={() => sendMessage(input)} disabled={!input.trim()} style={s.sendBtn}>➤</button>
      </div>
    </div>
  );
}

const s = {
  container: { display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", maxWidth: "700px", margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: "12px", padding: "16px 0 12px", borderBottom: "1px solid var(--border-color)", flexShrink: 0 },
  backBtn: { background: "none", border: "none", color: "var(--text-muted)", fontSize: "20px", cursor: "pointer", padding: "0 8px 0 0" },
  avatar: { width: "40px", height: "40px", background: "#e0f2f1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  messages: { flex: 1, overflowY: "auto", padding: "20px 0", display: "flex", flexDirection: "column" },
  aiAvatar: { width: "30px", height: "30px", background: "#e0f2f1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, marginRight: "8px", alignSelf: "flex-end" },
  typingBubble: { background: "var(--card-bg)", borderRadius: "20px", padding: "14px 18px", display: "flex", gap: "5px", alignItems: "center" },
  dot: { width: "7px", height: "7px", background: "var(--text-muted)", borderRadius: "50%", display: "inline-block", animation: "pulse 1.2s infinite" },
  inlineBtn: { display: "block", marginTop: "10px", background: "#004D40", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Lexend', sans-serif", width: "100%" },
  quickReplies: { display: "flex", flexWrap: "wrap", gap: "8px", padding: "12px 0", flexShrink: 0 },
  quickBtn: { background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "20px", padding: "8px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: "var(--text-main)", fontFamily: "'Lexend', sans-serif" },
  inputRow: { display: "flex", gap: "8px", padding: "12px 0 8px", borderTop: "1px solid var(--border-color)", flexShrink: 0 },
  input: { flex: 1, padding: "12px 16px", borderRadius: "40px", border: "2px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-main)", fontSize: "14px", outline: "none", fontFamily: "'Lexend', sans-serif" },
  sendBtn: { width: "44px", height: "44px", borderRadius: "50%", background: "#004D40", color: "#fff", border: "none", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
};

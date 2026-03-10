import { useState } from "react";

export default function SummarizeForm() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: "32px", width: "100%", maxWidth: "800px", textAlign: "left" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}>📝 Resumidor de Texto</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>Pega tus apuntes o párrafos largos para obtener un resumen estructurado.</p>

      <textarea
        rows="8"
        style={{ width: "100%", marginBottom: "20px", resize: "none" }}
        placeholder="Pega tus notas aquí..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={summarize}
        disabled={loading || !text}
        style={{
          background: "white",
          color: "black",
          border: "none",
          padding: "12px 28px",
          borderRadius: "12px",
          fontWeight: "600",
          width: "100%",
          display: "block"
        }}
      >
        {loading ? "Procesando..." : "Resumir Notas"}
      </button>

      {summary && (
        <div style={{ marginTop: "32px", padding: "24px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "var(--primary)" }}>Resumen Generado:</h3>
          <p style={{ whiteSpace: "pre-wrap", color: "var(--text-main)" }}>{summary}</p>
        </div>
      )}
    </div>
  );
}
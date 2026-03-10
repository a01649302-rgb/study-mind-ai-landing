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
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>📝 Resumidor de Texto</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Pega notas sueltas, artículos o párrafos para obtener un análisis rápido.</p>

      <textarea
        rows="8"
        style={{
          width: "100%",
          marginBottom: "24px",
          resize: "none",
          padding: '20px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          color: 'white',
          fontSize: '16px'
        }}
        placeholder="Escribe o pega tus apuntes aquí..."
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
          padding: "16px 28px",
          borderRadius: "12px",
          fontWeight: "700",
          width: "100%",
          fontSize: '16px',
          transition: 'all 0.2s ease'
        }}
      >
        {loading ? "Analizando..." : "Generar Resumen"}
      </button>

      {summary && (
        <div style={{ marginTop: "32px", animation: "fadeIn 0.5s ease" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "var(--primary)" }}>Resumen AI:</h3>
          <div style={{
            padding: "24px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "16px",
            border: "1px solid var(--card-border)",
            lineHeight: '1.7',
            color: '#cbd5e1'
          }}>
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
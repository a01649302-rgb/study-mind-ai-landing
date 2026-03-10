// components/PDFUploader.jsx
import { useState } from "react";

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flashcard-container ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="category-badge">Pregunta</span>
          <p style={{ fontWeight: "600", fontSize: "18px" }}>{question}</p>
          <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--text-muted)" }}>Haz click para ver la respuesta</p>
        </div>
        <div className="flashcard-back">
          <span className="category-badge" style={{ background: "#10b981" }}>Respuesta</span>
          <p style={{ fontSize: "16px" }}>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function PDFUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const uploadPDF = async () => {
    if (!file) return setError("Selecciona un archivo PDF primero.");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        body: file,
        headers: { "Content-Type": "application/pdf" }
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Error procesando PDF");
      }
    } catch (err) {
      console.error(err);
      setError("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: "32px", width: "100%", maxWidth: "800px", textAlign: "left" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}>📂 Subir PDF</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Carga tus archivos PDF para extraer resúmenes y flashcards interactivas.</p>

      <div style={{
        border: "2px dashed var(--card-border)",
        borderRadius: "16px",
        padding: "40px",
        textAlign: "center",
        marginBottom: "24px",
        background: file ? "rgba(99, 102, 241, 0.05)" : "transparent",
        transition: "all 0.3s ease"
      }}>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        <label htmlFor="pdf-upload" style={{ cursor: "pointer", display: "block" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>{file ? "📄" : "☁️"}</div>
          <p style={{ fontWeight: "600", fontSize: "18px" }}>{file ? file.name : "Soltar PDF o hacer clic"}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>Máximo 10MB</p>
        </label>
      </div>

      <button
        onClick={uploadPDF}
        disabled={loading || !file}
        style={{
          background: "var(--primary)",
          color: "white",
          border: "none",
          padding: "16px 28px",
          borderRadius: "12px",
          fontWeight: "700",
          width: "100%",
          fontSize: "16px",
          boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)"
        }}
      >
        {loading ? "Procesando con Magia AI..." : "Generar Estudio Inteligente"}
      </button>

      {error && <p style={{ color: "#ef4444", marginTop: "16px", textAlign: "center", fontWeight: "500" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "40px", animation: "fadeIn 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700" }}>🎯 Resumen Consolidado</h3>
            <button style={{ background: "transparent", border: "1px solid var(--card-border)", color: "white", padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}>
              Copiar Resumen
            </button>
          </div>
          <p style={{
            background: "rgba(255,255,255,0.03)",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid var(--card-border)",
            lineHeight: "1.7",
            color: "#e2e8f0",
            marginBottom: "40px"
          }}>
            {result.summary}
          </p>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>🗂️ Flashcards de Estudio</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {Array.isArray(result.flashcards) && result.flashcards.length > 0 ? (
              result.flashcards.map((card, i) => (
                <Flashcard key={i} question={card.question} answer={card.answer} />
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", gridColumn: "span 2" }}>No se detectaron conceptos para flashcards.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
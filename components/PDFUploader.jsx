// components/PDFUploader.jsx
import { useState } from "react";

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
        body: file, // Enviamos el archivo directamente como buffer binario
        headers: {
          "Content-Type": "application/pdf"
        }
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
        background: file ? "rgba(99, 102, 241, 0.05)" : "transparent"
      }}>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        <label htmlFor="pdf-upload" style={{ cursor: "pointer" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>{file ? "📄" : "☁️"}</div>
          <p style={{ fontWeight: "500" }}>{file ? file.name : "Hacer click para seleccionar PDF"}</p>
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={uploadPDF}
          disabled={loading || !file}
          style={{
            background: "var(--primary)",
            color: "white",
            border: "none",
            padding: "12px 28px",
            borderRadius: "12px",
            fontWeight: "600",
            flex: 1
          }}
        >
          {loading ? "Procesando con AI..." : "Generar Resumen & Flashcards"}
        </button>
      </div>
      {error && <p style={{ color: "#ef4444", marginTop: "12px", fontSize: "14px" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "32px", animation: "fadeIn 0.5s ease" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Resumen</h3>
          <p style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px", border: "1px solid var(--card-border)", marginBottom: "24px" }}>
            {result.summary}
          </p>

          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Flashcards</h3>
          <div style={{ display: "grid", gap: "16px" }}>
            {Array.isArray(result.flashcards) && result.flashcards.length > 0 ? (
              result.flashcards.map((card, i) => (
                <div key={i} className="glass-card" style={{ padding: "16px", background: "rgba(255,255,255,0.02)" }}>
                  <p style={{ fontWeight: "600", color: "var(--primary)", fontSize: "14px", textTransform: "uppercase", marginBottom: "4px" }}>Pregunta</p>
                  <p style={{ fontWeight: "500", marginBottom: "12px" }}>{card.question}</p>
                  <p style={{ fontWeight: "600", color: "#10b981", fontSize: "14px", textTransform: "uppercase", marginBottom: "4px" }}>Respuesta</p>
                  <p style={{ color: "var(--text-muted)" }}>{card.answer}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No se detectaron flashcards.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
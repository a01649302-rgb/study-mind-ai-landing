import { useState } from "react";
import Head from "next/head";
import SummarizeForm from "../components/SummarizeForm";
import PDFUploader from "../components/PDFUploader";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("¡Estás en la lista de espera! 🚀");
        setEmail("");
      } else {
        setMessage("Error al guardar email. Intenta de nuevo.");
      }
    } catch (error) {
      setMessage("Error del servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen">
      <Head>
        <title>StudyMind AI | Tu asistente de estudio inteligente</title>
        <meta name="description" content="Resume apuntes, genera flashcards y estudia mejor con Inteligencia Artificial." />
      </Head>

      <nav style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-1px" }}>
          Study<span style={{ color: "var(--primary)" }}>Mind</span> AI
        </div>
      </nav>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>

        {/* Hero Section */}
        <section className="animate-fade-in" style={{ marginBottom: "80px" }}>
          <h1 className="gradient-text" style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px" }}>
            El asistente que <br /> estudia por ti.
          </h1>
          <p style={{ fontSize: "20px", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 40px" }}>
            Carga tus apuntes en PDF, resume textos largos y genera flashcards automáticamente con el poder de GPT-4o.
          </p>

          <form onSubmit={subscribe} style={{ display: "flex", gap: "10px", justifyContent: "center", maxWidth: "450px", margin: "0 auto" }}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: "600"
              }}
            >
              {loading ? "..." : "Unirme"}
            </button>
          </form>
          {message && <p style={{ marginTop: "16px", color: "var(--primary)", fontWeight: "500" }}>{message}</p>}
        </section>

        {/* Tools Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px", alignItems: "center" }}>
          <PDFUploader />
          <SummarizeForm />
        </div>

      </main>

      <footer style={{ padding: "80px 20px", textAlign: "center", borderTop: "1px solid var(--card-border)", marginTop: "100px", color: "var(--text-muted)" }}>
        <p>© 2026 StudyMind AI. Hecho para estudiantes inteligentes.</p>
      </footer>

      <style jsx global>{`
        .min-h-screen { min-height: 100vh; }
      `}</style>
    </div>
  );
}
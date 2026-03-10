import { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
import SummarizeForm from "../components/SummarizeForm";
import PDFUploader from "../components/PDFUploader";
import Auth from "../components/Auth";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return (
    <div className="gradient-bg min-h-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '20px', fontWeight: '600' }}>Cargando StudyMind...</p>
    </div>
  );

  return (
    <div className="gradient-bg min-h-screen">
      <Head>
        <title>StudyMind AI | Inteligencia Artificial para Estudiantes</title>
        <meta name="description" content="Resume apuntes, genera flashcards y estudia mejor con Inteligencia Artificial." />
      </Head>

      <nav style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-1px" }}>
          Study<span style={{ color: "var(--primary)" }}>Mind</span> AI
        </div>
        {session && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{session.user.email}</span>
            <button
              onClick={handleLogout}
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px' }}
            >
              Salir
            </button>
          </div>
        )}
      </nav>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>

        {!session ? (
          <div className="animate-fade-in" style={{ padding: '40px 0' }}>
            <h1 className="gradient-text" style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "800", lineHeight: "1.2", marginBottom: "40px" }}>
              Tu conocimiento, <br /> potanciado por AI.
            </h1>
            <Auth />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "60px", alignItems: "center" }}>

            <section className="animate-fade-in" style={{ width: '100%', textAlign: 'left' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>¡Hola de nuevo! 👋</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>¿Qué vamos a estudiar hoy?</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "40px", alignItems: "center" }}>
                <PDFUploader />
                <SummarizeForm />
              </div>
            </section>

          </div>
        )}

      </main>

      <footer style={{ padding: "80px 20px", textAlign: "center", borderTop: "1px solid var(--card-border)", marginTop: "100px", color: "var(--text-muted)" }}>
        <p>© 2026 StudyMind AI. Diseñado para la excelencia académica.</p>
      </footer>

      <style jsx global>{`
        .min-h-screen { min-height: 100vh; }
      `}</style>
    </div>
  );
}
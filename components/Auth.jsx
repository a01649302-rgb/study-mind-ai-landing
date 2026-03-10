import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('¡Registro exitoso! Revisa tu email para confirmar.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card animate-fade-in" style={{ padding: '40px', maxWidth: '400px', width: '100%', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', textAlign: 'center' }}>
                {isSignUp ? 'Crear Cuenta' : 'Bienvenido'}
            </h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>
                {isSignUp ? 'Únete a la nueva era del estudio.' : 'Ingresa para acceder a tus apuntes.'}
            </p>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                    type="email"
                    placeholder="Tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    disabled={loading}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        marginTop: '8px'
                    }}
                >
                    {loading ? 'Procesando...' : isSignUp ? 'Registrarse' : 'Entrar'}
                </button>
            </form>

            {message && <p style={{ marginTop: '16px', textAlign: 'center', color: 'var(--primary)', fontSize: '14px' }}>{message}</p>}

            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'} {' '}
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', padding: 0 }}
                >
                    {isSignUp ? 'Inicia sesión' : 'Regístrate aquí'}
                </button>
            </p>
        </div>
    );
}

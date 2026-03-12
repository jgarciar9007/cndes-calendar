import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)', width: '100%', padding: '1rem' }}>
            <div className="card flex" style={{ width: '100%', maxWidth: '800px', overflow: 'hidden', padding: 0 }}>
                {/* Left Side: Form */}
                <div style={{ flex: 1, padding: '3rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 700 }}>Iniciar Sesión</h2>
                    <p style={{ textAlign: 'center', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                        Sistema de Agenda CNDES
                    </p>

                    {error && (
                        <div style={{
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Usuario</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Contraseña</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Entrar
                        </button>
                    </form>
                </div>

                {/* Right Side: Logo/Branding */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#f0fdf4', // Light green tint
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: '1px solid var(--color-border)'
                }}>
                    <img
                        src={logo}
                        alt="Logo CNDES"
                        style={{ width: '80%', maxWidth: '250px', objectFit: 'contain' }}
                    />
                </div>
            </div>
        </div>
    );
};
export default Login;

import React, { useState } from 'react';
import { X, Lock, Save, User, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfileModal = ({ onClose }) => {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_BASE = '/api';

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!currentPassword) {
            setError('Por favor ingrese su contraseña actual');
            return;
        }

        setLoading(true);

        try {
            // Note: We send currentPassword to backend for verification (even if rudimentary)
            const response = await fetch(`${API_BASE}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username || 'admin',
                    newPassword: newPassword,
                    currentPassword: currentPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Contraseña actualizada correctamente');
                setNewPassword('');
                setConfirmPassword('');
                setCurrentPassword('');
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError(data.error || 'Error al cambiar la contraseña');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="modal-backdrop" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.65)', // Darker Slate overlay with blur
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div className="modal-content card" style={{
                width: '100%',
                maxWidth: '500px', // Slightly wider for better breathing room
                backgroundColor: 'var(--color-surface)',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header with Brand Color Top Bar */}
                <div style={{
                    position: 'relative',
                    padding: '1.5rem',
                    paddingBottom: '2rem',
                    backgroundColor: 'var(--color-bg)',
                    borderBottom: '1px solid var(--color-border)'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            padding: '0.5rem',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-light)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        {/* Avatar */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, #334155 100%)', // Slate Gradient
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 700,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: '4px solid var(--color-surface)'
                        }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                                {user.name}
                            </h3>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                marginTop: '0.25rem',
                                padding: '0.25rem 0.75rem',
                                backgroundColor: 'rgba(217, 119, 6, 0.1)', // Amber tint
                                color: 'var(--color-secondary)',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.025em'
                            }}>
                                <ShieldCheck size={12} />
                                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '2rem' }}>
                    <form onSubmit={handleChangePassword}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-heading)' }}>
                            <KeyRound size={20} className="text-amber-600" style={{ color: 'var(--color-secondary)' }} />
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Seguridad</h4>
                        </div>

                        {error && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                backgroundColor: '#fef2f2',
                                borderLeft: '4px solid var(--color-error)',
                                color: '#b91c1c',
                                borderRadius: '0.25rem',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                backgroundColor: '#f0fdf4',
                                borderLeft: '4px solid var(--color-success)',
                                color: '#15803d',
                                borderRadius: '0.25rem',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>
                                {success}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Current Password Field */}
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                    Contraseña Actual
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }}>
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="Ingrese su contraseña actual"
                                    />
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />

                            {/* New Password Fields */}
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                    Nueva Contraseña
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }}>
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                    Confirmar Nueva Contraseña
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }}>
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="Repita la nueva contraseña"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{
                                    minWidth: '120px',
                                    backgroundColor: 'var(--color-primary)', // Ensure consistent branding
                                }}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '14px',
                                            height: '14px',
                                            border: '2px solid white',
                                            borderTopColor: 'transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        Procesando...
                                    </span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* CSS Animation via style tag since we can't easily add global CSS right now */}
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default UserProfileModal;

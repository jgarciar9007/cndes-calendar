import React, { useState } from 'react';
import { X, Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfileModal = ({ onClose }) => {
    const { user, logout } = useAuth();
    // Assuming simple implementation where we just ask for new password
    // In a real app we'd ask for old password too for verification
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_BASE = '/api';

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username || 'admin', // Fallback for legacy localstorage
                    newPassword: password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Contraseña actualizada correctamente');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    onClose();
                }, 1500);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden" style={{ backgroundColor: '#fff', borderRadius: '0.5rem', width: '100%', maxWidth: '28rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 className="text-lg font-semibold text-gray-800" style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>Perfil de Usuario</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700" style={{ color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6" style={{ padding: '1.5rem' }}>
                    <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold" style={{ width: '4rem', height: '4rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                                {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg" style={{ fontWeight: 600, fontSize: '1.125rem' }}>{user.name}</h4>
                                <p className="text-sm text-gray-500" style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleChangePassword}>
                        <h5 className="text-sm font-semibold uppercase text-gray-500 mb-3" style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.75rem' }}>Cambiar Contraseña</h5>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                                {success}
                            </div>
                        )}

                        <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Nueva Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                        <Lock size={16} className="text-gray-400" color="#9ca3af" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        style={{ display: 'block', width: '100%', paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                                        placeholder="Min. 6 caracteres"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Confirmar Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                        <Lock size={16} className="text-gray-400" color="#9ca3af" />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        style={{ display: 'block', width: '100%', paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                                        placeholder="Repetir contraseña"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', border: '1px solid transparent', fontSize: '0.875rem', fontWeight: 500, borderRadius: '0.375rem', color: '#fff', backgroundColor: '#2563eb', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Guardando...' : (
                                    <>
                                        <Save size={16} className="mr-2" style={{ marginRight: '0.5rem' }} />
                                        Guardar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;

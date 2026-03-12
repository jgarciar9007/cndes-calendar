import React, { useState } from 'react';
import { X, Lock, Save, User, KeyRound, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40 animate-fadeIn" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden animate-zoomIn flex flex-col">
                
                {/* Profile Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-8 flex flex-col items-center gap-6 relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-white hover:text-red-500 transition-all active:scale-90"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>

                    <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-primary-600 text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-primary-600/30 transform group-hover:rotate-6 transition-transform">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 text-white rounded-xl border-4 border-slate-50 flex items-center justify-center shadow-lg">
                            <ShieldCheck size={14} strokeWidth={3} />
                        </div>
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Perfi Institucional • {user.role}</p>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-8 lg:p-10">
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div className="flex items-center gap-2 text-primary-600 mb-2">
                            <KeyRound size={18} strokeWidth={2.5} />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Actualizar Seguridad</span>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 animate-slideUp">
                                <AlertCircle className="text-red-500 shrink-0" size={18} strokeWidth={2.5} />
                                <span className="text-[11px] font-black text-red-700 uppercase tracking-tight">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center gap-3 animate-slideUp">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={18} strokeWidth={2.5} />
                                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-tight">{success}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Inputs */}
                            {[
                                { label: 'Contraseña Actual', value: currentPassword, setter: setCurrentPassword, icon: <Lock size={18} /> },
                                { label: 'Nueva Contraseña', value: newPassword, setter: setNewPassword, icon: <KeyRound size={18} /> },
                                { label: 'Confirmar Contraseña', value: confirmPassword, setter: setConfirmPassword, icon: <KeyRound size={18} /> }
                            ].map((field, idx) => (
                                <div key={idx} className="group relative">
                                    <label className="absolute -top-2 left-4 bg-white px-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest z-10 group-focus-within:text-primary-600 transition-colors">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                                            {field.icon}
                                        </div>
                                        <input
                                            type="password"
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                            className="w-full h-14 pl-12 pr-6 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-[13px] font-bold text-slate-900 outline-none transition-all placeholder:text-slate-200"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    {idx === 0 && <div className="h-px bg-slate-100 my-4" />}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all active:scale-95"
                            >
                                Ignorar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-primary-600 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/20 hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                <span>Guardar Cambios</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;

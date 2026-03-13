import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
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
            setError('Las credenciales proporcionadas no son válidas.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 animate-fadeIn bg-slate-50/50">
            <div className="w-full max-w-[450px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden transition-all p-8 md:p-12">
                
                {/* Logo and Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="h-16 w-auto mb-8">
                        <img
                            src={logo}
                            alt="Logo CNDES"
                            className="h-full w-auto object-contain transition-transform hover:scale-105"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Iniciar Sesión</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acceso Seguro al Portal</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-3 animate-in shake">
                        <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} strokeWidth={2.5} />
                        <p className="text-xs font-black text-red-700 leading-relaxed uppercase tracking-tight">
                            {error}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="group relative">
                        <label className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] z-10 group-focus-within:text-primary-600 transition-colors">
                            Nombre de Usuario
                        </label>
                        <div className="relative">
                            <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                            <input
                                type="text"
                                className="w-full h-14 pl-14 pr-6 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-200"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="group relative">
                        <label className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] z-10 group-focus-within:text-primary-600 transition-colors">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                            <input
                                type="password"
                                className="w-full h-14 pl-14 pr-6 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full h-14 mt-4 bg-primary-600 text-white rounded-[1.25rem] text-sm font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_-10px_rgba(22,163,74,0.3)] hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn"
                    >
                        <span>Acceder al Portal</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                         Protocolo SSL Activo <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    </p>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} CNDES • Seguridad Institucional
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

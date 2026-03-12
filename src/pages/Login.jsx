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
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden ring-1 ring-slate-900/5 transition-all">
                
                {/* Visual Branding Section */}
                <div className="flex-1 bg-slate-900 p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] -ml-40 -mb-40"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/5 mb-8">
                            <Sparkles size={12} className="text-primary-400" />
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Portal Institucional</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight mb-4">
                            Sincroniza tu <br />
                            <span className="text-primary-400">Agenda Oficial</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-bold leading-relaxed max-w-xs">
                            Accede al sistema centralizado de gestión de actividades y convocatorias del CNDES.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col gap-6 pt-12">
                        <div className="h-20 w-auto flex items-start">
                            <img
                                src={logo}
                                alt="Logo CNDES"
                                className="h-full w-auto object-contain brightness-0 invert opacity-90 transition-transform group-hover:scale-105"
                            />
                        </div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">
                            © {new Date().getFullYear()} CNDES • Seguridad de Grado Estatal
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 p-12 lg:p-16 bg-white flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Iniciar Sesión</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Credenciales Autorizadas</p>
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
                                    className="w-full h-16 pl-14 pr-6 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-200"
                                    placeholder="ej. j.garcia"
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
                                    className="w-full h-16 pl-14 pr-6 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full h-16 mt-6 bg-primary-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-[0.25em] shadow-[0_20px_50px_-10px_rgba(22,163,74,0.3)] hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn"
                        >
                            <span>Acceder al Portal</span>
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                             Protocolo SSL Activo <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

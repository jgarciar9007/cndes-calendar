import React, { useState } from 'react';
import { User, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCalendar } from '../../context/CalendarContext';
import UserProfileModal from './UserProfileModal';
import logo from '../../assets/logo.png';

const Header = () => {
    const { user, logout } = useAuth();
    const { setView, setCurrentDate } = useCalendar();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogoClick = (e) => {
        e.preventDefault();
        setView('week');
        setCurrentDate(new Date());
        navigate('/');
    };

    const formattedDate = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const dateStr = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <header className="sticky top-0 z-[100] w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-300">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Brand Section */}
                    <a 
                        href="/" 
                        onClick={handleLogoClick} 
                        className="flex items-center gap-5 group transition-all"
                    >
                        <div className="h-12 w-auto flex items-center justify-center p-1 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                            <img src={logo} alt="Logo CNDES" className="h-full w-auto object-contain" />
                        </div>
                        <div className="flex flex-col border-l border-slate-200 pl-5">
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-primary-600 transition-colors">
                                Agenda CNDES
                            </h1>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary-600 rounded-full animate-pulse"></span>
                                {dateStr}
                            </span>
                        </div>
                    </a>

                    {/* Navigation Menu */}
                    <nav className="hidden lg:flex items-center gap-2 p-1 bg-slate-100 rounded-[1.25rem] border border-slate-200/50">
                        <Link 
                            to="/" 
                            className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                location.pathname === '/' 
                                ? 'bg-white text-primary-600 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                            }`}
                        >
                            Calendario
                        </Link>
                        <Link 
                            to="/reports" 
                            className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                location.pathname === '/reports' 
                                ? 'bg-white text-primary-600 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                            }`}
                        >
                            Informes
                        </Link>
                    </nav>

                    {/* Navigation/User Section */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {user.role === 'admin' && (
                                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                                        <ShieldCheck size={14} strokeWidth={2.5} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                                    </div>
                                )}
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-3 pl-4 pr-2 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-2xl transition-all group"
                                    >
                                        <div className="flex flex-col items-end hidden sm:flex">
                                            <span className="text-[11px] font-black text-slate-900 leading-none">{user.name}</span>
                                            <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px] mt-0.5">{user.email}</span>
                                        </div>
                                        <div className="w-9 h-9 flex items-center justify-center bg-white text-primary-600 border border-slate-200 shadow-sm rounded-xl font-black text-xs uppercase group-hover:ring-2 group-hover:ring-primary-600/20 transition-all">
                                            {user.name.charAt(0)}
                                        </div>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Modern User Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                                            <div className="absolute right-0 top-[calc(100%+12px)] w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-20 animate-zoomIn ring-1 ring-slate-900/5">
                                                <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tu Cuenta</p>
                                                    <p className="text-xs font-black text-slate-800 truncate">{user.name}</p>
                                                </div>
                                                <div className="p-2">
                                                    <button 
                                                        onClick={() => { setIsProfileOpen(true); setIsUserMenuOpen(false); }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group/item"
                                                    >
                                                        <div className="p-1.5 bg-slate-100 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                                                            <User size={14} strokeWidth={2.5} />
                                                        </div>
                                                        Perfil Institucional
                                                    </button>
                                                    <button 
                                                        onClick={logout}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-all group/out"
                                                    >
                                                        <div className="p-1.5 bg-red-100 group-hover/out:bg-red-200 rounded-lg transition-colors">
                                                            <LogOut size={14} strokeWidth={2.5} />
                                                        </div>
                                                        Finalizar Sesión
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className="px-6 py-2.5 bg-primary-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/20 active:scale-95 transition-all"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            {isProfileOpen && <UserProfileModal onClose={() => setIsProfileOpen(false)} />}
        </header>
    );
};

export default Header;

import React from 'react';
import Header from './Header';
import logo from '../../assets/logo.png';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-x-hidden">
            {/* Elegant Background Watermark */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03] select-none">
                <img 
                    src={logo} 
                    alt="" 
                    className="w-[800px] h-[800px] object-contain grayscale"
                />
            </div>

            <Header />
            
            <main className="flex-1 relative z-10">
                <div className="max-w-[1700px] mx-auto sm:px-4 lg:px-6">
                    {children}
                </div>
            </main>

            <footer className="relative z-10 py-12 px-6 border-t border-slate-200/60 bg-white mt-12">
                <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="CNDES" className="w-8 h-8 object-contain opacity-40 grayscale" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">CNDES Agenda Oficial</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                        @2026 Departamento de Informática CNDES
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

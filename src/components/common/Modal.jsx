import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-blur animate-fadeIn" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-[2rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden animate-zoomIn">
                {/* Header Container */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        {title}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all active:scale-90 group"
                    >
                        <X size={22} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gradient-to-b from-white to-slate-50/30">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

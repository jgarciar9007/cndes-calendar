import React, { useState, useEffect, useMemo } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useAuth } from '../../context/AuthContext';
import { 
    Plus, Trash2, Paperclip, X, Download, FileText, 
    Sparkles, Info, Users, Search, MapPin, Clock, 
    Calendar, Check, ChevronRight 
} from 'lucide-react';

const EventForm = ({ onClose, initialEvent = null }) => {
    const { addEvent, updateEvent, deleteEvent, currentDate, locations, participantsList, addLocation, addParticipant } = useCalendar();
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    const [activeTab, setActiveTab] = useState('details');

    const initialData = useMemo(() => {
        const start = initialEvent?.start ? new Date(initialEvent.start) : new Date(currentDate);
        const end = initialEvent?.end ? new Date(initialEvent.end) : new Date(new Date(currentDate).setHours(new Date(currentDate).getHours() + 1));
        
        return {
            title: initialEvent?.title || '',
            date: start.toISOString().split('T')[0],
            startTime: start.toTimeString().substring(0, 5),
            endTime: end.toTimeString().substring(0, 5),
            location: initialEvent?.location || '',
            description: initialEvent?.description || ''
        };
    }, [initialEvent, currentDate]);

    const [formData, setFormData] = useState(initialData);
    const [selectedParticipants, setSelectedParticipants] = useState(Array.isArray(initialEvent?.participants) ? initialEvent.participants : []);
    const [attachments, setAttachments] = useState(Array.isArray(initialEvent?.attachments) ? initialEvent.attachments : []);
    const [newLocation, setNewLocation] = useState('');
    const [newParticipant, setNewParticipant] = useState('');
    const [participantSearch, setParticipantSearch] = useState('');
    const [uploadError, setUploadError] = useState('');

    const handleRemoveAttachment = (id) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fData = new FormData();
        fData.append('file', file);

        try {
            const response = await fetch('/api/upload', { method: 'POST', body: fData });
            if (!response.ok) throw new Error('Error en la subida');
            const uploadedFile = await response.json();
            setAttachments(prev => [...prev, uploadedFile]);
            setUploadError('');
        } catch (error) {
            setUploadError('Error al subir el archivo.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

        const eventData = {
            title: formData.title,
            start: startDateTime,
            end: endDateTime,
            location: formData.location || (locations && locations[0]) || '',
            participants: selectedParticipants,
            description: formData.description,
            attachments: attachments
        };

        if (initialEvent?.id) {
            updateEvent({ ...eventData, id: initialEvent.id });
        } else {
            addEvent(eventData);
        }
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
            deleteEvent(initialEvent.id);
            onClose();
        }
    };

    const toggleParticipant = (p) => {
        setSelectedParticipants(prev => 
            prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
        );
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        if (newLocation.trim()) {
            addLocation(newLocation.trim());
            setFormData(prev => ({ ...prev, location: newLocation.trim() }));
            setNewLocation('');
        }
    };

    const handleAddParticipant = (e) => {
        e.preventDefault();
        if (newParticipant.trim()) {
            addParticipant(newParticipant.trim());
            toggleParticipant(newParticipant.trim());
            setNewParticipant('');
        }
    };

    const filteredParticipants = useMemo(() => {
        const list = Array.isArray(participantsList) ? participantsList : [];
        return list.filter(p => 
            p && typeof p === 'string' && p.toLowerCase().includes(participantSearch.toLowerCase())
        );
    }, [participantsList, participantSearch]);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-transparent">
            {/* Modern Tab Switcher */}
            <div className="flex bg-slate-100/80 p-1 rounded-[1.25rem] mb-10 w-full glass-panel">
                {[
                    { id: 'details', label: 'Información', icon: <Info size={16} /> },
                    { id: 'participants', label: 'Asistentes', icon: <Users size={16} /> },
                    { id: 'docs', label: 'Documentación', icon: <Paperclip size={16} /> }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-[1rem] text-xs font-extrabold uppercase tracking-widest transition-all duration-300 ${
                            activeTab === tab.id 
                            ? 'bg-white text-primary-600 shadow-lg shadow-primary-500/5 ring-1 ring-slate-200/50' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'
                        }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                        {(tab.id === 'participants' && selectedParticipants.length > 0) && (
                            <span className="flex items-center justify-center w-5 h-5 bg-primary-600 text-white text-[9px] rounded-full ring-4 ring-white">
                                {selectedParticipants.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[450px]">
                {activeTab === 'details' && (
                    <div className="space-y-10 animate-slideUp pt-6">
                        {/* Title Section */}
                        <div className="group relative">
                            <label className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-black text-primary-600 uppercase tracking-widest z-10 transition-colors group-focus-within:text-primary-700">
                                Asunto / Actividad
                            </label>
                            <input
                                type="text"
                                className="w-full text-xl font-bold bg-white border-2 border-slate-100 rounded-3xl px-6 py-6 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 outline-none transition-all placeholder:text-slate-200"
                                placeholder="Escribe el título de la agenda..."
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                disabled={!isAdmin}
                            />
                        </div>

                        {/* Date Time Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Fecha', icon: <Calendar size={14} />, name: 'date', type: 'date' },
                                { label: 'Hr. Inicio', icon: <Clock size={14} />, name: 'startTime', type: 'time' },
                                { label: 'Hr. Cierre', icon: <Clock size={14} />, name: 'endTime', type: 'time' }
                            ].map(f => (
                                <div key={f.name} className="relative group">
                                    <label className="absolute -top-2 left-4 bg-white px-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">
                                        {f.label}
                                    </label>
                                    <input 
                                        type={f.type} 
                                        className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl px-5 font-extrabold text-slate-700 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 outline-none transition-all"
                                        value={formData[f.name]} 
                                        onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} 
                                        required 
                                        disabled={!isAdmin}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 pointer-events-none group-focus-within:text-primary-600/30 transition-colors">
                                        {f.icon}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Location Selector */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                <MapPin size={14} className="text-primary-600" /> Sala de Reuniones
                            </label>
                            <div className="flex flex-col gap-3">
                                <select 
                                    className="w-full h-16 bg-white border-2 border-slate-100 rounded-3xl px-6 font-bold text-slate-700 focus:border-primary-600 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                                    value={formData.location} 
                                    onChange={e => setFormData({ ...formData, location: e.target.value })} 
                                    disabled={!isAdmin}
                                >
                                    <option value="" disabled>Selecciona una ubicación oficial...</option>
                                    {(locations || []).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                                {isAdmin && (
                                    <div className="flex gap-2 animate-fadeIn">
                                        <input 
                                            type="text" 
                                            className="flex-1 h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 text-sm font-bold focus:bg-white focus:border-primary-600 outline-none transition-all" 
                                            placeholder="Registrar nueva sala..." 
                                            value={newLocation} 
                                            onChange={e => setNewLocation(e.target.value)} 
                                        />
                                        <button type="button" onClick={handleAddLocation} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Notas de la Actividad</label>
                            <textarea
                                className="w-full min-h-[140px] bg-white border-2 border-slate-100 rounded-[2rem] p-6 text-slate-600 leading-relaxed font-bold focus:border-primary-600 outline-none transition-all shadow-sm resize-none"
                                placeholder="Puntos a tratar, objetivos, notas..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                disabled={!isAdmin}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'participants' && (
                    <div className="flex flex-col gap-8 animate-fadeIn h-full pt-6">
                        <div className="flex flex-col gap-4">
                            {isAdmin && (
                                <div className="flex gap-2 p-2 bg-slate-100 rounded-3xl border border-slate-200/50 shadow-inner">
                                    <input 
                                        type="text" 
                                        className="flex-1 h-14 bg-transparent border-none px-6 text-sm font-bold focus:outline-none" 
                                        placeholder="Escribe un nombre para añadir..." 
                                        value={newParticipant} 
                                        onChange={e => setNewParticipant(e.target.value)} 
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant(e)} 
                                    />
                                    <button type="button" onClick={handleAddParticipant} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white shadow-lg text-primary-600 hover:scale-105 transition-all">
                                        <Plus size={24} />
                                    </button>
                                </div>
                            )}

                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full h-14 bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 text-sm font-bold focus:border-primary-600 outline-none transition-all shadow-sm" 
                                    placeholder="Buscar por nombre o cargo..." 
                                    value={participantSearch} 
                                    onChange={e => setParticipantSearch(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6">
                            {filteredParticipants.length > 0 ? (
                                filteredParticipants.map((p, idx) => {
                                    const isSelected = selectedParticipants.includes(p);
                                    return (
                                        <div
                                            key={`${p}-${idx}`}
                                            onClick={() => isAdmin && toggleParticipant(p)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 group ${
                                                isSelected 
                                                    ? 'bg-primary-50 border-primary-600 shadow-lg shadow-primary-500/5' 
                                                    : 'bg-white border-slate-50 hover:border-slate-200 text-slate-500 hover:bg-slate-50/50'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'bg-slate-100 border-slate-200'
                                            }`}>
                                                {isSelected && <Check size={14} strokeWidth={4} />}
                                            </div>
                                            <span className={`text-[13px] tracking-tight truncate ${isSelected ? 'font-black text-primary-900' : 'font-bold'}`}>{p}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-300 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                    <Search size={32} className="mb-2 opacity-20" />
                                    <p className="text-xs font-black uppercase tracking-widest">No hay resultados</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div className="flex flex-col gap-8 animate-fadeIn pt-6">
                        {isAdmin && (
                            <label className="group relative flex flex-col items-center justify-center w-full py-16 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50 hover:bg-primary-50 hover:border-primary-600 transition-all cursor-pointer overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200 mb-6 group-hover:rotate-12 transition-transform duration-500 border border-slate-100">
                                    <Paperclip size={36} className="text-primary-600" />
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Cargar Documentación</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">PDF, JPG o DOC (Max 20MB)</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                            </label>
                        )}

                        <div className="flex flex-col gap-4">
                            {attachments.length > 0 ? (
                                attachments.map(file => (
                                    <div key={file.id} className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-primary-600/30 transition-all group overflow-hidden relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-lg ring-4 ring-slate-50"><FileText size={22} /></div>
                                            <div className="flex flex-col min-w-0 pr-6">
                                                <span className="text-[15px] font-black text-slate-900 truncate" title={file.name}>{file.name}</span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{Math.round(file.size / 1024)} KB • Documento</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={file.data} download={file.name} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-primary-600 rounded-2xl transition-all hover:scale-105 active:scale-90"><Download size={20} /></a>
                                            {isAdmin && <button type="button" onClick={() => handleRemoveAttachment(file.id)} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-300 hover:text-red-500 rounded-2xl transition-all hover:scale-105 active:scale-90 font-bold">
                                                <X size={18} strokeWidth={3} />
                                            </button>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-200">
                                    <FileText size={48} className="mb-4 opacity-10" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Sin documentos adjuntos</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Actions Footer */}
            <div className="flex items-center justify-between pt-10 mt-auto bg-white/80 backdrop-blur-md border-t border-slate-100 sticky bottom-0 -mx-8 px-8 pb-8 z-50">
                {initialEvent?.id && isAdmin ? (
                    <button type="button" onClick={handleDelete} className="flex items-center gap-2 group">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
                            <Trash2 size={18} />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-red-500 transition-colors hidden sm:inline">Eliminar</span>
                    </button>
                ) : <div />}

                <div className="flex gap-4 items-center">
                    <button type="button" onClick={onClose} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all active:scale-95">
                        Ignorar
                    </button>
                    {isAdmin && (
                        <button type="submit" className="bg-primary-600 text-white px-10 py-4 rounded-2xl text-[13px] font-black uppercase tracking-[0.15em] shadow-[0_15px_30px_-5px_rgba(22,163,74,0.3)] hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                            <span>Sincronizar Actividad</span>
                            <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default EventForm;

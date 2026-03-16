import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Download, Plus, Search, Calendar as CalendarIcon, Sparkles, LayoutGrid, CalendarDays, Clock, X } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import CalendarGrid from '../components/calendar/CalendarGrid';
import WeekView from '../components/calendar/WeekView';
import DayView from '../components/calendar/DayView';
import Modal from '../components/common/Modal';
import EventForm from '../components/calendar/EventForm';
import AgendaUploadModal from '../components/calendar/AgendaUploadModal';
import { generateDailyAgenda } from '../utils/pdfGenerator';
import LectorAssistant from '../components/common/LectorAssistant';

const Home = () => {
    const { view, setView, currentDate, nextMonth, prevMonth, setCurrentDate, events } = useCalendar();
    const { user } = useAuth();

    // Modal & Selection State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    const handlePrev = () => {
        if (view === 'month') prevMonth();
        else if (view === 'week') {
            const d = new Date(currentDate);
            d.setDate(d.getDate() - 7);
            setCurrentDate(d);
        }
        else {
            const d = new Date(currentDate);
            d.setDate(d.getDate() - 1);
            setCurrentDate(d);
        }
    };

    const handleNext = () => {
        if (view === 'month') nextMonth();
        else if (view === 'week') {
            const d = new Date(currentDate);
            d.setDate(d.getDate() + 7);
            setCurrentDate(d);
        }
        else {
            const d = new Date(currentDate);
            d.setDate(d.getDate() + 1);
            setCurrentDate(d);
        }
    };

    const handlePdfExport = () => {
        generateDailyAgenda(currentDate, events);
    };

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const lowerTerm = searchTerm.toLowerCase();
        return events.filter(e =>
            e.title.toLowerCase().includes(lowerTerm) ||
            (e.location && e.location.toLowerCase().includes(lowerTerm)) ||
            (e.participants && e.participants.some(p => p.toLowerCase().includes(lowerTerm)))
        ).sort((a, b) => new Date(a.start) - new Date(b.start));
    }, [searchTerm, events]);

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCreateEvent = () => {
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    const handleSearchResultClick = (event) => {
        setCurrentDate(new Date(event.start));
        setSearchTerm('');
        setView('day');
    };

    return (
        <div className="relative min-h-screen bg-slate-50/50">
            {/* Main Header Wrapper */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col gap-8">
                        
                        {/* Row 1: Big Search Bar */}
                        <div className="w-full max-w-4xl mx-auto relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                                <Search size={24} strokeWidth={2.5} />
                            </div>
                            <input
                                type="text"
                                className="w-full h-16 pl-16 pr-6 bg-slate-100/50 border-2 border-slate-200/50 focus:bg-white focus:border-primary-600 focus:ring-8 focus:ring-primary-600/5 rounded-[2rem] text-lg font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                                placeholder="Busca por acta, título o nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* Quick Search Results Dropdown */}
                            {searchTerm && (
                                <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-zoomIn z-50 ring-1 ring-slate-900/5">
                                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 text-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Coincidencias ({searchResults.length})</span>
                                        <button onClick={() => setSearchTerm('')} className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors mr-2">
                                            <X size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((event) => (
                                                <div
                                                    key={event.id}
                                                    onClick={() => handleSearchResultClick(event)}
                                                    className="px-8 py-5 hover:bg-slate-50 cursor-pointer transition-all border-b border-slate-50 group last:border-none flex flex-col gap-1.5"
                                                >
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="text-[15px] font-extrabold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">{event.title}</div>
                                                        <div className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black rounded-lg uppercase shrink-0">
                                                            {format(new Date(event.start), 'd MMM')}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <div className="flex items-center gap-1.5"><Clock size={12} /> {format(new Date(event.start), 'HH:mm')}</div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                                        <div className="truncate shrink">{event.location}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-16 text-center">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
                                                    <Search size={32} className="text-slate-200" />
                                                </div>
                                                <div className="text-sm font-black text-slate-400">Sin hallazgos relevantes</div>
                                                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Intenta con otros términos</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Row 2: Secondary Controls */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                            
                            {/* Left: Title & Nav Section */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                                <div className="flex flex-col min-w-[200px]">
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight first-letter:uppercase">
                                        {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'd MMMM yyyy', { locale: es })}
                                    </h1>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 mt-0.5">
                                        Sistema de Agenda Institucional
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/50">
                                        <button onClick={handlePrev} className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl transition-all active:scale-90 shadow-sm border border-transparent hover:border-slate-100">
                                            <ChevronLeft size={20} strokeWidth={2.5} />
                                        </button>
                                        <button 
                                            onClick={() => setCurrentDate(new Date())} 
                                            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-900 hover:bg-white rounded-xl transition-all active:scale-95 shadow-sm border border-transparent hover:border-slate-100"
                                        >
                                            Hoy
                                        </button>
                                        <button onClick={handleNext} className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl transition-all active:scale-90 shadow-sm border border-transparent hover:border-slate-100">
                                            <ChevronRight size={20} strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    <div className="relative group ml-2">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                                            <CalendarIcon size={18} strokeWidth={2.5} />
                                        </div>
                                        <input
                                            type="date"
                                            className="w-14 sm:w-48 h-12 pl-12 pr-4 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-[13px] font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                                            value={format(currentDate, 'yyyy-MM-dd')}
                                            onChange={(e) => {
                                                if (e.target.value) setCurrentDate(new Date(e.target.value));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Global Actions Section */}
                            <div className="flex items-center gap-3">
                                <div className="flex p-1 bg-white rounded-2xl border border-slate-200/60 shadow-sm mr-2">
                                    {[
                                        { id: 'month', icon: <LayoutGrid size={16} />, label: 'Mes' },
                                        { id: 'week', icon: <CalendarDays size={16} />, label: 'Sm.' },
                                        { id: 'day', icon: <Clock size={16} />, label: 'Día' }
                                    ].map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => setView(v.id)}
                                            className={`flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                                view === v.id 
                                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' 
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {v.icon}
                                            <span className="hidden lg:inline">{v.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={handlePdfExport} 
                                    className="w-12 h-12 flex items-center justify-center bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                                    title="Exportar Agenda en PDF"
                                >
                                    <Download size={20} strokeWidth={2.5} />
                                </button>

                                {user && user.role === 'admin' && (
                                    <>
                                        <button
                                            onClick={() => setIsAgendaModalOpen(true)}
                                            className="h-12 flex items-center gap-3 px-6 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 group"
                                        >
                                            <Sparkles size={16} className="text-primary-400 group-hover:animate-pulse" />
                                            <span className="hidden sm:inline">IA Agenda</span>
                                        </button>

                                        <button 
                                            onClick={handleCreateEvent} 
                                            className="h-12 flex items-center gap-2 px-6 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95"
                                        >
                                            <Plus size={18} strokeWidth={3} />
                                            <span className="hidden sm:inline">Nueva Actividad</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                <div className="bg-white rounded-[3rem] shadow-[0_10px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50 overflow-hidden ring-1 ring-slate-900/5">
                    {view === 'month' ? (
                        <CalendarGrid onEventClick={handleEditEvent} />
                    ) : view === 'week' ? (
                        <WeekView onEventClick={handleEditEvent} />
                    ) : (
                        <DayView onEventClick={handleEditEvent} />
                    )}
                </div>
            </div>

            {/* Modals with specific custom layout */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedEvent ? "Detalle de la Actividad" : "Nueva Convocatoria"}
            >
                <div className="pt-2">
                    <EventForm
                        onClose={() => setIsModalOpen(false)}
                        initialEvent={selectedEvent}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={isAgendaModalOpen}
                onClose={() => setIsAgendaModalOpen(false)}
                title="Carga Inteligente de Agenda"
            >
                <div className="pt-2">
                    <AgendaUploadModal
                        onClose={() => setIsAgendaModalOpen(false)}
                    />
                </div>
            </Modal>

            <LectorAssistant />
        </div>
    );
};

export default Home;

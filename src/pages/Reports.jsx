import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Filter, Download, Printer, ChevronRight, Search, FileText, X, LayoutTemplate, MapPin } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { generateRangeReport } from '../utils/pdfGenerator';

const Reports = () => {
    const { events, locations } = useCalendar();
    
    // Default range: Current Month
    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [reportTitle, setReportTitle] = useState('REPORTE DE ACTIVIDADES');

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const eventDate = new Date(event.start);
            const isWithinRange = isWithinInterval(eventDate, {
                start: startOfDay(new Date(startDate + 'T00:00:00')),
                end: endOfDay(new Date(endDate + 'T23:59:59'))
            });

            const matchesLocation = selectedLocation === 'all' || event.location === selectedLocation;
            
            const matchesSearch = !searchTerm.trim() || 
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (event.participants && event.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())));

            return isWithinRange && matchesLocation && matchesSearch;
        }).sort((a, b) => new Date(a.start) - new Date(b.start));
    }, [events, startDate, endDate, selectedLocation, searchTerm]);

    const handlePrint = () => {
        if (filteredEvents.length === 0) {
            alert("No hay actividades para los filtros seleccionados.");
            return;
        }
        generateRangeReport(new Date(startDate), new Date(endDate), filteredEvents, reportTitle);
    };

    // Grouping for preview
    const groupedEvents = useMemo(() => {
        return filteredEvents.reduce((acc, event) => {
            const dateKey = format(new Date(event.start), 'yyyy-MM-dd');
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
            return acc;
        }, {});
    }, [filteredEvents]);

    return (
        <div className="py-12 animate-fadeIn">
            <div className="flex flex-col gap-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-primary-600">
                            <div className="p-2 bg-primary-100 rounded-xl">
                                <FileText size={20} className="stroke-[2.5]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Módulo de Informes</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reportes Dinámicos</h1>
                        <p className="text-slate-500 font-bold text-sm">Filtra, agrupa y exporta la agenda institucional en formato oficial.</p>
                    </div>

                    <button 
                        onClick={handlePrint}
                        className="h-14 flex items-center gap-3 px-8 bg-slate-900 text-white rounded-[1.25rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-primary-600 hover:shadow-primary-600/30 transition-all active:scale-95 group shrink-0"
                    >
                        <Printer size={18} className="group-hover:animate-bounce" />
                        Generar Informe PDF
                    </button>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Start Date */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Fecha Inicio</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-[13px] font-bold text-slate-900 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Fecha Fin</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-[13px] font-bold text-slate-900 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Lugar / Sala</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                    <select 
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-[13px] font-bold text-slate-900 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                                    >
                                        <option value="all">Todas las salas</option>
                                        {locations.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Búsqueda Rápida</label>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Título, asistent..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-[13px] font-bold text-slate-900 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Report Config Box */}
                    <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary-600/20 flex flex-col justify-between overflow-hidden relative group">
                        <LayoutTemplate className="absolute -right-6 -bottom-6 w-40 h-40 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        <div className="relative">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-4">Configuración de Salida</p>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest pl-1">Título del Documento</label>
                                    <input 
                                        type="text"
                                        value={reportTitle}
                                        onChange={(e) => setReportTitle(e.target.value)}
                                        className="bg-white/10 border-b-2 border-white/20 focus:border-white outline-none rounded-lg px-3 py-2 text-xs font-black transition-all"
                                    />
                                </div>
                                <div className="flex items-center justify-between py-2 border-t border-white/10 mt-2">
                                    <span className="text-[11px] font-black uppercase">Eventos Encontrados</span>
                                    <span className="text-2xl font-black">{filteredEvents.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-white rounded-[3rem] p-4 md:p-12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.1)] border border-slate-200/50">
                    <div className="flex items-center justify-between mb-10 px-4">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-8 bg-primary-600 rounded-full"></div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Previsualización del Informe</h2>
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rango Seleccionado</span>
                                <span className="text-xs font-black text-slate-700">
                                    {format(new Date(startDate + 'T12:00:00'), 'd MMM')} al {format(new Date(endDate + 'T12:00:00'), 'd MMM yyyy')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {Object.keys(groupedEvents).length > 0 ? (
                            Object.keys(groupedEvents).sort().map(dateKey => (
                                <div key={dateKey} className="flex flex-col gap-6 animate-slideIn">
                                    <div className="flex items-center gap-6">
                                        <div className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10">
                                            {format(new Date(dateKey + 'T12:00:00'), 'EEEE, d MMMM yyyy', { locale: es })}
                                        </div>
                                        <div className="h-px flex-1 bg-slate-100"></div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {groupedEvents[dateKey].map(event => (
                                            <div 
                                                key={event.id}
                                                className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8 bg-slate-50/50 rounded-[2rem] border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-300"
                                            >
                                                {/* Content */}
                                                <div className="flex-1 flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-[17px] font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors uppercase">
                                                            {event.title}
                                                        </h3>
                                                        <div className="px-4 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            {event.location}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-white/50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                                            {event.description || 'Sin descripción detallada para esta actividad.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <ChevronRight size={20} className="text-slate-200 group-hover:text-primary-600 group-hover:translate-x-1 transition-all ml-auto" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center gap-6 py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50">
                                    <Printer size={40} className="text-slate-200" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-slate-400">Sin hallazgos para este reporte</h3>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-2">Ajusta los filtros para visualizar actividades</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

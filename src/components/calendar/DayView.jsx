import React from 'react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil, Trash2, Eye, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { useAuth } from '../../context/AuthContext';

const DayView = ({ onEventClick }) => {
    const { currentDate, events, deleteEvent } = useCalendar();
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    const dayEvents = events
        .filter(e => isSameDay(new Date(e.start), currentDate))
        .sort((a, b) => new Date(a.start) - new Date(b.start));

    const handleDelete = (e, eventId) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
            deleteEvent(eventId);
        }
    };

    return (
        <div className="animate-fadeIn p-6 sm:p-10">
            {/* Header Description */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-slate-100 pb-8">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 mb-2">Hoja de Ruta Diaria</div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="text-primary-600 bg-primary-50 w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm">{format(currentDate, 'd')}</span>
                        <span>{format(currentDate, 'MMMM yyyy', { locale: es })}</span>
                    </h3>
                </div>
                {dayEvents.length > 0 && (
                    <div className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/10 self-start">
                        {dayEvents.length} {dayEvents.length === 1 ? 'Actividad' : 'Actividades'}
                    </div>
                )}
            </div>

            {dayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6">
                        <Clock size={32} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">No hay actividades programadas</p>
                    <p className="text-xs text-slate-300 font-bold mt-1">Seleccione 'Nueva Actividad' para comenzar</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white/50 rounded-[2.5rem] border border-slate-100/60 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sec.</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cronograma</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad / Asunto</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Participantes</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ficha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {dayEvents.map((ev, index) => (
                                <tr
                                    key={ev.id}
                                    onClick={() => onEventClick(ev)}
                                    className="group hover:bg-white cursor-pointer transition-all duration-300"
                                >
                                    <td className="px-6 py-7">
                                        <span className="text-xs font-black text-slate-300 group-hover:text-primary-600 transition-colors uppercase tabular-nums">
                                            #{String(index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-7 min-w-[140px]">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                                                {format(new Date(ev.start), 'HH:mm')} - {format(new Date(ev.end), 'HH:mm')}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate max-w-[120px]">
                                                <MapPin size={12} className="shrink-0" />
                                                {ev.location}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-7">
                                        <div className="flex flex-col gap-0.5 max-w-sm">
                                            <span className="text-[15px] font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight line-clamp-2 uppercase">
                                                {ev.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-7 hidden lg:table-cell">
                                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                                            {ev.participants && Array.isArray(ev.participants) && ev.participants.length > 0 ? (
                                                ev.participants.slice(0, 2).map((p, i) => (
                                                    <span key={i} className="text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200/50 px-2.5 py-1 rounded-lg truncate max-w-[120px] uppercase">
                                                        {p}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-300 italic">Abierto</span>
                                            )}
                                            {ev.participants && ev.participants.length > 2 && (
                                                <span className="text-[9px] font-black text-primary-600 px-2 py-1">+ {ev.participants.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-7 text-right">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            {isAdmin ? (
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                                                        className="w-10 h-10 flex items-center justify-center bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(e, ev.id)}
                                                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                                    Ver Detalles <ChevronRight size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DayView;

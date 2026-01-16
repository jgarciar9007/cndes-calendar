import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Download, Plus, Search, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import CalendarGrid from '../components/calendar/CalendarGrid';
import WeekView from '../components/calendar/WeekView';
import DayView from '../components/calendar/DayView';
import Modal from '../components/common/Modal';
import EventForm from '../components/calendar/EventForm';
import { generateDailyAgenda } from '../utils/pdfGenerator';

const Home = () => {
    const { view, setView, currentDate, nextMonth, prevMonth, setCurrentDate, events } = useCalendar();
    const { user } = useAuth();

    // Modal & Selection State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    const handlePrev = () => {
        if (view === 'month') prevMonth();
        else if (view === 'week') setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
        else setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    };

    const handleNext = () => {
        if (view === 'month') nextMonth();
        else if (view === 'week') setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
        else setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    };

    const handlePdfExport = () => {
        generateDailyAgenda(currentDate, events);
    };

    // Filtered Events for Search
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
        setSearchTerm(''); // Clear search to show calendar
        setView('day'); // Go to day view
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Header Controls */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Title & Navigation */}
                    <div className="flex items-center gap-4">
                        <h2 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.5rem', minWidth: '200px' }}>
                            {view === 'month'
                                ? format(currentDate, 'MMMM yyyy', { locale: es })
                                : `Agenda: ${format(currentDate, 'd MMMM yyyy', { locale: es })}`}
                        </h2>

                        <div className="flex items-center gap-1 bg-white rounded-md border border-gray-200 p-1">
                            <button onClick={handlePrev} className="btn btn-ghost p-1"><ChevronLeft size={20} /></button>
                            <button onClick={() => setCurrentDate(new Date())} className="btn btn-ghost text-sm">Hoy</button>
                            <button onClick={handleNext} className="btn btn-ghost p-1"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    {/* Search & Date Picker */}
                    <div className="flex items-center gap-4 flex-1 justify-center" style={{ maxWidth: '600px' }}>
                        <div className="relative flex-1 group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none display-flex items-center">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                className="input w-full pl-10 bg-white"
                                placeholder="Buscar..."
                                style={{ height: '42px', transition: 'all 0.2s' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative w-48 group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none display-flex items-center">
                                <CalendarIcon size={18} />
                            </div>
                            <input
                                type="date"
                                className="input w-full bg-white"
                                style={{ paddingLeft: '2.5rem', height: '42px', transition: 'all 0.2s' }}
                                value={format(currentDate, 'yyyy-MM-dd')}
                                onChange={(e) => {
                                    if (e.target.value) setCurrentDate(new Date(e.target.value));
                                }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <div className="flex bg-white rounded-md border border-gray-200 p-1">
                            <button onClick={() => setView('month')} className={`btn ${view === 'month' ? 'btn-primary' : 'btn-ghost'} py-1 px-3 text-sm`}>Mes</button>
                            <button onClick={() => setView('week')} className={`btn ${view === 'week' ? 'btn-primary' : 'btn-ghost'} py-1 px-3 text-sm`}>Semana</button>
                            <button onClick={() => setView('day')} className={`btn ${view === 'day' ? 'btn-primary' : 'btn-ghost'} py-1 px-3 text-sm`}>Día</button>
                        </div>

                        <button onClick={handlePdfExport} className="btn btn-secondary" title="Exportar PDF">
                            <Download size={18} /> <span className="hidden sm:inline ml-2">PDF</span>
                        </button>

                        {user && user.role === 'admin' && (
                            <button onClick={handleCreateEvent} className="btn btn-primary">
                                <Plus size={18} /> <span className="hidden sm:inline ml-2">Nuevo</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results Overlay */}
                {searchTerm && (
                    <div style={{
                        position: 'absolute',
                        top: '70px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: '600px',
                        backgroundColor: 'white',
                        zIndex: 100,
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid var(--color-border)',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        {searchResults.length > 0 ? (
                            <div className="flex flex-col">
                                {searchResults.map((event, index) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleSearchResultClick(event)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        style={{
                                            padding: '1rem',
                                            borderBottom: index !== searchResults.length - 1 ? '1px solid var(--color-border)' : 'none'
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">{event.title}</div>
                                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                {format(new Date(event.start), 'd MMM')}
                                            </span>
                                        </div>

                                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-600">
                                                    {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="truncate max-w-[200px]" title={event.location}>{event.location}</span>
                                            </div>

                                            {event.participants && event.participants.length > 0 && (
                                                <div className="text-gray-400 truncate mt-1" title={event.participants.join(', ')}>
                                                    {event.participants.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <Search size={24} className="mx-auto mb-2 text-gray-300" />
                                <p>No se encontraron eventos</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {view === 'month' ? (
                <CalendarGrid onEventClick={handleEditEvent} />
            ) : view === 'week' ? (
                <WeekView onEventClick={handleEditEvent} />
            ) : (
                <DayView onEventClick={handleEditEvent} />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedEvent ? "Editar Evento" : "Crear Nuevo Evento"}
            >
                <EventForm
                    onClose={() => setIsModalOpen(false)}
                    initialEvent={selectedEvent}
                />
            </Modal>
        </div>
    );
};
export default Home;

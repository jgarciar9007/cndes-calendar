import React from 'react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil, Trash2, Eye } from 'lucide-react';
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
        if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            deleteEvent(eventId);
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="card" style={{ padding: '2rem', overflow: 'hidden' }}>
                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '1rem'
                }}>
                    <span style={{ color: 'var(--color-secondary)' }}>{format(currentDate, 'd')}</span>
                    <span style={{ textTransform: 'capitalize' }}>{format(currentDate, 'MMMM yyyy', { locale: es })}</span>
                </h3>

                {dayEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-light)' }}>
                        No hay actividades programadas para este día.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '0.75rem 1rem' }}>#</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Horario</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Lugar</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Asunto</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Participantes</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dayEvents.map((ev, index) => (
                                    <tr
                                        key={ev.id}
                                        style={{
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onClick={() => onEventClick(ev)}
                                        className="hover:bg-gray-50"
                                    >
                                        <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontFamily: 'monospace' }}>{index + 1}</td>
                                        <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                                            {format(new Date(ev.start), 'HH:mm')} - {format(new Date(ev.end), 'HH:mm')}
                                        </td>
                                        <td style={{ padding: '1rem' }}>{ev.location}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{ev.title}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                                            {ev.participants && Array.isArray(ev.participants) ? ev.participants.map((p, i) => (
                                                <span key={i} style={{
                                                    display: 'inline-block',
                                                    backgroundColor: '#f1f5f9',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    marginRight: '4px',
                                                    marginBottom: '2px'
                                                }}>
                                                    {p}
                                                </span>
                                            )) : ev.participants}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {isAdmin ? (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEventClick(ev);
                                                            }}
                                                            className="btn"
                                                            style={{
                                                                padding: '0.4rem 0.6rem',
                                                                backgroundColor: '#eff6ff', // blue-50
                                                                color: '#2563eb', // blue-600
                                                                border: '1px solid transparent'
                                                            }}
                                                            title="Editar"
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#dbeafe'; // blue-100
                                                                e.currentTarget.style.borderColor = '#bfdbfe'; // blue-200
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#eff6ff';
                                                                e.currentTarget.style.borderColor = 'transparent';
                                                            }}
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(e, ev.id)}
                                                            className="btn"
                                                            style={{
                                                                padding: '0.4rem 0.6rem',
                                                                backgroundColor: '#fef2f2', // red-50
                                                                color: '#dc2626', // red-600
                                                                border: '1px solid transparent'
                                                            }}
                                                            title="Eliminar"
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#fee2e2'; // red-100
                                                                e.currentTarget.style.borderColor = '#fecaca'; // red-200
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#fef2f2';
                                                                e.currentTarget.style.borderColor = 'transparent';
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEventClick(ev);
                                                        }}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={16} style={{ marginRight: '0.25rem' }} /> Ver
                                                    </button>
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
        </div>
    );
};

export default DayView;

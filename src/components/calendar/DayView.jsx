import React from 'react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCalendar } from '../../context/CalendarContext';

const DayView = () => {
    const { currentDate, events } = useCalendar();

    const dayEvents = events
        .filter(e => isSameDay(new Date(e.start), currentDate))
        .sort((a, b) => new Date(a.start) - new Date(b.start));

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
                                </tr>
                            </thead>
                            <tbody>
                                {dayEvents.map((ev, index) => (
                                    <tr key={ev.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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

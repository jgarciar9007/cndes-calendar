import React, { useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCalendar } from '../../context/CalendarContext';

const WeekView = ({ onEventClick }) => {
    const { currentDate, events } = useCalendar();

    const START_HOUR = 7;
    // Start week on Sunday (0)
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startDate, i)), [startDate]);
    // Display hours from START_HOUR to 23:00 (17 hours total)
    const hours = useMemo(() => Array.from({ length: 24 - START_HOUR }).map((_, i) => i + START_HOUR), []);

    const getEventsForDay = (day) => {
        return events.filter(event => isSameDay(new Date(event.start), day));
    };

    // Calculate position and height based on time
    const getEventStyle = (event) => {
        const start = new Date(event.start);
        const end = new Date(event.end);

        // Calculate absolute minutes from midnight
        const absStartMinutes = start.getHours() * 60 + start.getMinutes();
        // Calculate offset minutes relative to START_HOUR
        const relativeStartMinutes = absStartMinutes - (START_HOUR * 60);

        const durationMinutes = differenceInMinutes(end, start);

        // 60px per hour
        return {
            position: 'absolute',
            top: `${relativeStartMinutes}px`,
            height: `${Math.max(durationMinutes, 20)}px`, // Minimum height 20px
            left: '2px',
            right: '2px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)', // blue-100 equivalent with opacity
            borderLeft: '4px solid #3b82f6', // blue-500
            padding: '2px 4px',
            borderRadius: '4px',
            cursor: 'pointer',
            overflow: 'hidden',
            zIndex: 10
        };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <div style={{ borderRight: '1px solid #e5e7eb' }}></div> {/* Spacer for time axis */}
                {weekDays.map((day, i) => {
                    const isToday = isSameDay(day, new Date());
                    return (
                        <div key={i} style={{ padding: '8px', textAlign: 'center', borderRight: i < 6 ? '1px solid #e5e7eb' : 'none', background: isToday ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: isToday ? '#2563eb' : '#6b7280' }}>
                                {format(day, 'EEE', { locale: es })}
                            </div>
                            <div style={{
                                fontSize: '1.25rem',
                                marginTop: '4px',
                                width: '32px',
                                height: '32px',
                                lineHeight: '32px',
                                margin: '4px auto 0',
                                borderRadius: '50%',
                                background: isToday ? '#2563eb' : 'transparent',
                                color: isToday ? 'white' : '#374151',
                                fontWeight: isToday ? 'bold' : 'normal'
                            }}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scrollable Body */}
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                <div style={{ position: 'relative', height: '1020px', display: 'grid', gridTemplateColumns: '60px 1fr' }}>

                    {/* Time Axis */}
                    <div style={{ borderRight: '1px solid #e5e7eb', background: 'white' }}>
                        {hours.map(hour => (
                            <div key={hour} style={{ height: '60px', position: 'relative', textAlign: 'right', paddingRight: '8px' }}>
                                <span style={{ position: 'absolute', top: '-6px', right: '8px', fontSize: '0.75rem', color: '#9ca3af', background: 'white', padding: '0 4px' }}>
                                    {format(new Date().setHours(hour, 0), 'HH:mm')}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', position: 'relative' }}>
                        {/* Background Grid Lines */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                            {hours.map(hour => (
                                <div key={`line-${hour}`} style={{ height: '60px', borderBottom: '1px solid #f3f4f6', boxSizing: 'border-box' }}></div>
                            ))}
                        </div>

                        {/* Day Columns with Events */}
                        {weekDays.map((day, i) => {
                            const dayEvents = getEventsForDay(day);
                            return (
                                <div key={i} style={{ position: 'relative', borderRight: i < 6 ? '1px solid #f3f4f6' : 'none', height: '100%' }}>
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                                            style={getEventStyle(event)}
                                            title={`${event.title} - ${event.location}`}
                                        >
                                            <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#111827', lineHeight: 1.2, maxHeight: 'calc(100% - 14px)', overflow: 'hidden' }}>
                                                {event.title}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: '#4b5563', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {event.location}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekView;

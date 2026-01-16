import React from 'react';
import { DndContext, useDraggable, useDroppable, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns';
import { useCalendar } from '../../context/CalendarContext';
import { useAuth } from '../../context/AuthContext';

const DraggableEvent = ({ event, isAdmin, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: event.id,
        disabled: !isAdmin, // Only admin can drag
        data: { event }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
        opacity: 0.9,
        cursor: 'grabbing',
        pointerEvents: 'none' // let clicks pass through during drag
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="event-item"
            onClick={(e) => {
                // Prevent drag click from firing if we just wanted to select
                // But dnd-kit handles separation usually.
                e.stopPropagation(); // Stop bubbling to day cell
                if (onClick) onClick(event);
            }}
        >
            <div style={{
                fontSize: '0.75rem',
                backgroundColor: isDragging ? 'var(--color-secondary)' : 'rgba(56, 189, 248, 0.1)',
                color: isDragging ? 'white' : 'var(--color-primary)',
                padding: '2px 4px',
                borderRadius: '4px',
                borderLeft: isDragging ? 'none' : '2px solid var(--color-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '2px',
                cursor: isAdmin ? 'pointer' : 'default', // Changed to pointer for click
                boxShadow: isDragging ? 'var(--shadow-lg)' : 'none',
                position: 'relative'
            }}>
                {format(new Date(event.start), 'HH:mm')} {event.title}
            </div>
        </div>
    );
};

const DroppableDay = ({ day, events, isCurrentMonth, onClick, isAdmin, onEventClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: day.toISOString(),
        data: { date: day }
    });

    const isToday = isSameDay(day, new Date());

    // We can show fewer events to ensure they fit cleanly
    const MAX_VISIBLE_EVENTS = 3;

    return (
        <div
            ref={setNodeRef}
            style={{
                backgroundColor: isOver ? '#f0f9ff' : 'var(--color-surface)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: isCurrentMonth ? 1 : 0.4,
                border: isOver ? '2px dashed var(--color-secondary)' : 'none',
                transition: 'all 0.2s',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className="calendar-day-cell"
        >
            <div style={{
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: isToday ? 'var(--color-secondary)' : 'transparent',
                    color: isToday ? 'white' : 'var(--color-text-light)',
                    fontWeight: isToday ? '600' : '500',
                    fontSize: '0.9rem'
                }}>
                    {format(day, 'd')}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 4px 4px 4px', overflow: 'hidden' }}>
                {events.slice(0, MAX_VISIBLE_EVENTS).map(ev => (
                    <DraggableEvent
                        key={ev.id}
                        event={ev}
                        isAdmin={isAdmin}
                        onClick={onEventClick}
                    />
                ))}
                {events.length > MAX_VISIBLE_EVENTS && (
                    <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--color-text-light)',
                        textAlign: 'center',
                        padding: '2px',
                        backgroundColor: 'rgba(241, 245, 249, 0.8)',
                        borderRadius: '4px',
                        marginTop: 'auto'
                    }}>
                        + {events.length - MAX_VISIBLE_EVENTS} más
                    </div>
                )}
            </div>
        </div>
    );
};

const CalendarGrid = ({ onEventClick }) => {
    const { currentDate, events, setCurrentDate, setView, moveEvent } = useCalendar();
    const { user } = useAuth();

    const isAdmin = user && user.role === 'admin';

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const cellDays = eachDayOfInterval({ start: startDate, end: endDate });

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            // active.id is event ID. over.id is day ISO string
            const newDate = new Date(over.id);
            if (!isNaN(newDate.getTime())) {
                moveEvent(active.id, newDate);
            }
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="calendar-grid-container" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    backgroundColor: 'var(--color-surface)',
                    borderBottom: '1px solid var(--color-border)',
                    flexShrink: 0
                }}>
                    {weekDays.map(d => (
                        <div key={d} style={{
                            padding: '1rem',
                            textAlign: 'center',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-light)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gridTemplateRows: 'repeat(6, 1fr)',
                    flexGrow: 1,
                    backgroundColor: 'var(--color-border)',
                    gap: '1px',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden'
                }}>
                    {cellDays.map(day => {
                        const dayEvents = events.filter(e => isSameDay(new Date(e.start), day));
                        // Sort events by time
                        dayEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

                        const isCurrentMonth = isSameMonth(day, monthStart);

                        return (
                            <DroppableDay
                                key={day.toISOString()}
                                day={day}
                                events={dayEvents}
                                isCurrentMonth={isCurrentMonth}
                                onClick={() => { setCurrentDate(day); setView('day'); }}
                                isAdmin={isAdmin}
                                onEventClick={onEventClick}
                            />
                        );
                    })}
                </div>
            </div>
        </DndContext>
    );
};
export default CalendarGrid;

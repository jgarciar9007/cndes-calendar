import React from 'react';
import { DndContext, useDraggable, useDroppable, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCalendar } from '../../context/CalendarContext';
import { useAuth } from '../../context/AuthContext';

const DraggableEvent = ({ event, isAdmin, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: event.id,
        disabled: !isAdmin,
        data: { event }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
        opacity: 0.8,
        cursor: 'grabbing',
        pointerEvents: 'none'
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="relative mb-1 group/event"
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(event);
            }}
        >
            <div className={`px-2 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black leading-tight border transition-all truncate hover:shadow-md ${
                isDragging 
                    ? 'bg-primary-600 text-white border-transparent' 
                    : 'bg-white text-slate-700 border-slate-100 group-hover/event:border-primary-600/30 group-hover/event:bg-primary-50 group-hover/event:text-primary-800 shadow-sm'
            }`}>
                <span className="opacity-50 font-bold mr-1">{format(new Date(event.start), 'HH:mm')}</span>
                {event.title}
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
    const MAX_VISIBLE_EVENTS = 4;

    return (
        <div
            ref={setNodeRef}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`relative min-h-[140px] flex flex-col transition-all duration-300 border-r border-b border-slate-100/60 overflow-hidden cursor-pointer ${
                !isCurrentMonth ? 'bg-slate-50 opacity-40' : 'bg-white'
            } ${isOver ? 'bg-primary-50/50 ring-2 ring-primary-500 ring-inset z-10' : ''} ${isToday ? 'bg-primary-50/10' : ''}`}
        >
            {/* Day Header */}
            <div className="flex justify-end p-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                    isToday 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                        : isCurrentMonth ? 'text-slate-400' : 'text-slate-300'
                }`}>
                    {format(day, 'd')}
                </div>
            </div>

            {/* Events List */}
            <div className="flex-1 px-1.5 sm:px-2.5 pb-2 transition-all">
                {events.slice(0, MAX_VISIBLE_EVENTS).map(ev => (
                    <DraggableEvent
                        key={ev.id}
                        event={ev}
                        isAdmin={isAdmin}
                        onClick={onEventClick}
                    />
                ))}
                {events.length > MAX_VISIBLE_EVENTS && (
                    <div className="mt-1 text-[9px] font-black text-slate-400 bg-slate-50 border border-slate-100 py-1 rounded-lg text-center uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-colors">
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
            const newDate = new Date(over.id);
            if (!isNaN(newDate.getTime())) {
                moveEvent(active.id, newDate);
            }
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex flex-col w-full h-full bg-slate-200/40">
                {/* Weekday Labels Header */}
                <div className="grid grid-cols-7 bg-white/50 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-30">
                    {weekDays.map(d => (
                        <div key={d} className="py-5 text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                                <span className="hidden sm:inline">{d}</span>
                                <span className="sm:hidden">{d.slice(0, 3)}</span>
                            </span>
                        </div>
                    ))}
                </div>

                {/* Grid Body */}
                <div className="grid grid-cols-7 bg-slate-100/20 flex-1 relative ring-1 ring-slate-200/50">
                    {cellDays.map(day => {
                        const dayEvents = events.filter(e => isSameDay(new Date(e.start), day));
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

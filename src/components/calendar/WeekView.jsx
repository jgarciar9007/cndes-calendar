import React, { useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCalendar } from '../../context/CalendarContext';

const WeekView = ({ onEventClick }) => {
    const { currentDate, events } = useCalendar();

    const START_HOUR = 7;
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
    const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startDate, i)), [startDate]);
    const hours = useMemo(() => Array.from({ length: 24 - START_HOUR }).map((_, i) => i + START_HOUR), []);

    const getEventsForDay = (day) => {
        return events.filter(event => isSameDay(new Date(event.start), day));
    };

    const getEventStyle = (event) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const absStartMinutes = start.getHours() * 60 + start.getMinutes();
        const relativeStartMinutes = absStartMinutes - (START_HOUR * 60);
        const durationMinutes = differenceInMinutes(end, start);

        return {
            top: `${relativeStartMinutes}px`,
            height: `${Math.max(durationMinutes, 24)}px`,
        };
    };

    return (
        <div className="flex flex-col w-full h-full bg-white animate-fadeIn overflow-hidden">
            {/* Week Header */}
            <div className="grid grid-cols-[80px_1fr] border-b border-slate-100 bg-slate-50/50 sticky top-0 z-20">
                <div className="border-r border-slate-100"></div>
                <div className="grid grid-cols-7">
                    {weekDays.map((day, i) => {
                        const isToday = isSameDay(day, new Date());
                        return (
                            <div key={i} className={`py-4 text-center border-r last:border-r-0 border-slate-100 ${isToday ? 'bg-primary-50/30' : ''}`}>
                                <div className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-primary-600' : 'text-slate-400'}`}>
                                    {format(day, 'EEE', { locale: es })}
                                </div>
                                <div className={`mt-1 text-lg font-black ${isToday ? 'text-primary-700' : 'text-slate-700'}`}>
                                    {format(day, 'd')}
                                </div>
                                {isToday && <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mx-auto mt-1 shrink-0 scale-75 shadow-sm"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Time Grid Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="grid grid-cols-[80px_1fr] min-h-[1440px]">
                    {/* Time Column */}
                    <div className="border-r border-slate-100 bg-slate-50/20">
                        {hours.map(hour => (
                            <div key={hour} className="h-[60px] relative">
                                <span className="absolute -top-2.5 right-4 text-[11px] font-black text-slate-300 uppercase tracking-tighter tabular-nums">
                                    {format(new Date().setHours(hour, 0), 'HH:mm')}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Content Columns */}
                    <div className="grid grid-cols-7 relative">
                        {/* Background Hour Lines */}
                        <div className="absolute inset-0 pointer-events-none">
                            {hours.map(hour => (
                                <div key={hour} className="h-[60px] border-b border-slate-50/80"></div>
                            ))}
                        </div>

                        {/* Day Columns */}
                        {weekDays.map((day, i) => {
                            const dayEvents = getEventsForDay(day);
                            const isToday = isSameDay(day, new Date());
                            return (
                                <div key={i} className={`relative border-r last:border-r-0 border-slate-100 ${isToday ? 'bg-primary-50/5' : ''}`}>
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            onClick={() => onEventClick(event)}
                                            style={getEventStyle(event)}
                                            className="absolute left-1 right-1 p-2 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-600/30 transition-all cursor-pointer group z-10 overflow-hidden ring-1 ring-slate-900/5"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-full my-2 ml-1 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="pl-2">
                                                <div className="text-[11px] font-black text-slate-900 leading-tight group-hover:text-primary-700 transition-colors truncate">
                                                    {event.title}
                                                </div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-1 truncate">
                                                    {event.location}
                                                </div>
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

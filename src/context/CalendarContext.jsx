/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
    // State
    const [events, setEvents] = useState([]);
    const [locations, setLocations] = useState([]);
    const [participantsList, setParticipantsList] = useState([]);
    const [view, setView] = useState('week');
    const [currentDate, setCurrentDate] = useState(new Date()); // Start at current date

    // API Base URL - In development this proxies, in prod it's relative
    // We will assume a proxy is set up or use a relative path if served from same origin
    const API_BASE = '/api';

    const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    // Fetch Data on Mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // console.log('Fetching calendar data...');
            const [eventsRes, locRes, partRes] = await Promise.all([
                fetch(`${API_BASE}/events`),
                fetch(`${API_BASE}/locations`),
                fetch(`${API_BASE}/participants`)
            ]);

            if (eventsRes.ok) {
                const eventsData = await eventsRes.json();
                setEvents(eventsData.map(e => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end)
                })));
            } else {
                console.error('Failed to fetch events');
            }

            if (locRes.ok) setLocations(await locRes.json());
            if (partRes.ok) setParticipantsList(await partRes.json());

        } catch (error) {
            console.error("Failed to fetch calendar data", error);
        }
    };

    const addLocation = async (loc) => {
        if (!locations.includes(loc)) {
            const newLocations = [...locations, loc];
            setLocations(newLocations); // Optimistic
            try {
                await fetch(`${API_BASE}/locations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newLocations)
                });
            } catch (e) {
                console.error("Error saving location", e);
            }
        }
    };

    const addParticipant = async (part) => {
        if (!participantsList.includes(part)) {
            const newList = [...participantsList, part];
            setParticipantsList(newList); // Optimistic
            try {
                await fetch(`${API_BASE}/participants`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newList)
                });
            } catch (e) {
                console.error("Error saving participant", e);
            }
        }
    };

    const addEvent = async (event) => {
        const newEvent = { ...event, id: generateId() };
        const newEventsList = [...events, newEvent];
        setEvents(newEventsList); // Optimistic

        try {
            await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEventsList)
            });
        } catch (e) {
            console.error("Error saving event", e);
            alert("Error al guardar el evento");
        }
    };

    const bulkAddEvents = async (newEvents) => {
        const processedEvents = newEvents.map(e => ({
            ...e,
            id: generateId(),
            start: new Date(e.start),
            end: new Date(e.end),
            participants: e.participants || [],
            attachments: e.attachments || []
        }));

        const newEventsList = [...events, ...processedEvents];
        setEvents(newEventsList); // Optimistic

        try {
            await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEventsList)
            });
            return true;
        } catch (e) {
            console.error("Error bulk saving events", e);
            alert("Error al guardar los eventos masivamente");
            return false;
        }
    };

    const updateEvent = async (updatedEvent) => {
        const newEventsList = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
        setEvents(newEventsList); // Optimistic

        try {
            await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEventsList)
            });
        } catch (e) {
            console.error("Error updating event", e);
            alert("Error al actualizar el evento");
        }
    };

    const moveEvent = async (eventId, newDate) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        const duration = event.end.getTime() - event.start.getTime();
        const newStart = new Date(newDate);
        newStart.setHours(event.start.getHours(), event.start.getMinutes());

        const newEnd = new Date(newStart.getTime() + duration);
        const updatedEvent = { ...event, start: newStart, end: newEnd };

        await updateEvent(updatedEvent);
    };

    const deleteEvent = async (id) => {
        const newEventsList = events.filter(e => e.id !== id);
        setEvents(newEventsList); // Optimistic

        try {
            await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEventsList)
            });
        } catch (e) {
            console.error("Error deleting event", e);
            alert("Error al eliminar el evento. Verifique su conexión.");
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        <CalendarContext.Provider value={{
            events, view, setView, currentDate, setCurrentDate,
            locations, participantsList, addLocation, addParticipant,
            addEvent, bulkAddEvents, updateEvent, deleteEvent, moveEvent,
            nextMonth, prevMonth
        }}>
            {children}
        </CalendarContext.Provider>
    );
};

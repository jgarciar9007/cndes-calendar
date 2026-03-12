import React, { useState } from 'react';
import { Upload, FileText, Sparkles, Check, X, AlertCircle, Calendar, Plus } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';

const AgendaUploadModal = ({ onClose }) => {
    const { bulkAddEvents } = useCalendar();
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedEvents, setExtractedEvents] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Por favor, selecciona un archivo PDF válido.');
        }
    };

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload file
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Error al subir el archivo');
            const uploadedFileData = await uploadRes.json();

            // 2. Process with AI
            const aiRes = await fetch('/api/ai/process-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filePath: uploadedFileData.data,
                    mimeType: uploadedFileData.type
                })
            });

            if (!aiRes.ok) throw new Error('Error al procesar con IA');
            const data = await aiRes.json();

            if (data && data.length > 0) {
                setExtractedEvents(data.map(event => ({
                    ...event,
                    selected: true,
                    // Ensure full date-time strings for the calendar
                    start: `${event.date}T${event.startTime}`,
                    end: `${event.date}T${event.endTime}`
                })));
            } else {
                setError('No se detectaron actividades en el documento.');
            }

        } catch (err) {
            console.error(err);
            setError('Hubo un problema al procesar la agenda. Reintenta.');
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleEventSelection = (index) => {
        const newEvents = [...extractedEvents];
        newEvents[index].selected = !newEvents[index].selected;
        setExtractedEvents(newEvents);
    };

    const handleConfirmImport = async () => {
        const eventsToImport = extractedEvents.filter(e => e.selected);
        if (eventsToImport.length === 0) return;

        const success = await bulkAddEvents(eventsToImport);
        if (success) {
            alert(`${eventsToImport.length} actividades añadidas al calendario.`);
            onClose();
        }
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            {!extractedEvents.length ? (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-primary">
                        <Upload size={32} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Subir Agenda Diaria</h3>
                    <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
                        Sube un archivo PDF para extraer automáticamente todas las actividades con inteligencia artificial.
                    </p>

                    <input
                        type="file"
                        id="agenda-upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-col gap-3 w-full px-10">
                        <label
                            htmlFor="agenda-upload"
                            className="btn btn-secondary w-full cursor-pointer hover:border-primary/50"
                        >
                            {file ? `Archivo: ${file.name}` : 'Seleccionar PDF'}
                        </label>

                        <button
                            onClick={handleProcess}
                            disabled={!file || isProcessing}
                            className="btn btn-ai w-full"
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Analizando Documento...</span>
                                </div>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    <span>Procesar con IA</span>
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 mt-4 text-red-500 text-sm font-medium animate-in fade-in">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Actividades Detectadas</h3>
                            <p className="text-xs text-gray-500">Selecciona las que desees importar al calendario.</p>
                        </div>
                        <div className="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-bold">
                            {extractedEvents.filter(e => e.selected).length} seleccionadas
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                        {extractedEvents.map((event, idx) => (
                            <div
                                key={idx}
                                onClick={() => toggleEventSelection(idx)}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative group ${
                                    event.selected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-gray-900 pr-8">{event.title}</div>
                                    <div className={`p-1 rounded-full transition-colors ${
                                        event.selected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                                    }`}>
                                        {event.selected ? <Check size={14} /> : <Plus size={14} />}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-auto">
                                    <div className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-md">
                                        <Calendar size={12} className="text-primary" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-md">
                                        <Check size={12} className="text-primary" />
                                        <span>{event.startTime} - {event.endTime}</span>
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-md">
                                            <AlertCircle size={12} className="text-primary" />
                                            <span className="truncate max-w-[150px]">{event.location}</span>
                                        </div>
                                    )}
                                </div>

                                {event.description && (
                                    <p className="text-[11px] text-gray-400 mt-2 italic line-clamp-2">{event.description}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={() => setExtractedEvents([])}
                            className="btn btn-ghost flex-1"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmImport}
                            className="btn btn-primary flex-1 py-3"
                        >
                            Importar al Calendario
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-amber-50 rounded-xl p-4 flex gap-3 border border-amber-100">
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    La IA extraerá fechas, horas y participantes. Revisa siempre los datos antes de confirmar la importación masiva.
                </p>
            </div>
        </div>
    );
};

export default AgendaUploadModal;

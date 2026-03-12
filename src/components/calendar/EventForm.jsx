import React, { useState, useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Paperclip, X, Download, FileText, Sparkles, Info, Users } from 'lucide-react';

const EventForm = ({ onClose, initialEvent = null }) => {
    const { addEvent, updateEvent, deleteEvent, currentDate, locations, participantsList, addLocation, addParticipant } = useCalendar();
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    const [activeTab, setActiveTab] = useState('general');

    // Initial date string YYYY-MM-DD
    const initialDate = initialEvent ? new Date(initialEvent.start).toISOString().split('T')[0] : currentDate.toISOString().split('T')[0];
    const initialStartTime = initialEvent ? new Date(initialEvent.start).toTimeString().substring(0, 5) : '09:00';
    const initialEndTime = initialEvent ? new Date(initialEvent.end).toTimeString().substring(0, 5) : '10:00';

    const [formData, setFormData] = useState({
        title: initialEvent ? initialEvent.title : '',
        date: initialDate,
        startTime: initialStartTime,
        endTime: initialEndTime,
        location: initialEvent ? initialEvent.location : '',
        description: initialEvent ? initialEvent.description || '' : ''
    });

    const [selectedParticipants, setSelectedParticipants] = useState(initialEvent ? initialEvent.participants || [] : []);
    const [newLocation, setNewLocation] = useState('');
    const [newParticipant, setNewParticipant] = useState('');
    const [participantSearch, setParticipantSearch] = useState('');

    // Attachments State: Array of { name, size, type, data }
    const [attachments, setAttachments] = useState(initialEvent ? initialEvent.attachments || [] : []);
    const [uploadError, setUploadError] = useState('');
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [extractedActivities, setExtractedActivities] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
            alert('Por favor, complete todos los campos obligatorios (Asunto, Fecha, Inicio, Fin).');
            return;
        }

        // Combine date and time
        const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

        const eventData = {
            title: formData.title,
            start: startDateTime,
            end: endDateTime,
            location: formData.location || locations[0],
            participants: selectedParticipants,
            description: formData.description,
            attachments: attachments
        };

        if (initialEvent) {
            updateEvent({ ...eventData, id: initialEvent.id });
        } else {
            addEvent(eventData);
        }

        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            deleteEvent(initialEvent.id);
            onClose();
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            setUploadError('El archivo es demasiado grande (Máx. 50MB)');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Error en la subida');

            const uploadedFile = await response.json();
            setAttachments([...attachments, uploadedFile]);
            setUploadError('');
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError('Error al subir el archivo al servidor.');
        }
    };

    const handleProcessAI = async () => {
        if (attachments.length === 0) return;

        setIsProcessingAI(true);
        try {
            // Process the last uploaded file for now, or all of them? 
            // Let's do the last one.
            const lastFile = attachments[attachments.length - 1];

            const response = await fetch('/api/ai/process-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filePath: lastFile.data, // This is the /uploads/ path
                    mimeType: lastFile.type
                })
            });

            if (!response.ok) throw new Error('Error procesando el documento');

            const result = await response.json();
            setExtractedActivities(result);

            // If only one activity, we could populate the form directly
            if (result.length === 1) {
                const activity = result[0];
                setFormData({
                    ...formData,
                    title: activity.title || formData.title,
                    date: activity.date || formData.date,
                    startTime: activity.startTime || formData.startTime,
                    endTime: activity.endTime || formData.endTime,
                    description: activity.description || formData.description,
                    location: activity.location || formData.location
                });

                if (activity.participants) {
                    const validParticipants = activity.participants.filter(p => participantsList.includes(p));
                    setSelectedParticipants(prev => [...new Set([...prev, ...validParticipants])]);
                }

                alert('Información del evento actualizada con los datos extraídos por la IA.');
            }
        } catch (error) {
            console.error('AI Processing failed:', error);
            alert('Error al procesar el documento con IA.');
        } finally {
            setIsProcessingAI(false);
        }
    };

    const handleRemoveAttachment = (id) => {
        if (window.confirm('¿Eliminar este adjunto?')) {
            setAttachments(attachments.filter(a => a.id !== id));
        }
    };

    const toggleParticipant = (p) => {
        if (selectedParticipants.includes(p)) {
            setSelectedParticipants(selectedParticipants.filter(item => item !== p));
        } else {
            setSelectedParticipants([...selectedParticipants, p]);
        }
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        if (newLocation.trim()) {
            addLocation(newLocation);
            setFormData({ ...formData, location: newLocation });
            setNewLocation('');
        }
    };

    const handleAddParticipant = (e) => {
        e.preventDefault();
        if (newParticipant.trim()) {
            addParticipant(newParticipant);
            toggleParticipant(newParticipant);
            setNewParticipant('');
        }
    };

    const filteredParticipants = participantsList.filter(p =>
        p.toLowerCase().includes(participantSearch.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('general')}
                >
                    <Info size={16} /> Información
                </button>
                <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'participants' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('participants')}
                >
                    <Users size={16} /> Participantes
                    {selectedParticipants.length > 0 && (
                        <span className="ml-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                            {selectedParticipants.length}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attachments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('attachments')}
                >
                    <Paperclip size={16} /> Adjuntos
                    {attachments.length > 0 && (
                        <span className="ml-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                            {attachments.length}
                        </span>
                    )}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                {/* Tab Content: General */}
                {activeTab === 'general' && (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                        <div>
                            <label className="block text-sm font-medium mb-1">Asunto</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Reunión de coordinación..."
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                disabled={!isAdmin}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Fecha</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    disabled={!isAdmin}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Inicio</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                    disabled={!isAdmin}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Fin</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                    disabled={!isAdmin}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Lugar</label>
                            <div className="flex gap-2">
                                <select
                                    className="input"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    disabled={!isAdmin}
                                >
                                    <option value="" disabled>Seleccionar lugar...</option>
                                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                                {isAdmin && (
                                    <div className="flex gap-1" style={{ width: '60%' }}>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Nuevo lugar..."
                                            value={newLocation}
                                            onChange={e => setNewLocation(e.target.value)}
                                        />
                                        <button type="button" onClick={handleAddLocation} className="btn btn-secondary px-2"><Plus size={16} /></button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Descripción</label>
                            <textarea
                                className="input"
                                placeholder="Detalles adicionales del evento..."
                                rows={4}
                                style={{ resize: 'vertical', minHeight: '100px' }}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                disabled={!isAdmin}
                            />
                        </div>
                    </div>
                )}

                {/* Tab Content: Participants */}
                {activeTab === 'participants' && (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                        {isAdmin && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Agregar nuevo participante..."
                                    value={newParticipant}
                                    onChange={e => setNewParticipant(e.target.value)}
                                />
                                <button type="button" onClick={handleAddParticipant} className="btn btn-secondary px-2"><Plus size={16} /></button>
                            </div>
                        )}

                        <div>
                            <div className="relative mb-2">
                                <input
                                    type="text"
                                    className="input pl-8"
                                    placeholder="Buscar participantes..."
                                    value={participantSearch}
                                    onChange={e => setParticipantSearch(e.target.value)}
                                />
                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Users size={14} />
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-2 max-h-[300px] overflow-y-auto bg-gray-50/50">
                                {filteredParticipants.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                        {filteredParticipants.map(p => (
                                            <label
                                                key={p}
                                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${selectedParticipants.includes(p) ? 'bg-primary/5 text-primary font-medium' : 'hover:bg-gray-100'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
                                                    checked={selectedParticipants.includes(p)}
                                                    onChange={() => toggleParticipant(p)}
                                                    disabled={!isAdmin}
                                                />
                                                <span className="text-sm">{p}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 text-sm">No se encontraron participantes.</div>
                                )}
                            </div>
                        </div>

                        {selectedParticipants.length > 0 && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Seleccionados</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedParticipants.map(p => (
                                        <span key={p} className="inline-flex items-center gap-1 bg-primary text-white px-2 py-1 rounded-full text-xs animate-in zoom-in duration-150">
                                            {p}
                                            {isAdmin && (
                                                <button type="button" onClick={() => toggleParticipant(p)} className="hover:bg-white/20 rounded-full p-0.5">
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content: Attachments */}
                {activeTab === 'attachments' && (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            {attachments.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2 mb-4">
                                    {attachments.map(file => (
                                        <div key={file.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-primary/30 transition-colors group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-medium truncate" title={file.name}>{file.name}</span>
                                                    <span className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a
                                                    href={file.data}
                                                    download={file.name}
                                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                                                    title="Descargar"
                                                >
                                                    <Download size={18} />
                                                </a>
                                                {isAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAttachment(file.id)}
                                                        className="p-2 hover:bg-red-50 text-red-500 rounded-full"
                                                        title="Eliminar"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg mb-4">
                                    <div className="flex justify-center mb-2 text-gray-400">
                                        <Paperclip size={32} />
                                    </div>
                                    <p className="text-sm text-gray-500">No hay documentos adjuntos en este evento.</p>
                                </div>
                            )}

                            {isAdmin && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-center gap-3">
                                        <label className="cursor-pointer btn btn-secondary group">
                                            <Paperclip size={18} className="group-hover:rotate-12 transition-transform" />
                                            <span>Subir Documento</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            className={`btn btn-ai ${isProcessingAI ? 'opacity-70 cursor-wait' : ''}`}
                                            onClick={handleProcessAI}
                                            disabled={isProcessingAI || attachments.length === 0}
                                        >
                                            {isProcessingAI ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Analizando...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Sparkles size={18} />
                                                    <span>Procesar Importación</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {uploadError && <p className="text-red-500 text-xs text-center font-medium">{uploadError}</p>}
                                    <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">PDF, Word, Excel o Imágenes (Máx. 50MB)</p>
                                </div>
                            )}
                        </div>

                        {extractedActivities.length > 1 && (
                            <div className="mt-4 animate-in slide-in-from-bottom duration-300">
                                <label className="block text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                                    <Sparkles size={16} /> Actividades Detectadas ({extractedActivities.length})
                                </label>
                                <div className="space-y-2">
                                    {extractedActivities.map((activity, idx) => (
                                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:border-primary/50 transition-colors cursor-pointer" onClick={() => {
                                            setFormData({
                                                ...formData,
                                                title: activity.title,
                                                date: activity.date,
                                                startTime: activity.startTime,
                                                endTime: activity.endTime,
                                                description: activity.description,
                                                location: activity.location
                                            });
                                            if (activity.participants) {
                                                const validParticipants = activity.participants.filter(p => participantsList.includes(p));
                                                setSelectedParticipants(prev => [...new Set([...prev, ...validParticipants])]);
                                            }
                                            setActiveTab('general');
                                        }}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-sm">{activity.title}</span>
                                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                                                    {activity.startTime} - {activity.endTime}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-1">{activity.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 italic text-center">Haz clic en una actividad para cargar sus datos en el formulario.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    {initialEvent && isAdmin ? (
                        <button type="button" onClick={handleDelete} className="btn text-white bg-red-600 hover:bg-red-700 shadow-sm">
                            <Trash2 size={16} /> <span className="ml-1">Eliminar</span>
                        </button>
                    ) : <div></div>}

                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="btn btn-ghost">
                            {isAdmin ? 'Cancelar' : 'Cerrar'}
                        </button>
                        {isAdmin && (
                            <button type="submit" className="btn btn-primary px-8">
                                {initialEvent ? 'Actualizar Evento' : 'Crear Evento'}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};
export default EventForm;

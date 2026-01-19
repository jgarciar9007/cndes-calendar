import React, { useState, useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Paperclip, X, Download, FileText } from 'lucide-react';

const EventForm = ({ onClose, initialEvent = null }) => {
    const { addEvent, updateEvent, deleteEvent, currentDate, locations, participantsList, addLocation, addParticipant } = useCalendar();
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

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

    // Attachments State: Array of { name, size, type, data }
    const [attachments, setAttachments] = useState(initialEvent ? initialEvent.attachments || [] : []);
    const [uploadError, setUploadError] = useState('');

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

        // Limit size to 50MB (matching server limit)
        if (file.size > 50 * 1024 * 1024) {
            setUploadError('El archivo es demasiado grande (Máx. 50MB)');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Optimistic UI could be added here (loader)
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Error en la subida');

            const uploadedFile = await response.json();
            // Expected response: { id, name, size, type, data: '/uploads/filename' }

            setAttachments([...attachments, uploadedFile]);
            setUploadError('');
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError('Error al subir el archivo al servidor.');
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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            {/* Attachments Section */}
            <div>
                <label className="block text-sm font-medium mb-1">Documentos Adjuntos</label>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    {/* List */}
                    {attachments.length > 0 ? (
                        <div className="flex flex-col gap-2 mb-3">
                            {attachments.map(file => (
                                <div key={file.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText size={16} className="text-blue-500 shrink-0" />
                                        <span className="text-sm truncate" title={file.name}>{file.name}</span>
                                        <span className="text-xs text-gray-400">({Math.round(file.size / 1024)}KB)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <a
                                            href={file.data}
                                            download={file.name}
                                            className="p-1 hover:bg-gray-100 rounded text-gray-600"
                                            title="Descargar"
                                        >
                                            <Download size={16} />
                                        </a>
                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAttachment(file.id)}
                                                className="p-1 hover:bg-red-50 text-red-500 rounded"
                                                title="Eliminar"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-2 mb-2">No hay documentos adjuntos.</div>
                    )}

                    {/* Upload Input - Admin Only */}
                    {isAdmin && (
                        <div className="mt-2 text-center">
                            <label className="cursor-pointer btn btn-secondary inline-flex items-center gap-2 text-sm">
                                <Paperclip size={16} /> Agregar Documento
                                <input
                                    type="file"
                                    className="hidden"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                />
                            </label>
                            {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
                            <p className="text-xs text-gray-400 mt-1">Máx. 10MB (PDF, Word, Imágenes)</p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Participantes</label>
                {isAdmin && (
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            className="input"
                            placeholder="Nuevo participante..."
                            value={newParticipant}
                            onChange={e => setNewParticipant(e.target.value)}
                        />
                        <button type="button" onClick={handleAddParticipant} className="btn btn-secondary px-2"><Plus size={16} /></button>
                    </div>
                )}
                <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
                    {participantsList.map(p => (
                        <label key={p} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={selectedParticipants.includes(p)}
                                onChange={() => toggleParticipant(p)}
                                disabled={!isAdmin}
                            />
                            <span className={!isAdmin ? 'text-gray-500' : ''}>{p}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                {initialEvent && isAdmin ? (
                    <button type="button" onClick={handleDelete} className="btn" style={{ backgroundColor: 'var(--color-error)', color: 'white' }}>
                        <Trash2 size={16} /> <span className="ml-2">Eliminar</span>
                    </button>
                ) : <div></div>}

                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className={!isAdmin ? "btn btn-primary" : "btn btn-ghost"}>
                        {isAdmin ? 'Cancelar' : 'Cerrar'}
                    </button>
                    {isAdmin && (
                        <button type="submit" className="btn btn-primary">{initialEvent ? 'Actualizar' : 'Guardar'}</button>
                    )}
                </div>
            </div>
        </form>
    );
};
export default EventForm;

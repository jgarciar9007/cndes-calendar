import React, { useState, useRef } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { Upload, X, FileText, Sparkles, Check, AlertCircle, Loader2, ArrowRight, Clock, MapPin } from 'lucide-react';

const AgendaUploadModal = ({ onClose }) => {
    const { bulkAddEvents } = useCalendar();
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, success, error
    const [error, setError] = useState('');
    const [extractedEvents, setExtractedEvents] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
            setStatus('idle');
        } else if (selectedFile) {
            setError('Por favor, selecciona un archivo PDF válido.');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleUploadAndProcess = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Error al subir el archivo');
            const uploadedFileData = await uploadRes.json();

            setStatus('processing');
            const aiRes = await fetch('/api/ai/process-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filePath: uploadedFileData.path,
                    mimeType: file.type
                })
            });

            const data = await aiRes.json();

            if (!aiRes.ok) {
                throw new Error(data.error || 'La IA no pudo procesar este documento.');
            }

            if (data && Array.isArray(data) && data.length > 0) {
                const normalized = data.map(ev => ({
                    ...ev,
                    start: `${ev.date}T${ev.startTime || '09:00'}`,
                    end: `${ev.date}T${ev.endTime || '10:00'}`
                }));
                setExtractedEvents(normalized);
                setStatus('success');
            } else {
                throw new Error('No se detectaron actividades. Intenta con otro modelo o verifica el PDF.');
            }

        } catch (err) {
            console.error(err);
            setStatus('error');
            setError(err.message || 'Error inesperado.');
        }
    };

    const handleConfirmEvents = async () => {
        if (typeof bulkAddEvents === 'function') {
            const success = await bulkAddEvents(extractedEvents);
            if (success) onClose();
        } else {
            console.error("bulkAddEvents is not available in context");
            setError("Error interno: No se puede guardar. Contacta a soporte.");
        }
    };

    return (
        <div className="flex flex-col gap-8 max-h-[85vh]">
            {/* AI Status Header */}
            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex items-center justify-between overflow-hidden relative group shadow-2xl shadow-slate-900/20">
                <div className="relative z-10 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-500 p-1.5 rounded-lg shadow-lg shadow-primary-500/30">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary-200 opacity-90">AI Agent Powered</span>
                    </div>
                    <h3 className="text-xl font-extrabold tracking-tight">Cargar Agenda Oficial</h3>
                    <p className="text-xs text-slate-400 font-medium opacity-80">Procesando con Llama 3.3 70B • DeepSeek</p>
                </div>
                <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 pointer-events-none group-hover:scale-110">
                    <Upload size={180} />
                </div>
            </div>

            {status === 'idle' || status === 'error' ? (
                <div className="flex flex-col gap-6 animate-slideUp">
                    <div 
                        className={`group relative flex flex-col items-center justify-center py-16 px-8 border-4 border-dashed rounded-[3rem] transition-all duration-500 cursor-pointer ${
                            dragActive 
                            ? 'bg-primary-50 border-primary-500 scale-[0.98]' 
                            : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/5'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className={`p-6 rounded-[2rem] shadow-xl mb-6 transition-all duration-500 ${
                            dragActive ? 'bg-primary-600 text-white rotate-12' : 'bg-white text-slate-400 group-hover:scale-110 group-hover:rotate-6 group-hover:text-primary-600'
                        }`}>
                            <Upload size={48} strokeWidth={2.5} />
                        </div>
                        <p className={`text-lg font-black tracking-tight mb-2 ${dragActive ? 'text-primary-700' : 'text-slate-800'}`}>
                            {file ? 'Documento Seleccionado' : 'Suelte su agenda aquí'}
                        </p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center px-4">
                            {file ? file.name : 'Formatos aceptados: PDF (.pdf)'}
                        </p>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept=".pdf" 
                            onChange={(e) => handleFile(e.target.files[0])} 
                        />
                    </div>

                    {file && status === 'idle' && (
                        <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-fadeIn">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-2xl shadow-lg ring-4 ring-primary-50">
                                    <FileText size={24} />
                                </div>
                                <div className="flex flex-col min-w-0 pr-4">
                                    <span className="text-sm font-black text-slate-900 truncate">{file.name}</span>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{(file.size / 1024).toFixed(0)} KB • Listo para análisis</span>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[2rem] flex items-start gap-4 animate-fadeIn">
                            <div className="w-10 h-10 flex items-center justify-center bg-white text-red-500 rounded-xl shadow-md shrink-0">
                                <AlertCircle size={24} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">Fallo de la IA</span>
                                <p className="text-xs text-red-600 font-bold leading-relaxed">{error}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleUploadAndProcess}
                        disabled={!file}
                        className="w-full py-6 mt-4 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.25em] shadow-2xl shadow-slate-900/30 hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:scale-100 transition-all group flex items-center justify-center gap-3"
                    >
                        <span>Comenzar Extracción</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                </div>
            ) : null}

            {(status === 'uploading' || status === 'processing') && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn h-[500px]">
                    <div className="relative mb-12">
                        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-[60px] animate-pulse"></div>
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <Loader2 className="text-primary-600 animate-spin absolute" size={120} strokeWidth={1} />
                            <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center">
                                <Sparkles size={40} className="text-primary-600 animate-bounce" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="px-4 py-1.5 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full inline-block mx-auto mb-4 border border-primary-100">
                            {status === 'uploading' ? 'Transmitiendo Archivo' : 'Agente IA Procesando'}
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">
                            {status === 'uploading' ? 'Cargando Datos...' : 'Mapeando Actividades'}
                        </h4>
                        <p className="text-slate-400 text-sm max-w-[360px] font-bold mt-2 leading-relaxed opacity-80">
                            {status === 'processing' 
                                ? 'Nuestra IA está identificando horarios, lugares y participantes específicos en el documento.' 
                                : 'Estableciendo conexión segura con el clúster de agentes.'}
                        </p>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col gap-6 animate-slideUp h-[550px] overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-primary-600 text-white rounded-[1.5rem] shadow-xl shadow-primary-600/20">
                        <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl">
                            <Check size={20} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Extracción Exitosa</span>
                            <span className="text-sm font-black">{extractedEvents.length} Actividades Detectadas</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {extractedEvents.map((event, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:border-primary-600/30 transition-all hover:shadow-xl hover:shadow-slate-200/50 group relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start gap-6 mb-4">
                                    <h5 className="text-base font-black text-slate-800 leading-snug group-hover:text-primary-600 transition-colors uppercase tracking-tight">{event.title}</h5>
                                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-xl">
                                            <Clock size={12} />
                                            {event.startTime}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-primary-600/60 uppercase tracking-widest mb-4">
                                    <MapPin size={14} />
                                    {event.location || 'SIN UBICACIÓN ASIGNADA'}
                                </div>
                                
                                {event.participants && Array.isArray(event.participants) && event.participants.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-50">
                                        {event.participants.map((p, pidx) => (
                                            <span key={pidx} className="text-[9px] bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1 rounded-lg font-black uppercase tracking-tight">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-6 mt-4 border-t border-slate-100 bg-white sticky bottom-0 z-10 pb-2">
                        <button onClick={() => setStatus('idle')} className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-800 transition-all">Reintentar</button>
                        <button onClick={handleConfirmEvents} className="flex-1 py-5 bg-primary-600 text-white rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-600/30 hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <span>Sincronizar Todo</span>
                            <Check size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaUploadModal;

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LectorAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', content: '¡Hola! Soy el **Asistente de Consulta de Datos Lector**. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMessage })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.error || 'Error en la comunicación';
                const errorDetails = data.details ? ` (${data.details})` : '';
                throw new Error(errorMsg + errorDetails);
            }

            setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: `⚠️ **Error del Sistema:** ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div 
                    className={`mb-4 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-5 ${
                        isExpanded ? 'w-[80vw] h-[80vh] md:w-[600px] md:h-[700px]' : 'w-[90vw] h-[500px] md:w-[400px]'
                    }`}
                >
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <Bot className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm uppercase tracking-wider">Asistente Lector</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-primary-100 font-bold uppercase tracking-[0.1em]">En línea</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-2 hover:bg-white/10 rounded-xl text-primary-100 transition-colors hidden md:block"
                            >
                                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-xl text-primary-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                        msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-slate-400 border border-slate-100'
                                    }`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-primary-600 text-white rounded-tr-none' 
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none markdown-content'
                                    }`}>
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                table: ({node, ...props}) => (
                                                    <div className="overflow-x-auto my-3">
                                                        <table className="min-w-full border-collapse border border-slate-200" {...props} />
                                                    </div>
                                                ),
                                                th: ({node, ...props}) => <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-black text-[11px] uppercase text-slate-500" {...props} />,
                                                td: ({node, ...props}) => <td className="border border-slate-200 px-3 py-2 text-[12px]" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                        <Bot size={16} className="text-primary-600 animate-pulse" />
                                    </div>
                                    <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm">
                                        <Loader2 size={16} className="text-primary-600 animate-spin" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
                        <div className="relative flex items-center">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu consulta..."
                                className="w-full pl-6 pr-14 py-4 bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 rounded-2xl text-[13px] font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-all active:scale-95 shadow-lg shadow-primary-600/20"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-3">
                            Solo consulta de datos • Solo lectura
                        </p>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-90 group ${
                    isOpen 
                    ? 'bg-slate-900 rotate-90 text-white' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
            >
                {isOpen ? <X size={28} /> : (
                    <>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-4 border-white rounded-full animate-bounce"></div>
                        <MessageSquare size={28} className="group-hover:scale-110 transition-transform" />
                    </>
                )}
            </button>
        </div>
    );
};

export default LectorAssistant;

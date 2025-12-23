"use client";
import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Props {
    resumeData: any;
    onUpdate: (newData: any) => void; // Parent ko naya data dene ke liye function
}

const AIChat = ({ resumeData, onUpdate }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "Hi! I'm your AI Co-pilot. Tell me what to change in your resume." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. User message add karein
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            // 2. Backend ko data bhejein
            const res = await axios.post("http://127.0.0.1:8000/ai-edit", {
                resume_data: resumeData,
                user_prompt: userMsg
            });

            if (res.data.status === "success") {
                // 3. Naya data parent (BuilderPage) ko dein
                onUpdate(res.data.updated_data);
                setMessages(prev => [...prev, { role: 'ai', text: "Done! I've updated your resume layout and content." }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: "Oops! Something went wrong." }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI server." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center gap-2 font-bold"
                >
                    <Sparkles size={20} /> AI Assistant
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-8 right-8 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">

                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-yellow-400" />
                            <span className="font-bold text-sm">Resume Co-pilot</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-300"><X size={18} /></button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 text-xs rounded-xl ${m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-slate-700 rounded-bl-none shadow-sm'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex gap-2 items-center text-xs text-slate-500">
                                    <Loader2 size={14} className="animate-spin" /> Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="e.g. Make my summary more professional..."
                            className="flex-1 bg-slate-100 text-slate-800 text-xs p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChat;
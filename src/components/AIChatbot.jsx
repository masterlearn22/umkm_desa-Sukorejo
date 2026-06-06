import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ambil API Key dari .env (contoh: VITE_GEMINI_API_KEY)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const AIChatbot = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Inisialisasi pesan pertama
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: 'Halo! Saya asisten AI UMKM Desa Sukorejo. Ada yang bisa saya bantu terkait produk buah naga kami?' 
        }
      ]);
    }
  }, [isOpen]);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!API_KEY) {
        throw new Error('API Key Gemini belum diatur. Masukkan VITE_GEMINI_API_KEY di file .env Anda.');
      }

      // Siapkan konteks katalog produk UMKM agar AI mengenali produk
      const catalogContext = products.map(p => 
        `- ${p.Nama_Indo} (Rp${p.Harga_Rp.toLocaleString()}) - Kategori: ${p.Kategori}. Deskripsi: ${p.Deskripsi_Indo}`
      ).join('\n');

      const systemPrompt = `Kamu adalah Asisten AI untuk UMKM Pertanian Buah Naga di Desa Sukorejo. 
Tugasmu adalah merekomendasikan produk, menjawab pertanyaan seputar buah naga, dan bersikap ramah serta profesional.
Gunakan bahasa Indonesia yang santai dan sopan. Jangan menjawab pertanyaan di luar konteks buah naga, pertanian, atau toko ini.

Berikut adalah katalog produk kami saat ini:
${catalogContext}

Berdasarkan katalog di atas, jawab pertanyaan pelanggan berikut. Jika mereka menanyakan sesuatu yang tidak ada di katalog, beri tahu dengan sopan.`;

      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
      
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Tambahkan system prompt sebagai awalan (hanya contoh sederhana, idealnya system_instruction)
      const promptText = `${systemPrompt}\n\nPelanggan: ${userMessage}`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("AI Chatbot Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Maaf, terjadi kesalahan teknis: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Chat Melayang */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-[#ee4d2d] text-white rounded-full shadow-xl hover:bg-[#d73f22] transition-transform duration-300 transform ${isOpen ? 'scale-0' : 'scale-100'} z-50`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Jendela Chatbot */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-50 border border-stone-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 40px)' }}
      >
        {/* Header */}
        <div className="bg-[#ee4d2d] p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Bot size={24} />
            <div>
              <h3 className="font-bold text-sm">Asisten Cerdas UMKM</h3>
              <p className="text-[10px] opacity-80">Ditenagai oleh Google Gemini</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 custom-scrollbar">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-stone-800 text-white' : 'bg-green-100 text-green-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[75%] p-3 text-sm rounded-2xl ${msg.role === 'user' ? 'bg-stone-800 text-white rounded-tr-none' : 'bg-white border border-stone-200 text-stone-700 rounded-tl-none shadow-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-stone-400" />
                <span className="text-xs text-stone-500">Berpikir...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-100 flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya tentang buah naga..."
            className="flex-1 px-4 py-2 bg-stone-100 border-transparent focus:bg-white focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] rounded-full text-sm outline-none transition-all"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="p-2 bg-[#ee4d2d] text-white rounded-full hover:bg-[#d73f22] disabled:opacity-50 disabled:hover:bg-[#ee4d2d] transition-colors shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChatbot;

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Mic, Square } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ambil API Key dari .env (contoh: VITE_GEMINI_API_KEY)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const AIChatbot = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice Note states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Inisialisasi pesan pertama
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: 'Halo! Saya asisten AI UMKM Desa Sukorejo. Ada yang bisa saya bantu terkait produk buah naga kami?',
          type: 'text'
        }
      ]);
    }
  }, [isOpen]);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hentikan rekaman jika ditutup
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getSystemPrompt = () => {
    const catalogContext = products?.map(p => 
      `- ${p.Nama_Indo} (Rp${p.Harga_Rp?.toLocaleString()}) - Kategori: ${p.Kategori}. Deskripsi: ${p.Deskripsi_Indo}`
    ).join('\n') || 'Katalog belum tersedia.';

    return `Kamu adalah Asisten AI untuk UMKM Pertanian Buah Naga di Desa Sukorejo. 
Tugasmu adalah merekomendasikan produk, menjawab pertanyaan seputar buah naga, dan bersikap ramah serta profesional.
Gunakan bahasa Indonesia yang santai dan sopan. Jangan menjawab pertanyaan di luar konteks buah naga, pertanian, atau toko ini.

Berikut adalah katalog produk kami saat ini:
${catalogContext}

Berdasarkan katalog di atas, jawab pertanyaan pelanggan berikut. Jika mereka menanyakan sesuatu yang tidak ada di katalog, beri tahu dengan sopan.`;
  };

  const fileToGenerativePart = async (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          inlineData: {
            data: reader.result.split(',')[1],
            mimeType: blob.type
          }
        });
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleSendText = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, type: 'text' }]);
    setIsLoading(true);

    try {
      if (!API_KEY) throw new Error('API Key Gemini belum diatur.');

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const promptText = `${getSystemPrompt()}\n\nPelanggan: ${userMessage}`;

      const result = await model.generateContent(promptText);
      const text = result.response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text, type: 'text' }]);
    } catch (error) {
      console.error("AI Chatbot Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Maaf, terjadi kesalahan: ${error.message}`, type: 'text' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Matikan microphone
        stream.getTracks().forEach(track => track.stop());
        
        await processAudioMessage(audioBlob, audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Gagal mengakses mikrofon:", err);
      alert("Mohon izinkan akses mikrofon di browser Anda untuk menggunakan fitur pesan suara.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const processAudioMessage = async (audioBlob, audioUrl) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', audioUrl, type: 'audio' }]);

    try {
      if (!API_KEY) throw new Error('API Key Gemini belum diatur.');

      const audioPart = await fileToGenerativePart(audioBlob);
      const promptText = `${getSystemPrompt()}\n\nPelanggan mengirimkan pesan suara. Dengarkan dengan saksama dan tanggapi pertanyaannya dalam bahasa Indonesia yang ramah dan membantu.`;

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([promptText, audioPart]);
      const text = result.response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text, type: 'text' }]);
    } catch (error) {
      console.error("Voice Note Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Maaf, suara tidak dapat diproses: ${error.message}`, type: 'text' }]);
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
                {msg.type === 'audio' ? (
                  <audio controls src={msg.audioUrl} className="w-48 h-10" />
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
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
        <div className="p-3 bg-white border-t border-stone-100 flex gap-2 shrink-0 items-center">
          {isRecording ? (
            <div className="flex-1 flex items-center justify-between px-4 py-2 bg-red-50 text-red-500 rounded-full border border-red-100 animate-pulse">
              <div className="flex items-center gap-2">
                <Mic size={16} />
                <span className="text-sm font-medium">Merekam...</span>
              </div>
              <span className="text-sm font-mono">{formatDuration(recordingDuration)}</span>
            </div>
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText(e)}
              placeholder="Ketik pesan..."
              className="flex-1 px-4 py-2 bg-stone-100 border-transparent focus:bg-white focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] rounded-full text-sm outline-none transition-all"
              disabled={isLoading}
            />
          )}

          {isRecording ? (
            <button 
              onClick={stopRecording}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shrink-0"
              title="Berhenti dan Kirim"
            >
              <Square size={18} fill="currentColor" />
            </button>
          ) : input.trim() ? (
            <button 
              onClick={handleSendText} 
              disabled={isLoading}
              className="p-2 bg-[#ee4d2d] text-white rounded-full hover:bg-[#d73f22] disabled:opacity-50 transition-colors shrink-0"
            >
              <Send size={18} />
            </button>
          ) : (
            <button 
              onClick={startRecording}
              disabled={isLoading}
              className="p-2 bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 transition-colors shrink-0"
              title="Kirim Pesan Suara"
            >
              <Mic size={18} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AIChatbot;

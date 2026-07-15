import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchArticles, addArticle, updateArticle } from '../../services/api';
import { ArrowLeft, Save, Send, Image as ImageIcon, CheckCircle, Users } from 'lucide-react';
import BlockEditor from '../../components/BlockEditor';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  
  const [judul, setJudul] = useState('');
  const [penulis, setPenulis] = useState('Admin');
  const [gambar, setGambar] = useState('');
  const [status, setStatus] = useState('Draft');
  const [blocks, setBlocks] = useState([]);
  const [peersCount, setPeersCount] = useState(1);

  // Yjs Collaboration setup
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const yBlocksRef = useRef(null);
  
  // Track if the update came from local user to prevent echo
  const isLocalUpdateRef = useRef(false);

  useEffect(() => {
    const initArticle = async () => {
      if (id) {
        try {
          const data = await fetchArticles();
          const article = data.find(a => a.ID_Artikel === id);
          if (article) {
            setJudul(article.Judul || '');
            setPenulis(article.Penulis || 'Admin');
            setGambar(article.Gambar || '');
            setStatus(article.Status || 'Draft');
            
            try {
              const parsed = JSON.parse(article.Konten);
              setBlocks(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              setBlocks([{ id: Date.now().toString(), type: 'paragraph', content: article.Konten || '' }]);
            }
          }
        } catch (error) {
          console.error("Failed to load article:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setBlocks([{ id: Date.now().toString(), type: 'paragraph', content: '' }]);
      }
    };

    initArticle();
  }, [id]);

  // Initialize Yjs AFTER blocks are loaded from backend
  useEffect(() => {
    if (loading) return; // Wait until initial data is loaded
    
    const roomId = `umkm-article-${id || 'new'}`;
    const doc = new Y.Doc();
    ydocRef.current = doc;
    
    // WebrtcProvider uses public signaling servers by default
    const provider = new WebrtcProvider(roomId, doc, { password: 'umkm-secret-room' });
    providerRef.current = provider;
    
    const yBlocks = doc.getArray('blocks');
    yBlocksRef.current = yBlocks;

    // Track online users in the room
    provider.awareness.on('change', () => {
      setPeersCount(Array.from(provider.awareness.getStates().keys()).length);
    });

    // When remote peers change the Yjs array
    yBlocks.observe(() => {
      if (!isLocalUpdateRef.current) {
        setBlocks(yBlocks.toArray());
      }
    });

    // If we are the first/only one in the room, and we just loaded data from DB, seed the Yjs array
    if (yBlocks.length === 0 && blocks.length > 0) {
      isLocalUpdateRef.current = true;
      yBlocks.insert(0, blocks);
      isLocalUpdateRef.current = false;
    }

    return () => {
      provider.destroy();
      doc.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, id]);

  const handleBlocksChange = (newBlocks) => {
    setBlocks(newBlocks);
    
    // Sync to Yjs
    if (yBlocksRef.current) {
      isLocalUpdateRef.current = true;
      const yBlocks = yBlocksRef.current;
      
      // Basic sync strategy: replace all. (For complex collaborative editors, you'd calculate delta. But for this array of blocks, replacing is okay for small arrays)
      yBlocks.delete(0, yBlocks.length);
      yBlocks.insert(0, newBlocks);
      
      isLocalUpdateRef.current = false;
    }
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    const finalStatus = publish ? 'Published' : status;
    try {
      const payload = {
        judul,
        penulis,
        gambar,
        status: finalStatus,
        konten: JSON.stringify(blocks)
      };

      if (id) {
        await updateArticle({ id_artikel: id, ...payload });
      } else {
        await addArticle(payload);
      }
      
      navigate('/dashboard/articles');
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Gagal menyimpan artikel.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col min-h-screen">
      
      {/* Editor Top Navbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/articles')} className="text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="text-sm font-medium text-stone-400">
            {id ? 'Mengedit Artikel' : 'Membuat Artikel Baru'}
          </div>
          
          {/* Collaboration Badge */}
          {peersCount > 1 && (
            <div className="ml-4 flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <Users size={14} />
              {peersCount} Online
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-400 mr-2 flex items-center gap-1">
            <CheckCircle size={14} /> Auto-sync aktif
          </span>
          <button 
            onClick={() => handleSave(false)} 
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            <Save size={16} /> Simpan Draft
          </button>
          <button 
            onClick={() => handleSave(true)} 
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 shadow-sm shadow-emerald-200"
          >
            <Send size={16} /> Publish Langsung
          </button>
        </div>
      </div>

      {/* Main Content Area: Editor + Sidebar */}
      <div className="flex-1 flex overflow-hidden bg-stone-50/50">
        
        {/* Editor Canvas */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
          
          {/* Cover Image Section */}
          <div className="group relative mb-8">
            {gambar ? (
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm">
                <img src={gambar} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <input 
                    type="text" 
                    value={gambar} 
                    onChange={(e) => setGambar(e.target.value)} 
                    placeholder="Paste URL Cover baru..."
                    className="w-3/4 max-w-md px-4 py-2 rounded-lg bg-white/90 text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="h-32 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center text-stone-400 hover:bg-stone-100 hover:border-emerald-400 hover:text-emerald-600 transition-colors group-hover:bg-stone-100">
                <ImageIcon size={32} className="mb-2" />
                <input 
                  type="text" 
                  value={gambar} 
                  onChange={(e) => setGambar(e.target.value)} 
                  placeholder="Paste URL gambar cover di sini..."
                  className="bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-center w-64 placeholder-inherit text-sm"
                />
              </div>
            )}
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Judul Artikel..."
            className="w-full text-5xl font-black text-stone-900 bg-transparent outline-none placeholder-stone-300 mb-8"
          />

          {/* Block Editor */}
          <div className="min-h-[50vh]">
            <BlockEditor blocks={blocks} onChange={handleBlocksChange} />
          </div>

        </div>
      </div>

      {/* Sidebar: Table of Contents Preview */}
      <div className="hidden xl:block w-80 border-l border-stone-200 bg-white overflow-y-auto shrink-0 p-6 shadow-sm z-10">
        <div className="sticky top-0">
          <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4 flex items-center">
            Preview Daftar Isi
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Daftar isi otomatis ini akan tampil di samping artikel Anda saat diterbitkan. Gunakan blok "Heading" untuk menambahkannya.
          </p>
          
          <ul className="space-y-3">
            {blocks.filter(b => b.type === 'heading' && b.content.trim() !== '').length > 0 ? (
              blocks.filter(b => b.type === 'heading' && b.content.trim() !== '').map((heading, index) => (
                <li key={heading.id} className="text-sm font-medium text-stone-600 flex items-start">
                  <span className="text-emerald-500 mr-2">{index + 1}.</span>
                  <span className="leading-tight line-clamp-2">{heading.content}</span>
                </li>
              ))
            ) : (
              <li className="text-stone-400 text-sm italic p-4 bg-stone-50 rounded-lg border border-dashed border-stone-200">
                Belum ada sub-judul. Ketikkan sesuatu dan ubah menjadi Heading untuk melihat preview di sini.
              </li>
            )}
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ArticleEditor;

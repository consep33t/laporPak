"use client";
import { useState, useEffect } from "react";
import { getLaporan, toggleLike, addComment, toggleCommentLike, reportComment } from "@/app/actions/laporan";
import ImageCarousel from "./ImageCarousel";
import { MoreHorizontal, ThumbsUp, ThumbsDown, Flag } from "lucide-react";

export default function PublicFeed({ currentUser }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState({});
  const [activeCommentMenu, setActiveCommentMenu] = useState(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    const data = await getLaporan();
    setReports(data);
    setLoading(false);
  };

  const handleLike = async (laporanId) => {
    if (!currentUser) return;
    const res = await toggleLike(laporanId);
    if (res.success) {
      setReports((prev) =>
        prev.map((r) => {
          if (r.id === laporanId) {
            const hasLiked = r.likes.some((l) => l.userEmail === currentUser.email);
            return {
              ...r,
              likes: hasLiked
                ? r.likes.filter((l) => l.userEmail !== currentUser.email)
                : [...r.likes, { userEmail: currentUser.email }],
            };
          }
          return r;
        })
      );
    }
  };

  const handleAddComment = async (laporanId) => {
    if (!currentUser || !commentInput[laporanId]?.trim()) return;
    
    const text = commentInput[laporanId];
    const res = await addComment(laporanId, text);
    
    if (res.success) {
      setCommentInput((prev) => ({ ...prev, [laporanId]: "" }));
      fetchFeed();
    }
  };

  const handleCommentReaction = async (laporanId, commentId, isLike) => {
    if (!currentUser) return;
    const res = await toggleCommentLike(commentId, isLike);
    if (res.success) {
      fetchFeed(); // Simplest way to refresh counts and status securely
    }
    setActiveCommentMenu(null);
  };

  const handleReportComment = async (commentId) => {
    if (!currentUser) return;
    const category = window.prompt("Pilih Kategori Laporan (SARA / Pornografi / Kata Kasar / Lainnya):", "Kata Kasar");
    if (!category) return;
    const res = await reportComment(commentId, category);
    if (res.success) {
      if(typeof window !== "undefined" && window.showAlert) window.showAlert("Komentar berhasil dilaporkan untuk ditinjau oleh Admin.");
      fetchFeed();
    }
    setActiveCommentMenu(null);
  };

  if (loading) return <div className="text-center font-bold text-clayText animate-pulse py-10">Memuat Feed Publik...</div>;
  if (reports.length === 0) return <div className="text-center font-bold text-clayText py-10">Belum ada laporan publik saat ini.</div>;

  return (
    <div className="flex flex-col gap-10 w-full max-w-3xl mx-auto">
      {reports.map((r) => {
        const isLiked = r.likes.some((l) => l.userEmail === currentUser?.email);
        const displayName = r.isAnonymous ? "Hamba Allah (Anonim)" : (r.user?.fullName || r.name || "Warga");
        
        return (
          <div key={r.id} className={`shadow-clay rounded-[2rem] p-6 md:p-8 bg-clayPrimary flex flex-col gap-4 relative overflow-hidden ${r.isEmergency ? 'border-2 border-red-400' : ''}`}>
            {r.isEmergency && (
              <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-xs font-bold text-center py-1 animate-pulse">
                🚨 LAPORAN DARURAT 🚨
              </div>
            )}
            
            <div className={`flex justify-between items-start ${r.isEmergency ? 'mt-4' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl shadow-inner">
                  {r.isAnonymous ? "🕵️" : "👤"}
                </div>
                <div>
                  <p className="font-bold text-clayBlue">{displayName}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {new Date(r.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs shadow-sm">
                {r.category}
              </span>
            </div>

            <div className="mt-2">
              <h3 className="text-xl font-bold text-clayText mb-2">{r.title}</h3>
              <p className="text-gray-700 font-medium whitespace-pre-line">{r.description}</p>
            </div>

            {/* Multi-Image Carousel */}
            <div className="mt-2">
              <ImageCarousel 
                images={r.imageUrls && r.imageUrls.length > 0 ? r.imageUrls : [r.imageUrl]} 
                altText={r.title} 
              />
            </div>
            
            {r.fullAddress && (
              <p className="text-sm font-bold text-gray-500 mt-2">📍 {r.fullAddress}</p>
            )}

            <div className="flex items-center gap-4 mt-4 border-t border-gray-100 pt-4">
              <button 
                onClick={() => handleLike(r.id)}
                className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-colors shadow-sm active:scale-95 ${isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                {isLiked ? '❤️' : '🤍'} {r._count?.likes || r.likes.length} Dukungan
              </button>
              
              <span className="text-sm font-bold text-gray-500">
                💬 {r._count?.comments || r.comments.length} Komentar
              </span>
            </div>

            {/* BUBBLE CHAT COMMENT SECTION */}
            <div className="mt-4 bg-[#f0f2f5] rounded-3xl p-4 md:p-6 shadow-inner border border-gray-200">
              <div className="max-h-80 overflow-y-auto flex flex-col gap-4 mb-4 pr-2 custom-scrollbar">
                {r.comments.length === 0 ? (
                  <p className="text-xs text-center text-gray-400 font-bold italic py-4">Mulai diskusi pertama...</p>
                ) : (
                  r.comments.map(c => {
                    const isMyComment = c.userEmail === currentUser?.email;
                    const hasUserLiked = c.likes?.some(l => l.isLike === true);
                    const hasUserDisliked = c.likes?.some(l => l.isLike === false);
                    const isReported = c._count?.reports > 0;

                    return (
                      <div key={c.id} className={`flex flex-col ${isMyComment ? 'items-end' : 'items-start'} group relative`}>
                        <div className={`max-w-[85%] relative p-3 md:p-4 rounded-2xl shadow-sm ${isMyComment ? 'bg-[#dcf8c6] rounded-br-sm' : 'bg-white rounded-bl-sm'} ${isReported ? 'opacity-50 blur-[1px] hover:blur-none transition-all' : ''}`}>
                          {!isMyComment && <p className="font-bold text-xs text-clayBlue mb-1">{c.userName}</p>}
                          <p className="text-gray-800 text-sm">{c.text}</p>
                          <span className="text-[10px] text-gray-400 mt-2 block text-right">
                            {new Date(c.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        {/* Interactions under bubble */}
                        <div className={`flex items-center gap-2 mt-1 px-1 ${isMyComment ? 'justify-end' : 'justify-start'}`}>
                          <button onClick={() => setActiveCommentMenu(activeCommentMenu === c.id ? null : c.id)} className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreHorizontal size={14} />
                          </button>
                          
                          {activeCommentMenu === c.id && (
                            <div className="flex bg-white shadow-clay rounded-full px-2 py-1 gap-2 absolute top-12 z-10 animate-fade-in">
                              <button onClick={() => handleCommentReaction(r.id, c.id, true)} className={`p-1 rounded-full ${hasUserLiked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                                <ThumbsUp size={14} />
                              </button>
                              <button onClick={() => handleCommentReaction(r.id, c.id, false)} className={`p-1 rounded-full ${hasUserDisliked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                                <ThumbsDown size={14} />
                              </button>
                              {!isMyComment && (
                                <button onClick={() => handleReportComment(c.id)} className="p-1 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500">
                                  <Flag size={14} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              
              {currentUser && (
                <div className="flex gap-2 bg-white p-2 rounded-full shadow-sm border border-gray-100">
                  <input 
                    type="text"
                    placeholder="Ketik balasan..."
                    value={commentInput[r.id] || ""}
                    onChange={(e) => setCommentInput({...commentInput, [r.id]: e.target.value})}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleAddComment(r.id); }}
                    className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none font-medium"
                  />
                  <button 
                    onClick={() => handleAddComment(r.id)}
                    className="bg-clayBlue text-white font-bold p-3 rounded-full shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

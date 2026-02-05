'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from "@/lib/firebaseConfig"
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore"
import { FaTimes, FaPhoneAlt, FaEnvelope, FaTrash, FaExclamationTriangle, FaInbox, FaCheckDouble } from 'react-icons/fa'
import toast from "react-hot-toast"

export default function AdminInbox({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return;
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [isOpen]);

  // Function to mark ALL unread messages as read
  const markAllAsRead = async () => {
    const unreadMessages = messages.filter(m => m.status === 'unread');
    if (unreadMessages.length === 0) {
      toast.error("No unread messages");
      return;
    }

    const loadingToast = toast.loading("Marking all as read...");
    try {
      const batch = writeBatch(db);
      unreadMessages.forEach((msg) => {
        const docRef = doc(db, "contacts", msg.id);
        batch.update(docRef, { status: "read" });
      });
      await batch.commit();
      toast.success("All messages marked as read", { id: loadingToast });
    } catch (e) {
      toast.error("Failed to update messages", { id: loadingToast });
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const loadingToast = toast.loading("Deleting message...");
    try {
      await deleteDoc(doc(db, "contacts", confirmDelete));
      toast.success("Message deleted", { id: loadingToast });
      setConfirmDelete(null);
    } catch (e) { toast.error("Delete failed", { id: loadingToast }); }
  }

  const markRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), { status: "read" });
    } catch (e) { console.error(e); }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" />
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            
            {/* Header with Total Count Badge & Mark Read Button */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <FaInbox className="text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                  Client Inquiries
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-blue-400/30">
                    {messages.length}
                  </span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* New Mark All As Read Button */}
                {messages.some(m => m.status === 'unread') && (
                  <button 
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-full border border-slate-700 transition-all active:scale-95"
                  >
                    <FaCheckDouble size={12} />
                    Mark all as read
                  </button>
                )}
                
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                  <FaTimes size={20}/>
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <FaInbox size={50} className="mb-4" />
                  <p className="text-xl font-serif italic text-white text-center">Your inbox is currently empty</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    onClick={() => msg.status === 'unread' && markRead(msg.id)} 
                    className={`p-5 rounded-2xl border transition-all cursor-pointer group ${msg.status === 'unread' ? 'bg-blue-600/10 border-blue-500/30 shadow-lg shadow-blue-900/10' : 'bg-slate-800/40 border-slate-700/50'}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-lg">{msg.name}</h3>
                          {msg.status === 'unread' && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>}
                        </div>
                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">{msg.service || "General Inquiry"}</p>
                        <p className="text-slate-300 text-sm mt-3 leading-relaxed">"{msg.message}"</p>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <a href={`tel:${msg.phone}`} className="flex items-center gap-3 text-xs text-slate-400 hover:text-blue-400 transition-colors bg-black/20 p-2 rounded-lg" onClick={(e) => e.stopPropagation()}>
                          <FaPhoneAlt size={10}/> {msg.phone}
                        </a>
                        <a href={`mailto:${msg.email}`} className="flex items-center gap-3 text-xs text-slate-400 hover:text-blue-400 transition-colors bg-black/20 p-2 rounded-lg" onClick={(e) => e.stopPropagation()}>
                          <FaEnvelope size={10}/> <span className="truncate">{msg.email}</span>
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                       <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                         Received: {msg.createdAt?.toDate().toLocaleString()}
                       </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(msg.id); }} 
                        className="text-slate-500 hover:text-red-500 transition-all p-2 rounded-lg hover:bg-red-500/10"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Delete Confirmation Card */}
          <AnimatePresence>
            {confirmDelete && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-slate-900 border border-slate-800 p-8 rounded-3xl max-sm w-full text-center shadow-2xl">
                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <FaExclamationTriangle size={30} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-serif italic">Delete Message?</h3>
                  <p className="text-slate-400 text-xs mb-8 leading-relaxed">This action will permanently remove the inquiry from your database. You cannot undo this.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white text-xs font-bold transition-all hover:bg-slate-700">Cancel</button>
                    <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-xs font-bold transition-all hover:bg-red-500 shadow-lg shadow-red-900/20">Delete Forever</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  )
}
"use client";

import { useState, useEffect, useRef } from "react";
import { FaGoogle, FaPaperPlane, FaTimes, FaCommentDots, FaChevronLeft, FaTrashAlt, FaGhost, FaExclamationTriangle } from "react-icons/fa";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { 
  collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, 
  updateDoc, doc, setDoc, limit, deleteDoc, getDocs, writeBatch 
} from "firebase/firestore";
import toast from "react-hot-toast";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<any[]>([]); 
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  
  const [confirmData, setConfirmData] = useState<{type: 'clear' | 'delete', id?: string} | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const adminUID = process.env.NEXT_PUBLIC_ADMIN_KEY;
  const isAdmin = user?.uid === adminUID;

  //Open chat listner
  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      if (!isAdmin) setMobileView('chat');
    };

    window.addEventListener("open-chat", handleTrigger);
    return () => window.removeEventListener("open-chat", handleTrigger);
  }, [isAdmin]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.uid !== adminUID) {
        setActiveRoomId(u.uid);
        markAsRead(u.uid);
      }
    });
    return () => unsub();
  }, [adminUID]);

  useEffect(() => {
    if (!user) return;
    if (isAdmin) {
      const q = query(collection(db, "chats"), orderBy("lastTimestamp", "desc"));
      return onSnapshot(q, (snap) => {
        const roomData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setRooms(roomData);
        // FIX: Count only the number of rooms that have unread messages
        const unreadRooms = roomData.filter((r: any) => (r.unreadCountAdmin || 0) > 0).length;
        setUnreadTotal(unreadRooms);
      });
    } else {
      return onSnapshot(doc(db, "chats", user.uid), (snap) => {
        if (snap.exists()) setUnreadTotal(snap.data().unreadCountUser || 0);
      });
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!activeRoomId || !isOpen) return;
    const q = query(collection(db, "chats", activeRoomId, "messages"), orderBy("timestamp", "asc"), limit(50));
    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 100);
    });
  }, [activeRoomId, isOpen]);

  const markAsRead = async (roomId: string) => {
    try {
      const roomRef = doc(db, "chats", roomId);
      await updateDoc(roomRef, { [isAdmin ? "unreadCountAdmin" : "unreadCountUser"]: 0 });
    } catch (e) { console.error(e); }
  };

  const handleAction = async () => {
    if (!confirmData) return;
    const currentRoom = activeRoomId;

    if (confirmData.type === 'delete' && confirmData.id) {
      try {
        await deleteDoc(doc(db, "chats", confirmData.id));
        if (activeRoomId === confirmData.id) {
          setActiveRoomId(null);
          setMessages([]);
        }
        toast.success("Conversation removed");
      } catch (e) {
        toast.error("Error removing contact");
      }
    } 
    else if (confirmData.type === 'clear' && currentRoom) {
      const loading = toast.loading("Clearing chat...");
      try {
        const messagesRef = collection(db, "chats", currentRoom, "messages");
        const msgSnap = await getDocs(messagesRef);
        
        const batch = writeBatch(db);

        // 1. Delete all messages found
        msgSnap.docs.forEach((d) => batch.delete(d.ref));
        
        // 2. FIX: Use set with merge instead of update 
        // This prevents the "No document to update" error
        const roomRef = doc(db, "chats", currentRoom);
        batch.set(roomRef, { 
          lastMessage: "Conversation cleared", 
          unreadCountAdmin: 0, 
          unreadCountUser: 0,
          lastTimestamp: serverTimestamp() 
        }, { merge: true });

        await batch.commit();
        toast.success("Chat cleared", { id: loading });
      } catch (e: any) { 
        console.error("Batch Error:", e);
        toast.error("Failed to clear chat", { id: loading }); 
      }
    }
    setConfirmData(null);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !activeRoomId) return;
    const msg = input;
    setInput("");
    const roomRef = doc(db, "chats", activeRoomId);

    // Get current room unread count to increment correctly
    const currentRoom = rooms.find(r => r.id === activeRoomId);
    const currentUnread = isAdmin ? (currentRoom?.unreadCountUser || 0) : (currentRoom?.unreadCountAdmin || 0);

    await setDoc(roomRef, {
      lastMessage: msg,
      lastTimestamp: serverTimestamp(),
      [isAdmin ? "unreadCountUser" : "unreadCountAdmin"]: currentUnread + 1,
      userName: isAdmin ? "Support Team" : user.displayName,
      userPhoto: user.photoURL,
    }, { merge: true });

    await addDoc(collection(db, "chats", activeRoomId, "messages"), { 
      text: msg, 
      senderId: user.uid, 
      timestamp: serverTimestamp() 
    });
  };

  return (
    <div className="fixed bottom-4 right-6 z-[500]">
      <button onClick={() => setIsOpen(!isOpen)} className="group relative flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.4)]">
        {isOpen ? <FaTimes size={24} /> : <FaCommentDots size={26} />}
        {!isOpen && unreadTotal > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-950 animate-pulse">{unreadTotal}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 -right-4 md:right-0 w-[95vw] h-[600px] md:w-[500px] md:h-[450px] bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl">
          {!user ? (
            <div className="flex flex-col items-center justify-center w-full h-full p-10 text-center"><FaCommentDots className="text-blue-500 mb-6" size={40} /><button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-black px-8 py-4 rounded-2xl font-bold">Sign in with Google</button></div>
          ) : (
            <>
              <div className={`${isAdmin ? 'md:w-40' : 'hidden'} ${isAdmin && mobileView === 'chat' ? 'hidden' : 'flex'} flex-col bg-slate-950/40 border-r border-slate-800/50`}>
                <div className="p-6 border-b border-slate-800/50"><h4 className="text-[10px] uppercase tracking-widest text-blue-400 font-black">Contacts</h4></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {isAdmin && (rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-20 text-white p-4 text-center">
                      <FaGhost size={30} className="mb-2" />
                      <p className="text-[10px] font-serif">No active chats</p>
                    </div>
                  ) : (
                    rooms.map(room => (
                      <div key={room.id} onClick={() => { setActiveRoomId(room.id); setMobileView('chat'); markAsRead(room.id); }} className={`relative w-full p-4 flex items-center gap-3 hover:bg-white/5 cursor-pointer ${activeRoomId === room.id ? 'bg-blue-600/10' : ''}`}>
                        <img src={room.userPhoto} className="w-10 h-10 rounded-full" alt="" />
                        <div className="flex-1 text-left overflow-hidden">
                          <p className="text-white text-xs font-bold truncate">{room.userName}</p>
                          <p className="text-slate-500 text-[10px] truncate">{room.lastMessage}</p>
                        </div>
                        {/* Always visible delete button for Admin */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setConfirmData({type: 'delete', id: room.id}); }} 
                          className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <FaTrashAlt size={12} />
                        </button>
                      </div>
                    ))
                  ))}
                </div>
              </div>

              <div className={`flex-1 flex flex-col ${isAdmin && mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
                 <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                    <div className="flex items-center gap-4">
                      {isAdmin && <button onClick={() => setMobileView('list')} className="md:hidden text-slate-400"><FaChevronLeft /></button>}
                      <p className="text-white font-bold text-sm">{isAdmin ? "Admin View" : "Support Team"}</p>
                    </div>
                    {!isAdmin && messages.length > 0 && <button onClick={() => setConfirmData({type: 'clear'})} className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-2"><FaTrashAlt size={10} /> Clear Chat</button>}
                 </div>

                 <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative">
                    {messages.length === 0 ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 text-white text-center p-10">
                        <FaGhost size={40} className="mb-4" />
                        <p className="text-sm font-serif italic">{isAdmin ? "Select a contact to view history" : "Our team is here to help. Start a chat!"}</p>
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className={`flex ${m.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] ${m.senderId === user.uid ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>{m.text}</div>
                        </div>
                      ))
                    )}
                 </div>

                 <form onSubmit={sendMessage} className="p-4 bg-slate-950/50 border-t border-slate-800 flex gap-2">
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" />
                    <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 active:scale-90"><FaPaperPlane size={14} /></button>
                 </form>
              </div>

              {confirmData && (
                <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20"><FaExclamationTriangle size={30} /></div>
                    <h3 className="text-xl font-bold text-white mb-2">{confirmData.type === 'clear' ? "Clear Chat History?" : "Delete Contact?"}</h3>
                    <p className="text-slate-400 text-xs mb-8">{confirmData.type === 'clear' ? "This will permanently remove your message history." : "This will remove this user from your conversation list."}</p>
                    <div className="flex gap-3">
                      <button onClick={() => setConfirmData(null)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white text-xs font-bold transition-all hover:bg-slate-700">Cancel</button>
                      <button onClick={handleAction} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-xs font-bold transition-all hover:bg-red-500">Confirm</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
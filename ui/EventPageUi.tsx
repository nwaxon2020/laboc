'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaWhatsapp } from 'react-icons/fa'
import EventCard from '@/components/blog/EventCard'
import { db } from "@/lib/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

interface EventItem {
  id: number;
  title: string;
  description: string;
  content: string;
  mediaUrl: string;
  type: 'image' | 'video';
}

export default function EventPageUi() {
    const [pageData, setPageData] = useState<any>(null);
    const [contactPhone, setContactPhone] = useState("2347065870898");
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<EventItem | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. Fetch Page Content (Header & Events)
                const eventSnap = await getDoc(doc(db, "settings", "eventPage"));
                if (eventSnap.exists()) {
                    setPageData(eventSnap.data());
                }

                // 2. Fetch WhatsApp Contact from Dashboard Settings
                const dashSnap = await getDoc(doc(db, "settings", "dashboard"));
                if (dashSnap.exists()) {
                    // Strip non-digits for the WhatsApp link
                    const rawPhone = dashSnap.data().mobile || "2347065870898";
                    setContactPhone(rawPhone.replace(/\D/g, ''));
                }
            } catch (error) {
                console.error("Error loading events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#040d08] flex items-center justify-center">
            <div className="text-emerald-500 font-black animate-pulse tracking-widest uppercase">Initializing Gallery...</div>
        </div>
    );

    // Fallback if no data exists yet
    const events = pageData?.events || [];
    const header = pageData?.header || { title: "Laboc Events", subtitle: "Updates, Tributes, & Premium Services" };

    return (
        <main className="relative min-h-screen py-18 px-1 md:px-4 bg-[#040d08] overflow-hidden">
            
            {/* Background & Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ clipPath: 'inset(0)' }}>
                <div 
                    className="fixed inset-0 bg-center bg-cover"
                    style={{ 
                        backgroundImage: `linear-gradient(to bottom, rgba(4, 13, 8, 0.92), rgba(4, 13, 8, 0.95)), url('https://images.pexels.com/photos/1102909/pexels-photo-1102909.jpeg?cs=srgb&dl=pexels-jplenio-1102909.jpg&fm=jpg')`,
                        zIndex: -1 
                    }}
                />
                
                <motion.div 
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[5%] -left-[5%] w-[50%] h-[50%] bg-emerald-950/20 blur-[150px] rounded-full"
                />

                <motion.div 
                    animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-green-900/10 blur-[120px] rounded-full"
                />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <header className="mb-16 text-center">
                    <h1 className="text-2xl md:text-4xl font-black text-white my-4 italic uppercase tracking-tighter">
                        {header.title.split(' ')[0]} <span className="text-amber-600">{header.title.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-emerald-500/60 font-medium tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs">
                        {header.subtitle}
                    </p>
                </header>

                {/* DYNAMIC MAPPING FROM FIRESTORE */}
                <div className="px-1 md:px-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
                    {events.map((post: EventItem, idx: number) => (
                        <div key={post.id || idx} className="cursor-pointer my-3 md:my-6 relative group">
                            <EventCard 
                                item={post} 
                                onViewMore={() => setSelectedPost(post)} 
                            />
                            {post.type === 'image' && (
                                <button 
                                    onClick={() => setFullScreenImage(post.mediaUrl)}
                                    className="absolute top-4 left-4 z-10 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                                >
                                    <FaTimes size={12} className="rotate-45" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-20 text-emerald-900 font-bold uppercase tracking-widest">
                        No events found. Check back soon.
                    </div>
                )}
            </div>

            {/* View More Modal */}
            <AnimatePresence>
                {selectedPost && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 md:p-4"
                >
                    <div className="bg-[#08120c] w-full max-w-6xl h-[90vh] overflow-y-auto rounded-md border border-white/5 relative flex flex-col md:flex-row shadow-2xl">
                    <button 
                        onClick={() => setSelectedPost(null)}
                        className="absolute top-6 right-6 z-20 bg-white text-black p-2 rounded-full hover:bg-amber-600 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>

                    <div className="w-full md:w-[60%] h-[350px] md:h-auto bg-black flex items-center justify-center">
                        {selectedPost.type === 'video' ? (
                        <video src={selectedPost.mediaUrl} controls autoPlay className="w-full h-full object-contain" />
                        ) : (
                        <img 
                            src={selectedPost.mediaUrl} 
                            alt={selectedPost.title} 
                            className="w-full h-full object-contain cursor-zoom-in" 
                            onClick={() => setFullScreenImage(selectedPost.mediaUrl)}
                        />
                        )}
                    </div>

                    <div className="w-full md:w-[40%] p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5">
                        <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-8 uppercase italic tracking-tighter leading-none">
                        {selectedPost.title}
                        </h2>
                        <p className="text-white/60 leading-relaxed mb-8 font-medium">
                        {selectedPost.content}
                        </p>

                        <a
                        href={`https://wa.me/${contactPhone}?text=Hello Labock, I am inquiring about your services, because I saw your event: *${selectedPost.title}*`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-700 text-white p-4 md:px-8 md:py-5 rounded-lg md:rounded-2xl font-black uppercase tracking-widest text-center flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-xl shadow-green-900/20"
                        >
                        <FaWhatsapp size={28} />
                        Inquire on WhatsApp
                        </a>
                    </div>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            {/* Full Screen Image Zoom */}
            <AnimatePresence>
                {fullScreenImage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setFullScreenImage(null)}
                    className="fixed inset-0 z-[600] bg-black/98 flex items-center justify-center cursor-zoom-out p-4"
                >
                    <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
                    <FaTimes size={30} />
                    </button>
                    <img 
                    src={fullScreenImage} 
                    className="max-w-full max-h-full object-contain rounded-sm shadow-2xl" 
                    alt="Full screen preview"
                    />
                </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
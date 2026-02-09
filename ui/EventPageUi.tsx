'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaWhatsapp } from 'react-icons/fa'
import EventCard from '@/components/blog/EventCard'

// Renamed interface to EventItem to avoid conflict with the Component name
interface EventItem {
  id: number;
  title: string;
  description: string;
  content: string;
  mediaUrl: string;
  type: 'image' | 'video';
}

const EVENT_POSTS: EventItem[] = [
  {
    id: 1,
    title: "The Diplomatic Procession",
    description: "Experience the grandeur of our state-of-the-art diplomatic convoy services for elite farewells.",
    content: "Our diplomatic convoy features professional outriders, luxury hearses, and a coordinated motorcade designed to provide the highest level of respect.",
    type: 'video',
    mediaUrl: '/video2.mp4',
  },
  {
    id: 2,
    title: "Handcrafted Mahogany Caskets",
    description: "Pure wood, velvet interior. Crafted specifically for comfort and long-lasting honor.",
    content: "Crafted from premium mahogany, these caskets represent the pinnacle of craftsmanship.",
    type: 'image',
    mediaUrl: '/service3.jpeg',
  },
  {
    id: 3,
    title: "Our New Office Location",
    description: "Visit our new state-of-the-art office in Sagamu for all your pre-planning needs.",
    content: "We have officially moved! Our new space is designed to provide a serene and comfortable environment.",
    type: 'video',
    mediaUrl: '/video1.mp4',
  },
  {
    id: 4,
    title: "The Royal Black Casket",
    description: "A symbol of strength and dignity. Hand-polished for a mirror finish.",
    content: "Our signature black casket collection offers unmatched elegance.",
    type: 'image',
    mediaUrl: '/service5.jpeg',
  },
  {
    id: 5,
    title: "Artisanal Woodwork",
    description: "Carefully selected grains, hand-finished for a natural and peaceful look.",
    content: "We take pride in the details, ensuring every piece reflects the legacy of your loved ones.",
    type: 'video',
    mediaUrl: '/video3.mp4',
  },
  {
    id: 6,
    title: "Handcrafted Mahogany Caskets",
    description: "Pure wood, velvet interior. Crafted specifically for comfort and long-lasting honor.",
    content: "Crafted from premium mahogany, these caskets represent the pinnacle of craftsmanship.",
    type: 'image',
    mediaUrl: '/services1.jpeg',
  },
  {
    id: 7,
    title: "Our New Office Location",
    description: "Visit our new state-of-the-art office in Sagamu for all your pre-planning needs.",
    content: "We have officially moved! Our new space is designed to provide a serene and comfortable environment.",
    type: 'image',
    mediaUrl: '/service2.jpeg',
  },
  {
    id: 8,
    title: "The Royal Black Casket",
    description: "A symbol of strength and dignity. Hand-polished for a mirror finish.",
    content: "Our signature black casket collection offers unmatched elegance.",
    type: 'video',
    mediaUrl: '/video4.mp4',
  },
]

export default function EventPageUi() {
    const [selectedPost, setSelectedPost] = useState<EventItem | null>(null)
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)

    return (
        <main className="relative min-h-screen py-18 px-1 md:px-4 bg-[#040d08] overflow-hidden">
        
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
                Laboc <span className="text-amber-600">Events</span>
            </h1>
            <p className="text-emerald-500/60 font-medium tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs">
                Updates, Tributes, & Premium Services
            </p>
            </header>

            {/* MAPPING EVENTS HERE */}
            <div className="px-1 md:px-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
            {EVENT_POSTS.map((post) => (
                <div key={post.id} className="cursor-pointer my-3 md:my-6 relative group">
                {/* Now using EventCard correctly */}
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
        </div>

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
                    href={`https://wa.me/2347065870898?text=Hello Labock, I am inquiring about your services, cause I saw your  *${selectedPost.title}* activity`}
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
                alt="Full screen product"
                />
            </motion.div>
            )}
        </AnimatePresence>
        </main>
    )
}
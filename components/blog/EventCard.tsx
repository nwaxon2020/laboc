'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface EventItem {
  id: number;
  title: string;
  description: string;
  content: string;
  mediaUrl: string;
  type: 'image' | 'video';
}

interface EventCardProps {
  item: EventItem;
  onViewMore: () => void;
}

export default function EventCard({ item, onViewMore }: EventCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          entry.isIntersecting ? videoRef.current.play() : videoRef.current.pause();
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#05110a] border border-emerald-900/30 rounded md:rounded-xl overflow-hidden shadow-2xl group flex flex-col h-full hover:border-emerald-500/40 transition-all duration-500"
    >
      {/* Media Section */}
      <div className="relative h-48 md:h-60 overflow-hidden bg-black">
        {item.type === 'video' ? (
          <video
            ref={videoRef}
            src={item.mediaUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          />
        ) : (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        )}

        {/* Subtle Green Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05110a] via-transparent to-transparent opacity-60" />
      </div>

      {/* Content Section */}
      <div className="p-2 pt-1 md:p-4 md:pt-2 flex flex-col flex-grow relative">
        <h3 className="font-black text-sm md:text-base text-white mb-2 tracking-tight group-hover:text-emerald-400 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-xs md:text-sm text-emerald-500 text-sm line-clamp-3 mb-2 leading-relaxed font-medium">
          {item.description}
        </p>

        <button 
          onClick={onViewMore}
          className="cursor-pointer text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] underline underline-offset-8 hover:text-white transition-all w-fit mb-2"
        >
          View More
        </button>
      </div>
    </motion.div>
  )
}
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa' // Ensure this is imported

interface BlogItem {
  id: number;
  title: string;
  description: string;
  content: string;
  mediaUrl: string;
  type: 'image' | 'video'; // Strict typing
  price?: number;
}

interface BlogCardProps {
  item: BlogItem;
  onViewMore: () => void;
}

export default function BlogCard({ item, onViewMore }: BlogCardProps) {
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
      className="bg-gray-950 border border-gray-900 rounded md:rounded-xl overflow-hidden shadow-2xl group flex flex-col h-full"
    >
      {/* Media Section */}
      <div className="relative h-64 overflow-hidden bg-black">
        {item.type === 'video' ? (
          <video
            ref={videoRef}
            src={item.mediaUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          />
        ) : (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
          />
        )}
        
        {item.price && (
          <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-1 rounded-full font-black text-xs shadow-lg z-10">
            ₦{item.price.toLocaleString()}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-white mb-3 tracking-tight">{item.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
          {item.description}
        </p>

        <button 
          onClick={onViewMore}
          className="text-amber-500 text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:text-amber-400 transition-colors w-fit mb-6"
        >
          View More
        </button>

        <div className="mt-auto">
          <a
            href={`https://wa.me/2347065870898?text=I am interested in ${item.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white text-black py-3 rounded-xl font-black text-sm hover:bg-green-600 hover:text-white transition-all duration-300 group/btn"
          >
            <FaWhatsapp size={20} className="text-green-600 group-hover/btn:text-white transition-colors" />
            CONTACT US
          </a>
        </div>
      </div>
    </motion.div>
  )
}
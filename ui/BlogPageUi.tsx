'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaWhatsapp, FaSearch } from 'react-icons/fa'
import BlogCard from '@/components/blog/BlogCard'
import { db } from "@/lib/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

interface BlogItem {
  id: number;
  title: string;
  description: string;
  content: string;
  mediaUrl: string;
  type: 'image';
  price?: number;
}

export default function BlogPageUi() {
  const [selectedPost, setSelectedPost] = useState<BlogItem | null>(null)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [pageData, setPageData] = useState<any>(null)
  const [contactPhone, setContactPhone] = useState("2347065870898")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const marketSnap = await getDoc(doc(db, "settings", "marketPage"));
        if (marketSnap.exists()) setPageData(marketSnap.data());

        const dashSnap = await getDoc(doc(db, "settings", "dashboard"));
        if (dashSnap.exists()) {
          const rawPhone = dashSnap.data().mobile || "2347065870898";
          setContactPhone(rawPhone.replace(/\D/g, ''));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  // ✅ Real-time Search Logic
  const filteredProducts = useMemo(() => {
    const products = pageData?.items || [];
    if (!searchQuery.trim()) return products;
    
    return products.filter((item: BlogItem) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, pageData]);

  // ✅ Reset Search when interacting
  const handleInteraction = (post: BlogItem | null = null) => {
    setSearchQuery(""); 
    if (post) setSelectedPost(post);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-amber-500 font-black animate-pulse uppercase tracking-widest">Loading Market...</div>
    </div>
  );

  const header = pageData?.header || { title: "Laboc Market Place", subtitle: "Updates, Tributes, & Premium Services" };

  return (
    <main className="bg-black min-h-screen pt-6 pb-18 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* ✅ SEARCH INPUT */}
        <div className="max-w-3xl relative mx-auto group mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search products by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-2 rounded-xl outline-none focus:border-amber-600 transition-all shadow-2xl"
          />
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-2xl md:text-4xl font-black text-white my-4 italic uppercase">
            {header.title.split(' ')[0]} <span className="text-amber-600">{header.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-blue-400 font-medium tracking-widest uppercase text-xs mb-8">
            {header.subtitle}
          </p>
        </header>

        {/* MAPPING FILTERED PRODUCTS */}
        <div className="cursor-pointer px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((post: any) => (
            <div key={post.id} className="relative group">
              <BlogCard 
                item={post} 
                onViewMore={() => handleInteraction(post)} 
              />
              {post.type === 'image' && (
                <button 
                  onClick={() => setFullScreenImage(post.mediaUrl)}
                  className="absolute top-4 left-4 z-10 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-600 italic">No products match "{searchQuery}"</div>
        )}
      </div>

      {/* 1. PRODUCT DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 md:p-4"
          >
            <div className="bg-gray-900 w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-lg md:rounded-[2.5rem] border border-gray-800 relative flex flex-col md:flex-row shadow-2xl">
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-20 bg-white text-black p-2 rounded-full hover:bg-amber-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>

              <div className="w-full md:w-[60%] h-[350px] md:h-auto bg-black flex items-center justify-center">
                <img 
                  src={selectedPost.mediaUrl} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-contain cursor-zoom-in" 
                  onClick={() => setFullScreenImage(selectedPost.mediaUrl)}
                />
              </div>

              <div className="w-full md:w-[40%] p-6 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-800">
                {selectedPost.price && (
                    <span className="text-amber-600 font-black text-2xl mb-2">₦{selectedPost.price.toLocaleString()}</span>
                )}
                <h2 className="text-xl md:text-3xl font-black text-white mb-4 md:mb-8 uppercase italic tracking-tighter leading-none">
                  {selectedPost.title}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 md:mb-12">
                  {selectedPost.content}
                </p>

                <a
                  href={`https://wa.me/${contactPhone}?text=Hello Laboc, I am interested in: *${selectedPost.title}* (₦${selectedPost.price?.toLocaleString()})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleInteraction()}
                  className="bg-green-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-center flex items-center justify-center gap-4 hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                >
                  <FaWhatsapp size={28} />
                  Inquire on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LIGHTBOX */}
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
            <img src={fullScreenImage} className="max-w-full max-h-full object-contain rounded-sm shadow-2xl" alt="Full screen" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
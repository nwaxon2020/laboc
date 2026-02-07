'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaWhatsapp } from 'react-icons/fa'
import BlogCard from '@/components/blog/BlogCard'

// Define the Interface here to match the Card
interface BlogItem {
  id: number;
  title: string;
  description: string;
  content: string;
  mediaUrl: string;
  type: 'image' | 'video';
  price?: number;
}

const BLOG_POSTS: BlogItem[] = [
  {
    id: 1,
    title: "The Diplomatic Procession",
    description: "Experience the grandeur of our state-of-the-art diplomatic convoy services for elite farewells.",
    content: "Our diplomatic convoy features professional outriders, luxury hearses, and a coordinated motorcade designed to provide the highest level of respect. We ensure that the final journey is as prestigious as the life lived.",
    type: 'video',
    mediaUrl: '/video2.mp4',
    price: 0,
  },
  {
    id: 2,
    title: "Handcrafted Mahogany Caskets",
    description: "Pure wood, velvet interior. Crafted specifically for comfort and long-lasting honor.",
    content: "Crafted from premium mahogany, these caskets represent the pinnacle of craftsmanship. Each unit features gold-plated handles and premium satin bedding.",
    type: 'image',
    mediaUrl: 'https://trustedcaskets.com/cdn/shop/files/whitecrosscasket.jpg?v=1703728523&width=533',
    price: 1200000,
  },
  {
    id: 3,
    title: "Our New Office Location",
    description: "Visit our new state-of-the-art office in Sagamu for all your pre-planning needs.",
    content: "We have officially moved! Our new space is designed to provide a serene and comfortable environment for families to discuss arrangements with our counselors.",
    type: 'image',
    mediaUrl: 'https://westellafunerals.com.au/volumes/images/Coffins/_1500xAUTO_scale_center-center_70_none/Rosewood-Casket-017.webp',
    price: 1200000,
  },

  {
    id: 4,
    title: "Our New Office Location",
    description: "Visit our new state-of-the-art office in Sagamu for all your pre-planning needs.",
    content: "We have officially moved! Our new space is designed to provide a serene and comfortable environment for families to discuss arrangements with our counselors.",
    type: 'image',
    mediaUrl: 'https://www.thefuneraloutlet.com/wp-content/uploads/2019/09/ab1286_devotion_black_gold_open.jpg',
    price: 1690000,
  },
  
  {
    id: 5,
    title: "Handcrafted Mahogany Caskets",
    description: "Pure wood, velvet interior. Crafted specifically for comfort and long-lasting honor.",
    content: "Crafted from premium mahogany, these caskets represent the pinnacle of craftsmanship. Each unit features gold-plated handles and premium satin bedding.",
    type: 'image',
    mediaUrl: 'https://fullcirclefunerals.co.uk/wp-content/uploads/2025/08/Mahogany-square.jpg',
    price: 1200000,
  },

  {
    id: 6,
    title: "The Diplomatic Procession",
    description: "Experience the grandeur of our state-of-the-art diplomatic convoy services for elite farewells.",
    content: "Our diplomatic convoy features professional outriders, luxury hearses, and a coordinated motorcade designed to provide the highest level of respect. We ensure that the final journey is as prestigious as the life lived.",
    type: 'video',
    mediaUrl: '/video1.mp4',
    price: 0,
  },
  
  {
    id: 7,
    title: "The Diplomatic Procession",
    description: "Experience the grandeur of our state-of-the-art diplomatic convoy services for elite farewells.",
    content: "Our diplomatic convoy features professional outriders, luxury hearses, and a coordinated motorcade designed to provide the highest level of respect. We ensure that the final journey is as prestigious as the life lived.",
    type: 'image',
    mediaUrl: '/service5.jpeg',
    price: 0,
  },
  {
    id: 8,
    title: "Handcrafted Mahogany Caskets",
    description: "Pure wood, velvet interior. Crafted specifically for comfort and long-lasting honor.",
    content: "Crafted from premium mahogany, these caskets represent the pinnacle of craftsmanship. Each unit features gold-plated handles and premium satin bedding.",
    type: 'image',
    mediaUrl: 'https://www.colourfulcoffins.com/images/Adult%20Metal%20American%20Casket%20Designs/med/ac1395_devotion_roses_black.jpg',
    price: 1200000,
  },
  {
    id: 9,
    title: "Our New Office Location",
    description: "Visit our new state-of-the-art office in Sagamu for all your pre-planning needs.",
    content: "We have officially moved! Our new space is designed to provide a serene and comfortable environment for families to discuss arrangements with our counselors.",
    type: 'image',
    mediaUrl: 'https://tonymontefunerals.com.au/wp-content/uploads/2021/08/Calvary-Veneer-0001.jpeg',
  },
]

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogItem | null>(null)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)

  return (
    <main className="bg-black min-h-screen py-18 px-4">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 italic uppercase">
            Labock <span className="text-amber-600">Journal</span>
          </h1>
          <p className="text-blue-400 font-medium tracking-widest uppercase text-xs">
            Updates, Tributes, & Premium Services
          </p>
        </header>

        <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="relative group">
              <BlogCard 
                item={post} 
                onViewMore={() => setSelectedPost(post)} 
              />
              {/* Quick Expand Button for Images */}
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
            {/* Increased max-width to 6xl for bigger desktop view */}
            <div className="bg-gray-900 w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-lg md:rounded-[2.5rem] border border-gray-800 relative flex flex-col md:flex-row shadow-2xl">
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-20 bg-white text-black p-2 rounded-full hover:bg-amber-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>

              {/* Media Section - Increased to 60% width on desktop for "Big" feel */}
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

              {/* Content Section */}
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
                  href={`https://wa.me/2341234567890?text=Hello Labock, I am inquiring about: ${selectedPost.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
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

      {/* 2. FULL IMAGE LIGHTBOX (Triggered by clicking image) */}
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
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const services = [
   {
    title: "Horse-Drawn Carriage",
    desc: "Traditional and majestic funeral processions with our classic horse and carriage.",
    images: [
      "image.png",
      "https://f2m2news.com.ng/wp-content/uploads/2023/10/IMG-20231020-WA0018.jpg",
      "https://alexis.lindaikejisblog.com/photos/shares/ro_1686981503.jpg"
    ],
    mobileHeight: "h-[250px]",
    changeInterval: 8500, // 5.5 seconds
    startDelay: 4000, // Starts rotating 4s after page load
  },

  {
    title: "Undertaker Hearse",
    desc: "Strong undertakers, a fleet of luxury vehicles ensuring a dignified final journey.",
    images: [
      "/service2.jpeg",
      "/service3.jpeg",
      "/service4.jpeg"
    ],
    mobileHeight: "h-[250px]",
    changeInterval: 10000, // 6 seconds
    startDelay: 2000, // Starts rotating 2s after page load
  },

  {
    title: "Premium Caskets",
    desc: "A wide selection of handcrafted wood and metal caskets tailored to your preference.",
    images: [
      "https://skycaskets.com/wp-content/uploads/2013/10/fores-green-oversize-31.jpg",
      "https://www.shutterstock.com/image-photo/wooden-coffin-stands-black-hearse-600nw-2424946017.jpg",
      "https://tse3.mm.bing.net/th/id/OIP.ogiPoX949gnpWEdOezhyRgHaIG?rs=1&pid=ImgDetMain&o=7&rm=3"
    ],
    mobileHeight: "h-[260px]",
    changeInterval: 9000, // 5 seconds
    startDelay: 0,
  },
  
];

// Updated Slider with Delay and Interval Logic
const CardImageSlider = ({ images, interval, delay }: { images: string[], interval: number, delay: number }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Initial delay before starting the rotation cycle
    const initialTimeout = setTimeout(() => {
      if (!isPaused) {
        timer = setInterval(() => {
          setIndex((prev) => (prev + 1) % images.length);
        }, interval);
      }
    }, delay);

    // Cleanup function
    return () => {
      clearTimeout(initialTimeout);
      if (timer) clearInterval(timer);
    };
  }, [images, interval, delay, isPaused]); // All dependencies are now stable

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
};

export default function ServicesPageUi() {
  return (
    <section className="py-12 md:py-24 bg-white text-slate-900 overflow-hidden" id="services">
      <div className="container mx-auto px-2 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            Honoring Life with <span className="text-blue-600 italic font-light"><br /> Dignity</span>
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8 max-w-6xl mx-auto items-end">
          {services.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative cursor-pointer overflow-hidden rounded-lg md:rounded-[2.5rem] shadow-xl bg-slate-200 
                ${index === 2 ? "col-span-2 md:col-span-1" : "col-span-1"} 
                ${item.mobileHeight} md:h-[500px]`}
            >
              <CardImageSlider 
                images={item.images} 
                interval={item.changeInterval} 
                delay={item.startDelay} 
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80" />

              <div className="absolute bottom-0 w-full p-4 md:p-8">
                <motion.div layout className="w-8 h-1 bg-blue-500 mb-3 rounded-full group-hover:w-16 transition-all" />
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
                <p className="text-slate-300 text-[11px] md:text-sm mb-4 line-clamp-2">{item.desc}</p>
                <Link href="/services" className="inline-flex items-center gap-2 text-blue-400 font-bold text-[10px] md:text-xs uppercase tracking-widest group-hover:text-white transition-colors">
                  Explore Service <FaArrowRight className="text-[8px] transform -rotate-45 group-hover:rotate-0 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
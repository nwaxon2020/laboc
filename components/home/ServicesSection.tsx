"use client";

import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const services = [
  {
    title: "Premium Caskets",
    desc: "A wide selection of handcrafted wood and metal caskets tailored to your preference.",
    img: "service5.jpeg", 
  },

  {
    title: "Modern Hearse",
    desc: "A fleet of luxury vehicles ensuring a dignified final journey.",
    img: "/service2.jpeg",
  },

   {
    title: "Horse-Drawn Carriage",
    desc: "Traditional and majestic funeral processions with our classic horse and carriage.",
    img: "image.png",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-12 md:py-24 bg-white text-slate-900 overflow-hidden" id="services">
      <div className="container mx-auto px-1.5 md:px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            Honoring Life with <span className="text-blue-600 italic font-light"><br /> Dignity</span>
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-xl mx-auto font-medium text-xs md:text-base leading-relaxed px-4">
            Providing professional funeral services to help you honor your loved ones exactly as they would have wished.
          </p>
        </div>

        {/* MOBILE LOGIC: 
            - grid-cols-2: allows two cards per row.
            - [&>*:last-child]:col-span-2: finds the 3rd card and makes it full width.
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-8 max-w-6xl mx-auto">
          {services.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative cursor-pointer overflow-hidden rounded-lg md:rounded-3xl shadow-lg bg-slate-100 
                ${index === 2 ? "col-span-2 lg:col-span-1 h-[280px] md:h-[450px]" : "h-[220px] md:h-[450px]"}`}
            >
              {/* Background Image */}
              <img 
                src={item.img} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />

              {/* The "Smart" Blue Transparent Card */}
              <div className="absolute bottom-0 w-full">
                <div className="backdrop-blur-xs md:backdrop-blur-sm bg-blue-900/30 md:bg-blue-900/70 border-t border-white/10 p-3 md:p-5 transition-all duration-300 group-hover:bg-blue-600/20 hover:backdrop-blur-xs">
                  
                  {/* Small blue accent line */}
                  <div className="w-6 h-0.5 bg-blue-400 mb-2 rounded-full group-hover:bg-white transition-all" />
                  
                  <h3 className="text-sm md:text-xl font-bold text-white mb-1 tracking-wide leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/70 text-[10px] md:text-[13px] leading-tight mb-1 md:mb-3 line-clamp-2 md:line-clamp-none">
                    {item.desc}
                  </p>

                  <Link 
                    href="/blog" 
                    className="inline-flex items-center gap-1.5 text-blue-300 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em] group-hover:text-white transition-colors"
                  >
                    Learn More <FaArrowRight className="text-[7px] transform -rotate-45 group-hover:rotate-0 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Thin Border Highlight */}
              <div className="absolute inset-0 border border-white/5 rounded-2xl md:rounded-3xl pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
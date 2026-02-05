"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export default function LegacySection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 }); // Lowered amount for better mobile trigger

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isInView) {
        video.play().catch((err) => console.warn("Video blocked:", err));
      } else {
        video.pause();
      }
    }
  }, [isInView]);

  const steps = [
    { title: "Consultation", desc: "Understanding the unique life of your loved one.", step: "01" },
    { title: "Preparation", desc: "Expert care with the highest standards of respect.", step: "02" },
    { title: "Procession", desc: "Majestic journeys via hearse or carriage.", step: "03" }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 md:py-16 bg-white overflow-hidden"
    >
      <div className="container mx-auto md:px-6">
        <div className="flex flex-col lg:flex-row items-stretch md:rounded-xl overflow-hidden shadow-2xl border border-slate-100 min-h-[600px] lg:h-[70vh]">
          
          {/* Brand Tag - Adjusted for mobile position */}
          <p className="absolute z-30 p-4 text-white text-xs md:text-base">
            <span className="bg-black p-1 rounded text-red-500 font-black">Laboc</span> Funeral Services
          </p>
          
          {/* Left Side: Video (Visible on all screens) */}
          <div className="h-[350px] lg:h-auto lg:w-1/2 relative bg-slate-900 overflow-hidden">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
              <source src="/video1.mp4" type="video/mp4" />
            </video>
            
            {/* Gradient Overlay - Fixed for vertical flow on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-blue-900/80 lg:via-transparent lg:to-transparent flex items-end p-6 lg:p-12">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                className="text-white text-xl lg:text-3xl font-serif italic max-w-xs md:max-w-sm"
              >
                "A legacy that lives on in the hearts of many."
              </motion.h3>
            </div>
          </div>

          {/* Right Side: Process */}
          <div className="lg:w-1/2 bg-slate-50 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-slate-900 mb-6 md:mb-8">
              Every Detail, <span className="text-blue-600">Thoughtfully Planned.</span>
            </h2>
            
            <div className="space-y-5 md:space-y-8">
              {steps.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="grid grid-cols-[40px_1fr] md:grid-cols-[50px_1fr] items-start gap-3 md:gap-4"
                >
                  <span className="text-3xl md:text-4xl font-black text-blue-200 leading-none">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 text-xs md:text-sm leading-snug">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
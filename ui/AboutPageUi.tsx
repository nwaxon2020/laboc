"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaHeart, FaShieldAlt, FaHandsHelping } from "react-icons/fa";

export default function AboutPageUi() {
  // Array of 3 background images
  const heroImages = [
    "https://ggsc.s3.us-west-2.amazonaws.com/assets/images/what_can_we_learn_from_the_worlds_most_peaceful_societies_-_abcdef_-_0a21b39134b316e51cdc0dd96c5e6bca3c0093e9_-_abcdef_-_c3aa4369bd53794b17dba2719890b56de8809755.webp", 
    "https://www.quietkarma.org/wp-content/uploads/2018/12/world-peace-vs-inner-peace.jpg",
    "https://thumbs.dreamstime.com/b/word-peace-written-white-letters-body-water-water-appears-to-be-calm-serene-sun-setting-401987715.jpg"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section with BG Logic */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }} // Maintained your original 20% opacity
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[index]})` }}
            />
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            A Legacy of <span className="text-blue-500 italic">Compassion</span>
          </motion.h1>
          <p className="text-amber-300 max-w-2xl mx-auto text-lg">
            Serving communities nationwide with dignity, honor, and professional care for over a decade.
          </p>
        </div>
      </section>

      {/* CEO Section */}
      <section className="pt-2 pb-20 md:py-20 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-600/20 rounded-lg md:rounded-2xl scale-95 group-hover:scale-100 transition-transform" />
              <img 
                src="/ceo1.png" 
                alt="CEO Laboc Funeral Services" 
                className="relative rounded-2xl shadow-2xl w-full h-auto md:h-[500px] object-cover"
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <h4 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Leadership</h4>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">A Message From Our CEO</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              "At Laboc, we believe every life has a story that deserves to be told with honor. Our mission isn't just about services; it's about supporting families during their most difficult moments with a shoulder they can lean on."
            </p>
            <div className="border-l-4 border-blue-600 pl-6 italic text-slate-500">
              <p className="font-bold text-slate-900 not-italic">Hon. [CEO Name]</p>
              <div className="flex flex-col">
                <a href="tel:07065870898" className="text-xs hover:font-semibold tracking-widest">+2347065870898</a> 
                <a href="mailto:@labocfuneralservices@gmail.com" className="text-xs text-blue-600 hover:text-blue-800 hover:font-semibold tracking-widest">labocfuneralservices@gmail.com</a></div>
              <p>Founder & Managing Director</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <FaHeart />, title: "Compassion", desc: "We treat every family as our own, with deep empathy." },
            { icon: <FaShieldAlt />, title: "Integrity", desc: "Transparent pricing and honest professional advice." },
            { icon: <FaHandsHelping />, title: "Excellence", desc: "Providing world-class funeral arrangements in Nigeria." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-3xl mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About 2 */}
      <section id="about" className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-[0.03] pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border-[40px] border-blue-600" />
        </div>

        <div className="container mx-auto p-3 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.3em] bg-blue-100 text-blue-700 rounded-full">
                Our Legacy
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                About Laboc <br /> 
                <span className="text-blue-600 italic font-light">Funeral Services</span>
              </h2>
              
              <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
                <p>
                  For over 15 years, <span className="font-bold text-slate-800">Laboc Funeral Services</span> has been a pillar of support for families Nationwide. 
                </p>
                <p>
                  Founded in 2011 by the Laboc family, we understand that every family is unique, and every life deserves to be celebrated.
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                {[
                  { label: "Years of Service", value: "15+" },
                  { label: "Families Served", value: "5000+" },
                  { label: "Emergency Support", value: "24/7" },
                  { label: "Satisfaction", value: "100%" }
                ].map((stat, i) => (
                  <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="text-xl font-black text-blue-600">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="relative z-10 bg-blue-600/20 p-3 md:p-6 rounded-[1rem] shadow-2xl border border-slate-100">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100">
                    <img src="/service6.jpeg" alt="Caskets" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100 mt-4 md:mt-8">
                    <img src="/service5.jpeg" alt="Horse Carriage" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100 -mt-4 md:-mt-8">
                    <img src="/service2.jpeg" alt="Modern Hearse" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100">
                    <img src="/service3.jpeg" alt="Laboc Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
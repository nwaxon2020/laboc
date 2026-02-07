"use client";

import { motion } from "framer-motion";
import { FaHeart, FaShieldAlt, FaHandsHelping } from "react-icons/fa";

export default function AboutPageUi() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            A Legacy of <span className="text-blue-500 italic">Compassion</span>
          </motion.h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Serving the Sagamu community with dignity, honor, and professional care for over a decade.
          </p>
        </div>
        <div className="absolute inset-0 opacity-20 bg-[url('/funeral-bg.jpg')] bg-cover bg-center" />
      </section>

      {/* CEO Section */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-600/10 rounded-lg md:rounded-2xl scale-95 group-hover:scale-100 transition-transform" />
              {/* REPLACE '/ceo.jpg' with your actual CEO image path */}
              <img 
                src="/ceo1.png" 
                alt="CEO Laboc Funeral Services" 
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
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
        
        {/* Decorative Background Watermark */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-[0.03] pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border-[40px] border-blue-600" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT SIDE: TEXT CONTENT */}
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
                  Our commitment to compassionate care has made us a trusted name in funeral services.
                </p>

                <p>
                  Founded in 2011 by the Laboc family, we understand that every family is unique, and every life deserves to be
                  celebrated in a meaningful way. Our experienced team is dedicated to guiding you through every step of the process
                  with empathy and professionalism.
                </p>

                <p>
                  We believe in providing affordable, dignified funeral services that honor your loved one's memory while respecting
                  your family's wishes and budget.
                </p>
              </div>
              
              {/* Stats Grid */}
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
            
            {/* RIGHT SIDE: 4-IMAGE GRID HOLDER */}
            <div className="relative order-1 lg:order-2">
              {/* The Main Large Rounded Container */}
              <div className="relative z-10 bg-blue-600/20 p-3 md:p-6 rounded-[1rem] shadow-2xl border border-slate-100">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  
                  {/* Image 1: Top Left */}
                  <div className="rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100">
                    <img src="/service6.jpeg" alt="Caskets" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* Image 2: Top Right */}
                  <div className="rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100 mt-4 md:mt-8">
                    <img src="/service5.jpeg" alt="Horse Carriage" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* Image 3: Bottom Left */}
                  <div className="rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100 -mt-4 md:-mt-8">
                    <img src="/service2.jpeg" alt="Modern Hearse" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* Image 4: Bottom Right */}
                  <div className="rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100">
                    <img src="/service3.jpeg" alt="Laboc Logo" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>

                </div>

                {/* Centered Floating Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20">
                  <div className="text-center">
                    <div className="text-sm md:text-lg font-black leading-none">15</div>
                    <div className="text-[8px] uppercase font-bold">Years</div>
                  </div>
                </div>
              </div>

              {/* Outer Accent Glows */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
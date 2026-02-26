'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PriceList from '@/components/services/PriceList';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaTag, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface Service {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  icon: string;
}

function ServicesContent() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isPriceListOpen, setIsPriceListOpen] = useState(true);
  const [pageData, setPageData] = useState<any>(null);
  const [contact, setContact] = useState({ mobile: '', whatsappMsg: '' });
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchAllData = async () => {
      const pageSnap = await getDoc(doc(db, "settings", "servicePage"));
      if (pageSnap.exists()) setPageData(pageSnap.data());

      const contactSnap = await getDoc(doc(db, "settings", "dashboard"));
      if (contactSnap.exists()) {
        const cData = contactSnap.data();
        setContact({
          mobile: cData.mobile || '2347065870898',
          whatsappMsg: cData.whatsappMsg || 'Hello, I would like to inquire about your services.'
        });
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    if (pageData?.services) {
      const serviceFromUrl = searchParams.get('service');
      if (serviceFromUrl) {
        const found = pageData.services.find((s: any) => s.title === serviceFromUrl);
        if (found) setSelectedService(found);
      }
    }
  }, [searchParams, pageData]);

  const handleWhatsApp = (customMsg?: string) => {
    const cleanPhone = contact.mobile.replace(/\D/g, '');
    const msg = encodeURIComponent(customMsg || contact.whatsappMsg);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  if (!pageData) return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-bold">Loading Services...</div>;

  return (
    <section id="services" className="pt-24 pb-20 bg-[#f8f9fa] relative min-h-screen">
      
      {/* --- FULL SCREEN OVERLAY FOR DETAILS --- */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-0 md:p-10 bg-black/80 backdrop-blur-xl"
          >
            {/* Close Button - Responsive Position */}
            <button 
              onClick={() => setSelectedService(null)} 
              className="fixed top-4 right-4 md:top-8 md:right-8 z-[1001] p-4 bg-white/10 hover:bg-red-500 text-white rounded-full transition-all shadow-2xl border border-white/20"
            >
              <FaTimes size={24} />
            </button>

            {/* Centered Content Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              // ✅ Desktop: Smart height (max-80vh), independent scroll on text. Mobile: h-full.
              className="bg-white md:rounded-xl shadow-2xl w-full md:max-w-4xl h-full md:h-auto md:max-h-[80vh] flex flex-col md:flex-row relative overflow-hidden"
            >
              {/* Image Section */}
              <div className="w-full md:w-5/12 min-h-[45vh] md:h-auto sticky top-0 md:relative">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent md:hidden" />
              </div>

              {/* Text Content Section - ✅ Independent scroll for desktop */}
              <div className="w-full md:w-7/12 p-6 md:p-10 bg-white flex flex-col overflow-y-auto">
                <div className="flex items-center gap-4 mb-4 pt-4">
                  <span className="text-4xl md:text-5xl">{selectedService.icon}</span>
                  <h3 className="text-2xl md:text-3xl font-serif font-black text-slate-900 tracking-tight leading-none">
                    {selectedService.title}
                  </h3>
                </div>
                
                <div className="h-1 w-16 bg-amber-600 mb-6 rounded-full" />
                
                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                  {selectedService.longDescription}
                </p>

                {/* ✅ Buttons: flex-row for Desktop, flex-col for Mobile */}
                <div className="mt-8 flex flex-col md:flex-row gap-3 pb-10 md:pb-0">
                    <button 
                      onClick={() => handleWhatsApp(`I am inquiring about ${selectedService.title}`)}
                      className="flex-1 px-6 py-4 bg-[#25D366] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#128C7E] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95"
                    >
                      <FaWhatsapp size={18} /> WhatsApp
                    </button>
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="flex-1 px-6 py-4 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                    >
                      Back
                    </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-6xl">
        {/* Dynamic Header Section */}
        <div className="px-4 flex flex-col md:flex-row justify-between items-center mb-16 text-center md:text-left gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tighter">
              {pageData.header?.title.split(' ')[0]} <span className="text-amber-600 underline decoration-slate-200 underline-offset-8">{pageData.header?.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-slate-600 max-w-lg font-medium">{pageData.header?.description}</p>
          </div>
          <button 
            onClick={() => handleWhatsApp()}
            className="px-8 py-4 bg-[#25D366] text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-[#128C7E] shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
          >
            <FaWhatsapp size={18}/> Contact Us
          </button>
        </div>

        {/* Pricing List Container */}
        <div className="mb-16 border border-slate-100 md:rounded-3xl overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setIsPriceListOpen(!isPriceListOpen)}
            className="w-full p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 group transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 text-2xl shadow-inner"><FaTag /></div>
              <div className="text-left">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-amber-700 transition-colors">Service Quotations</h3>
                <p className="text-slate-500 text-sm font-medium">Transparent pricing for hearses, decor, and more.</p>
              </div>
            </div>
            <div className={`p-3 rounded-full bg-slate-100 transition-transform duration-500 ${isPriceListOpen ? 'rotate-180 bg-amber-600 text-black' : ''}`}><FaChevronDown /></div>
          </button>

          <AnimatePresence>
            {isPriceListOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }} 
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="p-2 md:p-6 bg-slate-50/50">
                  <PriceList />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pageData.services?.map((service: any, index: number) => (
            <div 
              key={index}
              onClick={() => setSelectedService(service)}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="p-4">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{service.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 font-medium">{service.description}</p>
                <div className="text-amber-600 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  Learn More <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPageUi() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-bold">Initializing Laboc Services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
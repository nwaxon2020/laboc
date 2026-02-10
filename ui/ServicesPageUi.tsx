'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PriceList from '@/components/services/PriceList';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaTag } from 'react-icons/fa';
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
      // 1. Fetch Service Page Content
      const pageSnap = await getDoc(doc(db, "settings", "servicePage"));
      if (pageSnap.exists()) setPageData(pageSnap.data());

      // 2. Fetch Admin Contact Settings
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

  // Handle URL Service Selection on Load
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

  if (!pageData) return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">Loading Services...</div>;

  return (
    <section id="services" className="py-20 bg-[#f8f9fa]">
      <div className="container mx-auto max-w-6xl">
        
        {/* Dynamic Header Section */}
        <div className="px-4 flex flex-col md:flex-row justify-between items-center mb-16 text-center md:text-left gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {pageData.header?.title.split(' ')[0]} <span className="border-b-4 border-amber-600">{pageData.header?.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-slate-600 max-w-lg">{pageData.header?.description}</p>
          </div>
          <button 
            onClick={() => handleWhatsApp()}
            className="px-8 py-3 bg-[#25D366] text-white font-medium rounded-full hover:bg-[#128C7E] shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            Contact Us (WhatsApp)
          </button>
        </div>

        {/* Details Section */}
        <AnimatePresence>
          {selectedService && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-12 bg-black/95 md:rounded-2xl shadow-2xl border-y-2 md:border-2 border-amber-200 flex flex-col md:flex-row gap-8 overflow-hidden"
            > 
              <div className="w-full md:w-1/3">
                <img src={selectedService.image} alt={selectedService.title} className="w-full h-64 md:h-full object-cover" />
              </div>
              <div className="p-6 md:p-8 w-full md:w-2/3 relative">
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className='flex gap-4 mb-4 items-center'>
                  <span className="text-3xl">{selectedService.icon}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-200">{selectedService.title}</h3>
                </div>
                <p className="md:text-lg text-slate-300 leading-relaxed italic">{selectedService.longDescription}</p>
                <button 
                  onClick={() => handleWhatsApp(`I am inquiring about ${selectedService.title}`)}
                  className="mt-6 text-amber-400 font-bold hover:underline"
                >
                  Inquire about {selectedService.title} →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing List Container */}
        <div className="mb-16 border border-slate-100 md:rounded-2xl overflow-hidden bg-white">
          <button 
            onClick={() => setIsPriceListOpen(!isPriceListOpen)}
            className="w-full p-4 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><FaTag /></div>
              <div className="text-left">
                <h3 className="md:text-xl font-bold text-slate-900 group-hover:text-amber-700">View Detailed Service Quotations</h3>
                <p className="text-slate-500 text-xs md:text-sm">Explore our transparent pricing for hearses, decor, and more.</p>
              </div>
            </div>
            <div className={`p-2 rounded-full bg-slate-100 transition-transform ${isPriceListOpen ? 'rotate-180' : ''}`}><FaChevronDown /></div>
          </button>

          <AnimatePresence>
            {isPriceListOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-100">
                <PriceList />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pageData.services?.map((service: any, index: number) => (
            <div 
              key={index}
              onClick={() => setSelectedService(service)}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-4 pb-6">
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-2 line-clamp-3">{service.description}</p>
                <div className="text-amber-700 font-semibold">Learn More →</div>
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
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">Loading Services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PriceList from '@/components/services/PriceList';
import { motion, AnimatePresence } from 'framer-motion'; // Added for toggle animation
import { FaChevronDown, FaTag } from 'react-icons/fa'; // Added for UI icons

interface Service {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  icon: string;
}

function ServicesContent() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isPriceListOpen, setIsPriceListOpen] = useState(true); // Toggle state
  const searchParams = useSearchParams();

  const services: Service[] = useMemo(() => [
    {
      title: 'Traditional Funerals',
      description: 'Complete funeral services with visitation, ceremony, and burial or cremation options.',
      longDescription: 'Our traditional services provide a dignified and structured way to honor your loved ones. This includes professional preparation, viewing arrangements, a formal ceremony at our chapel or your place of worship, and coordinated transportation to the final resting place with the utmost care.',
      image: '/service3.jpeg',
      icon: '🎗️'
    },
    {
      title: 'Cremation Services',
      description: 'Respectful cremation options with memorial services and urn selection assistance.',
      longDescription: 'We offer dignified cremation paths ranging from direct cremation to full memorial services. Our staff assists with choosing high-quality urns and planning ceremonies that celebrate life in a personalized way that fits your family’s needs.',
      image: 'https://lirp.cdn-website.com/bbae4094/dms3rep/multi/opt/cremation+services+in+Whiteland-+IN-7f98cf09-640w.jpg',
      icon: '⚱️'
    },
    {
      title: 'Pre-Planning',
      description: 'Plan ahead to relieve your family of difficult decisions during times of grief.',
      longDescription: 'Pre-planning is a gift of love to your family. It ensures your final wishes are documented and honored, while protecting your loved ones from the emotional and financial stress of making difficult decisions during a time of loss.',
      image: 'https://emergencyresponseafrica.com/wp-content/uploads/2025/03/slider-2-1024x352.jpg',
      icon: '📋'
    },
    {
      title: 'Grief Support',
      description: 'Counseling and support groups to help families through the grieving process.',
      longDescription: 'Healing is a journey. Labock Funeral Services provides access to professional grief counselors and local support groups to help you and your family navigate the complex emotions of bereavement with compassion.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb3r51deGVcrdznCCc1JCfez7K2x0U0w0CbQ&s',
      icon: '🤝'
    },
    {
      title: 'Transportation',
      description: 'Local and long-distance transportation services with dignity and care.',
      longDescription: 'Our professional fleet is maintained to the highest standards. We handle all logistics, including international repatriation or local transfer, with the absolute punctuality and respect your family deserves.',
      image: 'service5.jpeg',
      icon: '🚗'
    },
    {
      title: 'Memorial Products',
      description: 'Quality caskets, urns, memorial stones, and keepsakes for remembrance.',
      longDescription: 'Choose from our curated collection of high-grade wood and metal caskets, handcrafted urns, and custom-engraved monuments designed to create a lasting tribute for generations to come.',
      image: 'https://skycaskets.com/wp-content/uploads/2013/10/fores-green-oversize-31.jpg',
      icon: '💎'
    },
    {
      title: 'Diplomatic Convoy',
      description: 'Professional motorcade and escort services for dignified processions.',
      longDescription: 'Our Diplomatic Convoy service provides a high-profile, orderly motorcade to accompany the deceased. This includes professional outriders, lead vehicles, and coordinated traffic management to ensure the procession moves with the prestige and solemnity it deserves.',
      image: 'https://static.wixstatic.com/media/24add2_858147c4849c492bb8d18dd374080f24~mv2.png/v1/fill/w_640,h_400,al_c,lg_1,q_85,enc_avif,quality_auto/24add2_858147c4849c492bb8d18dd374080f24~mv2.png',
      icon: '🚔'
    },
    {
      title: 'Floral & Venue Decor',
      description: 'Exquisite floral arrangements and professional venue setup for a peaceful atmosphere.',
      longDescription: 'We transform chapels and gravesides into spaces of beauty and peace. From custom floral wreaths and sprays to elegant drapery and seating arrangements, our decor team ensures the environment reflects the personality and legacy of your loved one.',
      image: 'https://i.pinimg.com/736x/23/c7/b7/23c7b75840b4760f2afbaeac48fd6555.jpg',
      icon: '💐'
    },
  ], []);

  useEffect(() => {
    const serviceFromUrl = searchParams.get('service');
    if (serviceFromUrl) {
      const found = services.find(s => s.title === serviceFromUrl);
      if (found) {
        setSelectedService(found);
        const section = document.getElementById("services");
        if (section) {
          section.scrollIntoView({ behavior: 'auto' });
        }
      }
    }
  }, [searchParams, services]);

  const handleWhatsApp = () => {
    window.open('https://wa.me/2347065870898?text=Hello, I would like to inquire about your services.', '_blank');
  };

  return (
    <section id="services" className="py-20 bg-[#f8f9fa]">
      <div className="container mx-auto max-w-6xl">
        
        <div className="px-4 flex flex-col md:flex-row justify-between items-center mb-16 text-center md:text-left gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              Our <span className="border-b-4 border-amber-600">Services</span>
            </h2>
            <p className="text-slate-600 max-w-lg">
              At Labock Funeral Services, we believe every farewell should be dignified, not expensive. Our transparent pricing ensures you can honor your loved one with grace.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleWhatsApp}
              className="px-8 py-3 bg-[#25D366] text-white font-medium rounded-full hover:bg-[#128C7E] shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              Contact Us (WhatsApp)
            </button>
          </div>
        </div>

        {/* Details Section (Mobile Friendly & Instant Open) */}
        {selectedService && (
          <div className="mb-12 bg-black/95 md:rounded-2xl shadow-2xl border-y-2 md:border-2 border-amber-200 flex flex-col md:flex-row gap-8 animate-in fade-in zoom-in duration-300"> 
            <div className="p-1 w-full md:w-1/3">
              <div className='md:hidden p-6 flex justify-center md:justify-start items-end'>
                <span className="text-3xl">{selectedService.icon}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-200 ml-2">{selectedService.title}</h3>
              </div>

              <img 
                src={selectedService.image} 
                alt={selectedService.title} 
                className="w-full h-64 md:h-74 object-cover md:rounded-2xl"
              />
            </div>
            <div className="p-6 md:p-8 w-full md:w-2/3 relative">
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute -top-6 right-2 md:top-4 md:right-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className='hidden md:flex gap-4 mb-4 items-center'>
                <span className="text-3xl">{selectedService.icon}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-200">{selectedService.title}</h3>
              </div>
              
              <p className="md:text-lg text-slate-300 leading-relaxed italic">
                {selectedService.longDescription}
              </p>
              <button 
                onClick={() => window.open(`https://wa.me/2347065870898?text=I am inquiring about ${selectedService.title}`, '_blank')}
                className="mt-6 text-amber-400 font-bold hover:underline flex items-center gap-2"
              >
                Inquire about {selectedService.title} →
              </button>
            </div>
          </div>
        )}

        {/* --- DYNAMIC PRICE LIST TOGGLE --- */}
        <div className="mb-16 border border-slate-100 md:rounded-2xl overflow-hidden">
          <button 
            onClick={() => setIsPriceListOpen(!isPriceListOpen)}
            className="w-full bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <FaTag />
              </div>
              <div className="text-left">
                <h3 className="md:text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  View Detailed Service Quotations
                </h3>
                <p className="text-slate-500 text-xs md:text-sm">Click to explore our transparent pricing for hearses, decor, and more.</p>
              </div>
            </div>
            <div className={`p-2 rounded-full bg-slate-100 text-slate-400 transition-transform duration-300 ${isPriceListOpen ? 'rotate-180' : ''}`}>
              <FaChevronDown />
            </div>
          </button>

          <AnimatePresence>
            {isPriceListOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div id={"price-list"} className="-mt-5 border-t border-slate-100">
                  <PriceList />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* --- END PRICE LIST TOGGLE --- */}
        
        <div className="px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div 
              key={index}
              onClick={() => {
                setSelectedService(service);
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-4 pb-6">
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-2 line-clamp-3">
                  {service.description}
                </p>
                <div className="text-amber-700 font-semibold inline-flex items-center gap-2">
                  Learn More <span>→</span>
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
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-slate-400">Loading Services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
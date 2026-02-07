"use client";

import React, { useState, useEffect } from 'react';

interface Service {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  icon: string;
}

export default function ServicesPageUi() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
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
  ];

  // LOGIC: Listen for Footer Clicks
  useEffect(() => {
    const handleFooterClick = (event: any) => {
      const serviceTitle = event.detail;
      const found = services.find(s => s.title === serviceTitle);
      if (found) {
        setSelectedService(found);
        // Scroll to the detail div area
        const section = document.getElementById("services");
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener("open-service-from-footer", handleFooterClick);
    return () => window.removeEventListener("open-service-from-footer", handleFooterClick);
  }, [services]);

  const handleWhatsApp = () => {
    window.open('https://wa.me/1234567890?text=Hello, I would like to inquire about your services.', '_blank');
  };

  return (
    <section id="services" className="py-20 bg-[#f8f9fa] transition-all duration-500">
      <div className="container mx-auto max-w-6xl">
        
        {/* Navigation & Header Area */}
        <div className="px-4 flex flex-col md:flex-row justify-between items-center mb-16 text-center md:text-left gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              Our <span className="border-b-4 border-amber-600">Services</span>
            </h2>
            <p className="text-slate-600 max-w-lg">
              At Labock Funeral Services, we honor every life with a commitment to dignity, tradition, and compassion.
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

        {/* Details Section */}
        {selectedService && (
          <div className="mb-12 bg-black/90 md:rounded-2xl md:p-4 shadow-2xl border-y-2 md:border-2 border-amber-200 flex flex-col md:flex-row gap-8 animate-in fade-in zoom-in duration-300">
            <div className="p-1 w-full md:w-1/3">
              <img 
                src={selectedService.image} 
                alt={selectedService.title} 
                className="w-full h-74 object-cover rounded-2xl shadow-md"
              />
            </div>
            <div className="p-4 w-full md:w-2/3 relative">
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-0 right-0 p-2 text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Close details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-4xl mb-4 block">{selectedService.icon}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-400 mb-4">{selectedService.title}</h3>
              <p className="md:text-lg text-slate-100 leading-relaxed italic">
                {selectedService.longDescription}
              </p>
              <button 
                onClick={() => window.open(`https://wa.me/1234567890?text=I am inquiring about ${selectedService.title}`, '_blank')}
                className="mt-6 text-amber-400 font-bold hover:underline flex items-center gap-2"
              >
                Inquire about {selectedService.title} →
              </button>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div 
              key={index}
              onClick={() => {
                setSelectedService(service);
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="p-3 md:p-4 pb-6">
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-2 line-clamp-3">
                  {service.description}
                </p>
                <div className="text-amber-700 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
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
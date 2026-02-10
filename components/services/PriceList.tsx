'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaHorse, FaUsers, FaAsterisk, FaCamera, FaLeaf, FaPhone } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface PriceItem {
  name: string;
  price: string;
  note?: string;
}

interface PriceCategory {
  category: string;
  icon: React.ReactNode;
  description?: string;
  items: PriceItem[];
}

const PRICE_DATA: PriceCategory[] = [
  {
    category: "Hearse Services",
    icon: <FaCar className="text-amber-500" />,
    description: "Swing bar of fixed rail or plastic handles",
    items: [
      { name: "Mercedes Benz E-Class Prestige", price: "₦400,000" },
      { name: "Mercedes Benz E-Class Royal", price: "₦300,000" },
      { name: "Mercedes Benz E-Class Classic", price: "₦170,000" },
      { name: "Mercedes Benz R-Class 4matic Space Wagon", price: "₦180,000" },
      { name: "Limousine Cadillac", price: "₦400,000" },
      { name: "Escalade (Senior)", price: "₦200,000" },
      { name: "Escalade (Small)", price: "₦120,000" },
      { name: "Lincoln Navigator", price: "₦150,000" },
      { name: "Toyota Sienna Space Wagon / E-Class Wagon", price: "₦100,000" },
    ]
  },
  {
    category: "Horse Carriage",
    icon: <FaHorse className="text-amber-500" />,
    items: [
      { name: "Imported Carriage", price: "₦700,000" },
      { name: "Local Carriage", price: "₦250,000" },
    ]
  },
  {
    category: "Pall Bearers & Band",
    icon: <FaUsers className="text-amber-500" />,
    description: "Transportation inclusive",
    items: [
      { name: "Pall Bearers and Bandboys or Horns Men", price: "₦250,000" },
    ]
  },
  {
    category: "Lying-In-State Decoration",
    icon: <FaAsterisk className="text-amber-500" />,
    items: [
      { name: "Indoor with Artificial Flowers", price: "₦300,000" },
      { name: "Outdoor with Artificial Flowers", price: "₦200,000" },
      { name: "Water Lying-In-State", price: "₦230,000" },
      { name: "Fresh Flowers Decoration", price: "By Request", note: "Based on specific flower choices" },
    ]
  },
  {
    category: "Wreaths",
    icon: <FaLeaf className="text-amber-500" />,
    items: [
      { name: "Small Wreath", price: "₦40,000 each" },
      { name: "Large Wreath", price: "₦50,000 each" },
      { name: "Custom DAD/MUM Wreath", price: "₦60,000 each" },
    ]
  },
  {
    category: "Photography & Media",
    icon: <FaCamera className="text-amber-500" />,
    description: "Wake-keep & Funeral Coverage",
    items: [
      { name: "Photography & Video with Drone", price: "₦300,000", note: "Includes Photobook and DVD" },
    ]
  }
];

export default function PriceList() {
  const router = useRouter();

  // Function to clear URL parameters
  const clearUrlParams = () => {
    router.replace('/services', { scroll: false });
  };

  // Function to scroll to specific category
  const scrollToCategory = (categoryName: string) => {
    // Find the category element
    const categoryElement = document.getElementById(`category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Check if there's a URL parameter for price list category
    const urlParams = new URLSearchParams(window.location.search);
    const priceCategory = urlParams.get('price-category');
    
    if (priceCategory) {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        scrollToCategory(priceCategory);
        // Clear the price-category param after scrolling
        clearUrlParams();
      }, 300);
    }
  }, []);

  return (
    <section className="py-8 pb-15 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-2 md:px-4 max-w-5xl">
        
        {/* Pricing Grid */}
        <div className="space-y-8">
          {PRICE_DATA.map((section, idx) => (
            <motion.div 
              key={idx}
              id={`category-${section.category.toLowerCase().replace(/\s+/g, '-')}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
                  {section.icon}
                </div>
                <div>
                  <h3 className="md:text-xl font-bold text-slate-800 uppercase tracking-tight">
                    {section.category}
                  </h3>
                  {section.description && (
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="p-2 md:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50">
                        <th className="px-2 md:px-4 py-3 font-bold">Service Item</th>
                        <th className="px-2 md:px-4 py-3 font-bold text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {section.items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-2 md:px-4 py-4">
                            <p className="text-sm md:text-base font-semibold text-slate-700 group-hover:text-amber-700 transition-colors">
                              {item.name}
                            </p>
                            {item.note && (
                              <p className="text-xs text-slate-400 mt-1">{item.note}</p>
                            )}
                          </td>
                          <td className="px-2 md:px-4 py-4 text-right">
                            <span className="text-sm md:text-base font-black text-slate-900 bg-amber-50 px-3 py-1 rounded-lg">
                              {item.price}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 md:p-8 bg-amber-600 rounded-lg md:rounded-3xl text-white text-center shadow-xl shadow-amber-900/10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] mb-2">Important Notice</p>
          <p className="md:text-lg font-medium italic">
            *** PLEASE NOTE THAT THIS QUOTE COVERS FOR ONE (1) DAY ***
          </p>
          <div className='mx-auto max-w-xl flex flex-col md:flex-row justify-center items-center md:gap-6'>
            <button 
              onClick={() => window.dispatchEvent(new Event("open-chat"))}
              className="w-full mt-6 md:mt-3 bg-white text-amber-700 px-8 py-3 rounded-xl md:rounded-full font-bold hover:bg-slate-100 transition-colors"
            >
              Inquire for Custom Dates
            </button>
            
            <button className='w-full mx-auto flex justify-center gap-2 items-center mt-3 bg-white text-amber-700 px-8 py-3 rounded-xl md:rounded-full font-bold hover:bg-slate-100 transition-colors'>
              <a href="tel:">Call Us Today....</a>
              <FaPhone className="text-amber-500" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
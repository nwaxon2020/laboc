'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaHorse, FaUsers, FaAsterisk, FaCamera, FaLeaf, FaPhone, FaTag } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// ✅ 1. ICON MAPPING (Matches your Editor logic)
const iconMap: { [key: string]: React.ReactNode } = {
  "Car": <FaCar className="text-amber-500" />,
  "Horse": <FaHorse className="text-amber-500" />,
  "Users": <FaUsers className="text-amber-500" />,
  "Decoration": <FaAsterisk className="text-amber-500" />,
  "Wreath": <FaLeaf className="text-amber-500" />,
  "Camera": <FaCamera className="text-amber-500" />,
  "Default": <FaTag className="text-amber-500" />
};

export default function PriceList() {
  const router = useRouter();
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [adminPhone, setAdminPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 2. FETCH PRICING DATA
        const servicePageRef = doc(db, "settings", "servicePage");
        const serviceSnap = await getDoc(servicePageRef);
        
        if (serviceSnap.exists()) {
          setPricingData(serviceSnap.data().pricing || []);
        }

        // ✅ 3. FETCH ADMIN CONTACT
        const dashboardRef = doc(db, "settings", "dashboard");
        const dashSnap = await getDoc(dashboardRef);
        if (dashSnap.exists()) {
          setAdminPhone(dashSnap.data().mobile || "");
        }
      } catch (error) {
        console.error("Error fetching price list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll logic for URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const priceCategory = urlParams.get('price-category');
    
    if (priceCategory && !loading) {
      setTimeout(() => {
        const id = `category-${priceCategory.toLowerCase().replace(/\s+/g, '-')}`;
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          router.replace('/services', { scroll: false });
        }
      }, 500);
    }
  }, [loading, router]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 animate-pulse font-bold tracking-widest">LOADING PRICE LIST...</div>;
  }

  return (
    <section className="py-8 pb-15 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-2 md:px-4 max-w-5xl">
        
        {/* Pricing Grid */}
        <div className="space-y-8">
          {pricingData.map((section: any, idx: number) => (
            <motion.div 
              key={idx}
              id={`category-${section.category.toLowerCase().replace(/\s+/g, '-')}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
                  {/* ✅ Dynamic Icon from Map */}
                  {iconMap[section.icon] || iconMap["Default"]}
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
                      {section.items?.map((item: any, itemIdx: number) => (
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
            
            <a 
              href={`tel:${adminPhone}`}
              className='w-full mx-auto flex justify-center gap-2 items-center mt-3 bg-white text-amber-700 px-8 py-3 rounded-xl md:rounded-full font-bold hover:bg-slate-100 transition-colors'
            >
              Call Us Today....
              <FaPhone className="text-amber-500" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
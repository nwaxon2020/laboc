"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { FaHeart, FaShieldAlt, FaHandsHelping, FaAward, FaUsers, FaBriefcase, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ICON_MAP: any = {
  heart: <FaHeart />,
  shield: <FaShieldAlt />,
  hands: <FaHandsHelping />,
  award: <FaAward />,
  users: <FaUsers />,
  briefcase: <FaBriefcase />
};

export default function AboutPageUi() {
  const [data, setData] = useState<any>(null);
  const [adminContact, setAdminContact] = useState<any>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", "aboutPolicyPage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data().about);
        }

        const dashSnap = await getDoc(doc(db, "settings", "dashboard"));
        if (dashSnap.exists()) {
          setAdminContact(dashSnap.data());
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data?.heroImages?.length > 0) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % data.heroImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [data]);

  if (!data) return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="text-blue-600 font-black animate-pulse uppercase tracking-widest">Loading...</div>
    </div>
  );

  // Phone processing logic for the dial link
  const rawMobile = adminContact?.mobile || "2347065870898";
  const cleanMobile = rawMobile.replace(/\D/g, '');

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${data.heroImages[index]})` }}
            />
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            {data.heroTitle.split(data.sections?.hero?.highlightWord).map((part: string, i: number, arr: any) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`${data.sections?.hero?.highlightColor || 'text-blue-500'} italic`}>
                    {data.sections?.hero?.highlightWord}
                  </span>
                )}
              </span>
            ))}
          </motion.h1>
          <p className="text-amber-300 max-w-2xl mx-auto text-lg">
            {data.heroSubtitle}
          </p>
        </div>
      </section>

      {/* CEO Section */}
      <section className="pt-2 pb-20 md:py-20 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-600/20 rounded-lg md:rounded-2xl scale-95 group-hover:scale-100 transition-transform" />
              <img src={data.ceoImage} alt="CEO" className="relative rounded-2xl shadow-2xl w-full h-auto md:h-[500px] object-cover" />
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-1/2">
            <h4 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">{data.sections?.ceo?.sectionLabel || "Leadership"}</h4>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">{data.sections?.ceo?.sectionTitle || "A Message From Our CEO"}</h2>
            <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
              {data.ceoMessage}
              <br /><a href={data.sections?.ceo?.aboutLink?.url || "#about2"} className="underline text-xs text-blue-600 hover:text-blue-400 font-semibold">{data.sections?.ceo?.aboutLink?.text}</a>
            </p>
            <div className="border-l-4 border-blue-600 pl-6 italic text-slate-500">
              <p className="font-bold text-slate-900 not-italic">{data.ceoName}</p>
              <div className="flex flex-col">
                {/* Pulling mobile from adminContact */}
                <a href={`tel:${cleanMobile}`} className="text-xs hover:font-semibold tracking-widest flex items-center gap-2">
                  <FaPhoneAlt size={10} className="text-blue-600"/> {rawMobile}
                </a> 
                {/* Email remains from data editor */}
                <a href={`mailto:${data.ceoEmail}`} className="text-xs text-blue-600 hover:text-blue-800 hover:font-semibold tracking-widest flex items-center gap-2 mt-1">
                  <FaEnvelope size={10}/> {data.ceoEmail}
                </a>
              </div>
              <p>{data.ceoPosition}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="pt-20 pb-10 bg-slate-50">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.coreValues?.map((item: any, i: number) => (
            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-3xl mb-6">{ICON_MAP[item.icon] || <FaHeart />}</div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About 2 / Legacy */}
      <span id="about2" className="absolute top-[2820px] md:top-[1400px] left-0"></span>
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto p-3 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.3em] bg-blue-100 text-blue-700 rounded-full">{data.legacyBadge}</div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                {data.about2Title} <br /> 
                <span className="text-blue-600 italic font-light">{data.about2Subtitle}</span>
              </h2>
              <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {data.companyDescription}
              </div>
              
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                {/* Experience pulling from adminContact */}
                <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="text-xl font-black text-blue-600">{adminContact?.experience || "15"}+</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Years of Service</div>
                </div>
                {/* Other stats from About Editor */}
                {data.stats?.map((stat: any, i: number) => (
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
                  {data.legacyImages?.map((img: string, i: number) => (
                    <div key={i} className={`rounded-[1rem] overflow-hidden h-40 md:h-60 shadow-inner bg-slate-100 ${i === 1 ? 'mt-4 md:mt-8' : i === 2 ? '-mt-4 md:-mt-8' : ''}`}>
                      <img src={img} alt="Legacy Gallery" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
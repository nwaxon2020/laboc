"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ValuesSection() {
  const [valData, setValData] = useState<any>(null);
  const [experience, setExperience] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch values and images from homePage settings
        const homeSnap = await getDoc(doc(db, "settings", "homePage"));
        if (homeSnap.exists()) setValData(homeSnap.data().values);

        // 2. Fetch experience count from dashboard (Contact Editor) settings
        const dashSnap = await getDoc(doc(db, "settings", "dashboard"));
        if (dashSnap.exists()) setExperience(dashSnap.data().experience);
      } catch (error) {
        console.error("Error fetching values data:", error);
      }
    };
    fetchData();
  }, []);

  const defaultValues = [
    { title: "24/7 Support", desc: "We are available at any hour to provide immediate assistance and guidance." },
    { title: "Dignified Care", desc: "Every detail is handled with the utmost respect and cultural sensitivity." },
    { title: "Transparent Pricing", desc: "Honest, clear, and fair pricing for all our premium funeral arrangements." }
  ];

  const values = valData?.list || defaultValues;

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-3 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="px-2.5 lg:w-1/2">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-blue-400 font-semibold tracking-widest uppercase text-sm">
              Our Commitment
            </motion.span>
            <h2 className="text-2xl md:text-5xl font-serif font-bold mt-4 mb-8 leading-tight">
              {valData?.heading?.split('<br/>')[0] || "Why Families Trust"} <br/> 
              <span className="italic text-slate-400">{valData?.heading?.split('<br/>')[1] || "Laboc Funeral Services"}</span>
            </h2>
            <div className="space-y-8">
              {values.map((v: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{v.title}</h4>
                    <p className="text-slate-400 text-sm">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="lg:w-1/2 relative">
            <div className="relative rounded-lg md:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
               <img src={valData?.image || "/services1.jpeg"} alt="Staff" className="w-full h-[500px] object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>
            {/* Floating Stat Card - Pulling from Contact Editor */}
            <div className="absolute -bottom-6 left-0 md:-left-6 bg-blue-600 p-3 md:p-6 rounded-xl md:rounded-2xl shadow-xl">
              <p className="text-2xl md:text-3xl font-bold">{experience || "15+"}</p>
              <p className="text-xs uppercase tracking-tighter opacity-80">Years of Experience</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
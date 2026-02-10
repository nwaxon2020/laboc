"use client" 

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot, where, doc, getDoc } from "firebase/firestore";
import ContactSection from "./ContactSection"; 
import AdminInbox from "./AdminInbox"; 

export default function HeroSection() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dynamicData, setDynamicData] = useState<any>(null);
    const [contactInfo, setContactInfo] = useState<any>(null);

    const adminUID = process.env.NEXT_PUBLIC_ADMIN_KEY;
    
    // Fetch Dynamic Data
    useEffect(() => {
        const fetchAllData = async () => {
            // Fetch Hero Content
            const heroDoc = await getDoc(doc(db, "settings", "homePage"));
            if (heroDoc.exists()) setDynamicData(heroDoc.data().hero);

            // Fetch Contact Info for WhatsApp Number
            const contactDoc = await getDoc(doc(db, "settings", "dashboard"));
            if (contactDoc.exists()) setContactInfo(contactDoc.data());
        };
        fetchAllData();
    }, []);

    const WHATSAPP_NUMBER = contactInfo?.mobile || "2347065870898"; 
    const WHATSAPP_MESSAGE = contactInfo?.whatsappMsg || "Hello Laboc Funeral Services, I would like to make an inquiry regarding your services.";
    const HERO_IMAGE = dynamicData?.image || "/services1.jpeg";
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user && user.uid === adminUID) {
                setIsAdmin(true);
                const q = query(collection(db, "contacts"), where("status", "==", "unread"));
                const unsubSnap = onSnapshot(q, (snapshot) => {
                    setUnreadCount(snapshot.size);
                });
                return () => unsubSnap();
            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribeAuth();
    }, [adminUID]);

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center bg-slate-950 overflow-visible">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img src={HERO_IMAGE} alt="Background" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-slate-950/80 to-slate-950" />
            </div>

            <div className="container relative z-20 mx-auto px-6 text-center overflow-visible">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-center">
                    <div className="h-1 w-20 bg-blue-500 rounded-full" />
                </motion.div>

                <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 tracking-tight text-white">
                    {dynamicData?.title || "Compassionate"} <span className="text-blue-400">{dynamicData?.subtitle_main || "Funeral Services"}</span>
                </h1>

                <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-300 leading-relaxed font-light">
                    At <span className="text-white font-bold">Laboc</span> Services, {dynamicData?.subtitle || "we provide dignified and personalized arrangements, honoring your loved ones with care, respect, and utmost professionalism."}
                </p>

                <div className="px-4 md:px-0 flex flex-col sm:flex-row gap-5 justify-center items-center overflow-visible">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
                        className="w-full md:w-70 group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-lg font-bold flex justify-center items-center gap-2"
                    >
                        <span>WhatsApp Support</span>
                    </a>

                    <button
                        onClick={() => isAdmin ? setIsAdminOpen(true) : setIsContactOpen(true)}
                        className="w-full md:w-70 group relative px-8 py-4 bg-white/10 border border-slate-700 hover:border-white text-white rounded-xl text-lg font-medium transition-all flex items-center justify-center gap-3"
                    >
                        {isAdmin ? "View Messages" : "Schedule Consultation"}

                        {isAdmin && unreadCount > 0 && (
                            <span className="flex items-center justify-center bg-red-600 text-white text-[10px] font-black w-6 h-6 rounded-full shadow-lg ring-2 ring-red-400/50">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <ContactSection isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            {isAdmin && (
                <AdminInbox 
                    isOpen={isAdminOpen}
                    onClose={() => setIsAdminOpen(false)}
                />
            )}
        </section>
    );
}
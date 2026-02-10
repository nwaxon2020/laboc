'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa'
import { db } from "@/lib/firebaseConfig"; 
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface ContactSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSection({ isOpen, onClose }: ContactSectionProps) {
  // ✅ FORM STATE
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ DYNAMIC CONTACT INFO STATE
  const [businessInfo, setBusinessInfo] = useState({
    mobile: '(070) 658-70898', // Default fallback
    email: 'support@labocfuneral.com',
    address: '12 Surulere Street, Sagamu',
    office: ''
  })

  // ✅ FETCH DATA FROM ADMIN SETTINGS
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "dashboard"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBusinessInfo({
            mobile: data.mobile || businessInfo.mobile,
            email: data.email || businessInfo.email,
            address: data.address || businessInfo.address,
            office: data.office || ''
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    if (isOpen) fetchBusinessInfo();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const loadingToast = toast.loading("Sending your message...")

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        status: "unread",
        createdAt: serverTimestamp(),
      });
      
      toast.success("Message sent! We will contact you shortly.", { id: loadingToast });
      setFormData({ name: '', email: '', phone: '', message: '', service: '' });
      onClose();
    } catch (error) {
      toast.error("Failed to send message.", { id: loadingToast });
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-4 md:mt-18">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="relative w-full h-[100vh] md:h-auto max-w-4xl bg-slate-900/90 border border-slate-800 md:rounded-2xl overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col-reverse lg:flex-row"
          >
            <div className="absolute top-[-395px] md:top-0 left-0 right-0 h-14 flex justify-end items-center px-4 pointer-events-none z-[110]">
              <button 
                onClick={onClose} 
                className="pointer-events-auto p-2 bg-slate-800/80 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg border border-slate-700"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* INFO SECTION - NOW DYNAMIC */}
            <div className="lg:w-1/3 bg-blue-600 p-8 py-12 md:p-10 text-white">
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">Contact Info</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="mt-1 text-blue-200" />
                  <div>
                    <h4 className="font-bold">Location</h4>
                    <p className="text-blue-100 text-sm">{businessInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaPhoneAlt className="mt-1 text-blue-200" />
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="text-blue-100 text-sm">{businessInfo.mobile}</p>
                    {businessInfo.office && <p className="text-blue-100 text-xs mt-1">Office: {businessInfo.office}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaEnvelope className="mt-1 text-blue-200" />
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-blue-100 text-sm">{businessInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaClock className="mt-1 text-blue-200" />
                  <div>
                    <h4 className="font-bold">Hours</h4>
                    <p className="text-blue-100 text-sm">Emergency: 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM SECTION */}
            <div className="lg:w-2/3 p-6 md:p-12 bg-slate-900 py-28 md:py-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-serif font-bold text-white mb-8 text-center">Consultation Request</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="text" name="name" placeholder="Full Name *" required value={formData.name} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    <input type="email" name="email" placeholder="Email Address *" required value={formData.email} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="tel" name="phone" placeholder="Phone Number *" required value={formData.phone} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <option value="" className="bg-slate-900">Select Service</option>
                      <option value="traditional" className="bg-slate-900">Traditional Funeral</option>
                      <option value="cremation" className="bg-slate-900">Cremation</option>
                      <option value="pre-planning" className="bg-slate-900">Pre-Planning</option>
                    </select>
                  </div>
                  <textarea name="message" placeholder="How can we help you? *" rows={4} required value={formData.message} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 active:scale-95">
                    {isSubmitting ? "Processing..." : "Send Request"}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
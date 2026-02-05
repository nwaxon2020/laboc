'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa'
import { db } from "@/lib/firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

interface ContactSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSection({ isOpen, onClose }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const loadingToast = toast.loading("Sending your message...")

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        status: "unread", // 👈 FIXED: Added unread status for the bubble to work
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            <button onClick={onClose} className="absolute top-5 right-5 z-20 p-2 text-slate-400 hover:text-white transition-colors"><FaTimes size={24} /></button>
            <div className="lg:w-1/3 bg-blue-600 p-6 md:p-8 text-white">
              <h3 className="text-3xl font-serif font-bold mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="mt-1 text-blue-200" />
                  <div><h4 className="font-bold">Location</h4><p className="text-blue-100 text-sm">123 Compassion Street, Sagamu</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <FaPhoneAlt className="mt-1 text-blue-200" />
                  <div><h4 className="font-bold">Phone</h4><p className="text-blue-100 text-sm">Main: (070) 658-70898</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <FaEnvelope className="mt-1 text-blue-200" />
                  <div><h4 className="font-bold">Email</h4><p className="text-blue-100 text-sm">support@labocfuneral.com</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <FaClock className="mt-1 text-blue-200" />
                  <div><h4 className="font-bold">Hours</h4><p className="text-blue-100 text-sm">Emergency: 24 Hours</p></div>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 p-8 md:p-12 bg-slate-900">
              <h3 className="text-2xl font-serif font-bold text-white mb-6 text-center">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" name="name" placeholder="Full Name *" required value={formData.name} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  <input type="email" name="email" placeholder="Email Address *" required value={formData.email} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="tel" name="phone" placeholder="Phone Number *" required value={formData.phone} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="" className="bg-slate-900">Select Service</option>
                    <option value="traditional" className="bg-slate-900">Traditional Funeral</option>
                    <option value="cremation" className="bg-slate-900">Cremation</option>
                    <option value="pre-planning" className="bg-slate-900">Pre-Planning</option>
                  </select>
                </div>
                <textarea name="message" placeholder="How can we help you? *" rows={4} required value={formData.message} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50">
                  {isSubmitting ? "Processing..." : "Submit Consultation Request"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from "@/lib/firebaseConfig";
import { 
  onAuthStateChanged, 
  User, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword 
} from "firebase/auth";
import { FaGoogle, FaLock, FaUserShield, FaSignOutAlt, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const adminUID = process.env.NEXT_PUBLIC_ADMIN_KEY;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully");
    } catch (error) {
      toast.error("Google sign-in failed");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      toast.success("Admin access granted");
      setIsAdminModalOpen(false);
    } catch (error) {
      toast.error("Invalid Admin Credentials");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <footer className="bg-gray-950 text-white border-t border-gray-900">
      <div className="container mx-auto px-4 py-12 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="w-42 md:w-58 flex flex-col items-start font-sans mb-2">
                {/* Main Brand Name */}
                <h1 className="text-sm md:text-[18px] font-black text-white tracking-tight leading-none">
                    Laboc <span className="font-medium text-gray-400">Funeral Services</span>
                </h1>

                {/* Decorative Separator Line */}
                <div className="w-full h-[1px] bg-gray-300 my-1" />

                {/* Tagline / Subtitle */}
                <p className="text-[6.5px] md:text-[9px] font-bold text-gray-200 tracking-[0.2em] uppercase flex justify-between w-full px-0.5">
                    <span>Compassionate care</span>
                    <span className="text-gray-300">|</span>
                    <span>Since 2011</span>
                </p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing compassionate and dignified funeral services for over 15 years in Sagamu and beyond.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-500 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="#services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              
              {/* Conditional Admin Dashboard Link */}
              {user?.uid === adminUID && (
                <li>
                  <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2">
                    <FaUserShield size={14} /> Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-500 uppercase tracking-widest text-xs">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Traditional Funerals</li>
              <li>Cremation Services</li>
              <li>Pre-Planning</li>
              <li>Grief Support</li>
            </ul>
          </div>
          
          {/* Contact & Auth */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-500 uppercase tracking-widest text-xs">Account</h4>
            <div className="space-y-4">
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="flex font-semibold items-center gap-2 text-sm text-red-500 hover:text-red-400 transition"
                >
                  <FaSignOutAlt size={14} /> Sign Out ({user.displayName? user.displayName?.split(' ')[0] : "ADMIN"})
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition w-full justify-center"
                  >
                    <FaGoogle className="text-red-500" /> Sign in with Google
                  </button>
                  
                  {/* Small Admin Trigger */}
                  <button 
                    onClick={() => setIsAdminModalOpen(true)}
                    className="pl-2 block w-full text-left text-[10px] text-gray-600 hover:text-blue-500 transition uppercase tracking-tighter"
                  >
                    Staff Portal Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-900 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Laboc Funeral Services. All rights reserved.</p>
          <address className="not-italic flex gap-4">
            <span>Sagamu, Nigeria</span>
            <span>support@labocfuneral.com</span>
          </address>
        </div>
      </div>

      {/* Admin Email/Password Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-4 backdrop-blur-md bg-black/60">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-gray-800 py-8 px-6 md:px-8 rounded-2xl w-full max-w-sm shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAdminModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <FaTimes />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaLock />
                </div>
                <h4 className="text-xl font-bold">Admin Portal</h4>
                <p className="text-gray-500 text-xs mt-1">Authorized personnel only</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <input 
                    type="email" 
                    placeholder="Admin Email"
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="Password"
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-sm transition shadow-lg shadow-blue-900/20"
                >
                  Enter Dashboard
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
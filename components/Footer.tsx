"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Added for smooth navigation
import { auth } from "@/lib/firebaseConfig";
import { 
  onAuthStateChanged, 
  User, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword 
} from "firebase/auth";
import { FaGoogle, FaLock, FaUserShield, FaSignOutAlt, FaTimes, FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const router = useRouter(); // Initialize router
  const [user, setUser] = useState<User | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const adminUID = process.env.NEXT_PUBLIC_ADMIN_KEY;
  const COMPANY_ADDRESS = "12 Surulere Street, Beside Old Fanmilk Depot, Makun, Sagamu, Ogun State, Nigeria";
  const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(COMPANY_ADDRESS)}`;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleServiceClick = (serviceTitle: string) => {
    // UPDATED: Create a safe ID from the title (e.g., "Traditional Funerals" -> "traditional-funerals")
    const sectionId = serviceTitle.toLowerCase().replace(/\s+/g, '-');
    
    // This pushes to the services page and appends the hash for the browser to scroll to
    router.push(`/services?service=${encodeURIComponent(serviceTitle)}#${sectionId}`);
  };

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
      router.push("/admin")
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
    <footer className="bg-gray-950 text-white border-t border-gray-900 relative z-50">
      <div className="container mx-auto px-4 py-12 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="w-50 md:w-[16rem] flex flex-col items-start font-sans mb-2">
                <div className='flex gap-2 justify-start items-end'>
                  <div className="p-0.5 w-10 h-10 md:w-14 md:h-14 shadow-lg border-2 border-gray-800 rounded flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" className='w-full h-full object-cover' alt="Site Logo" />
                  </div>
                  <h1 className="text-sm md:text-[18px] font-black text-white tracking-tight leading-none">
                      Laboc <span className="font-medium text-gray-400">Funeral Services</span>
                  </h1>
                </div>
                <div className="w-full h-[1px] bg-gray-300 my-1" />
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
          
          {/* Quick Links & About Dropdown */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-500 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition font-medium">Home</Link></li>
              <li><Link href="/services#services" className="hover:text-white transition font-medium">Services</Link></li>
              <li><Link href="/blog" className="hover:text-white transition font-medium">Market Place</Link></li>
              <li><Link href="/events" className="hover:text-white transition font-medium">Events</Link></li>
              
              {/* About Dropdown in Footer */}
              <li className="relative">
                <button 
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="flex items-center gap-1 hover:text-white transition font-bold text-gray-300"
                >
                  About <FaChevronDown className={`text-[10px] transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isAboutOpen && (
                    <motion.ul 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 mt-2 space-y-2 overflow-hidden border-l border-gray-800"
                    >
                      <li><Link href="/about" className="hover:text-blue-400 transition block">About Us</Link></li>
                      <li><a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition block">Our Location</a></li>
                      <li><Link href="/terms" className="hover:text-blue-400 transition block">Our Policy</Link></li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              {user?.uid === adminUID && (
                <li>
                  <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2 mt-2">
                    <FaUserShield size={14} /> Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          {/* Services (Interactive) */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-500 uppercase tracking-widest text-xs">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {['Traditional Funerals', 'Cremation Services', 'Pre-Planning', 'Grief Support', 'Transportation', 'Memorial Products', 'Diplomatic Convoy', 'Floral & Venue Decor'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => handleServiceClick(item)} 
                    className="hover:text-white transition text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Account */}
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
          <p>© {new Date().getFullYear()} Laboc Funeral Services. All rights reserved.</p>
          <address className="not-italic flex gap-4 max-w-[30rem]">
            <span>12 Surulere Street, Beside Old Fanmilk Depot, Makun, Sagamu, Ogun State, Nigeria</span>
            <span>support@labocfuneral.com</span>
          </address>
        </div>
      </div>

      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-4 backdrop-blur-md bg-black/60">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-gray-800 py-8 px-6 md:px-8 rounded-2xl w-full max-w-sm shadow-2xl relative"
            >
              <button onClick={() => setIsAdminModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><FaTimes /></button>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2"><FaLock /></div>
                <h4 className="text-xl font-bold">Admin Portal</h4>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="email" placeholder="Admin Email" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm outline-none" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm outline-none" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-sm transition">Enter Dashboard</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
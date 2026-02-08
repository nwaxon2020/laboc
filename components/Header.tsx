'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { auth } from "@/lib/firebaseConfig"
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { motion, AnimatePresence } from "framer-motion"
import { FaSignOutAlt, FaUserCircle, FaChevronDown, FaShieldAlt } from "react-icons/fa"
import toast from "react-hot-toast"
import Nav from './Nav'

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // --- SETTINGS ---
    const adminUID = process.env.NEXT_PUBLIC_ADMIN_KEY;
    const ceoImage = null; 
    const placeholderImage = "https://ui-avatars.com/api/?name=Admin&background=111827&color=fff";

    // UPDATED: Background & Text Color Logic based on URL
    const getHeaderStyles = () => {
        
        if (pathname === '/blog') {
            return {
                container: 'bg-gray-950 text-white border-b border-gray-800',
                text: 'text-white',
                subText: 'text-gray-400',
                line: 'bg-gray-700'
            };
        }
        if (pathname === '/events') {
            return {
                container: 'bg-emerald-950 text-white border-b border-emerald-800',
                text: 'text-white',
                subText: 'text-emerald-400',
                line: 'bg-emerald-700'
            };
        }
        if (pathname === '/about') {
            return {
                container: 'bg-blue-900 text-white shadow-xl', // Dark Blue (Slate-900)
                text: 'text-white',
                subText: 'text-slate-300',
                line: 'bg-slate-700'
            };
        }
        return {
            container: 'bg-white shadow-md text-gray-900',
            text: 'text-gray-900',
            subText: 'text-gray-500',
            line: 'bg-gray-300'
        };
    }

    const styles = getHeaderStyles();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success("Welcome back!");
        } catch (error) {
            toast.error("Sign-in failed");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsDropdownOpen(false);
            toast.success("Signed out safely");
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    const isAdmin = user?.uid === adminUID;

    return (
        <header className={`sticky top-0 z-[300] transition-all duration-500 ${styles.container}`}>
            <div className="container mx-auto p-3">
                <div className="flex items-center justify-between">
                    
                    {/* Logo & Brand */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="p-1 w-10 h-10 md:w-14 md:h-14 shadow-lg border-2 border-gray-800 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                            <img src="/logo.png" className='w-full h-full object-cover' alt="Site Logo" />
                        </div>
                        <div className="flex flex-col items-start font-sans">
                            <h1 className={`text-[12px] md:text-[18px] font-black tracking-tight leading-none ${styles.text}`}>
                                Laboc <span className={`font-medium opacity-80`}>Funeral Services</span>
                            </h1>
                            <div className={`w-full h-[1px] my-1 ${styles.line}`} />
                            <p className={`text-[7px] md:text-[9px] font-bold tracking-[0.2em] uppercase flex justify-between w-full px-0.5 ${styles.subText}`}>
                                <span>Compassionate care</span>
                                <span className="opacity-30">|</span>
                                <span>Since 2011</span>
                            </p>
                        </div>
                    </Link>

                    {/* Navigation Component - Ensure Nav.tsx uses inherit colors or props */}
                    <Nav />

                    {/* Actions Area */}
                    <div className="flex items-center gap-3 md:gap-6">
                        <a 
                            href="tel:07065870898" 
                            className="hidden md:block bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-md transition duration-300 text-sm font-bold shadow-md"
                        >
                            24/7 Emergency Line
                        </a>

                        {user ? (
                            <div className="relative flex items-center gap-2" ref={dropdownRef}>
                                {isAdmin ? (
                                    <span className="hidden sm:block text-[11px] font-black uppercase tracking-tighter bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 bg-clip-text text-transparent animate-shimmer">
                                        CEO
                                    </span>
                                ) : (
                                    <span className={`hidden sm:block text-[10px] font-bold uppercase tracking-tighter ${styles.subText}`}>
                                        {user.displayName?.split(' ')[0]}
                                    </span>
                                )}

                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="focus:outline-none relative group"
                                >
                                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-2 overflow-hidden transition-all ${
                                        isAdmin ? 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'border-gray-200'
                                    }`}>
                                        <img 
                                            src={isAdmin ? (ceoImage || placeholderImage) : (user.photoURL || "/img_holder.png")} 
                                            alt="User" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full text-[8px] border border-gray-200 p-0.5 text-gray-900">
                                        <FaChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl p-4 overflow-hidden text-gray-900"
                                        >
                                            <div className="mb-4">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    {isAdmin ? "Founder & CEO" : "Account"}
                                                </p>
                                                <p className="text-xs font-semibold truncate">{user.email}</p>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                {isAdmin && (
                                                    <Link 
                                                        href="/admin" 
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="flex items-center gap-2 text-xs p-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition font-bold mb-1 shadow-sm"
                                                    >
                                                        <FaShieldAlt className="text-amber-400" /> Admin Dashboard
                                                    </Link>
                                                )}
                                                
                                                <button 
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 text-xs p-2.5 hover:bg-red-50 text-red-500 rounded-lg transition font-bold w-full text-left"
                                                >
                                                    <FaSignOutAlt /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button 
                                onClick={handleLogin}
                                className={`text-xs md:text-sm font-bold transition uppercase tracking-widest ${styles.text} hover:opacity-70`}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .animate-shimmer {
                    background-size: 200% auto;
                    animation: shimmer 3s linear infinite;
                }
            `}</style>
        </header>
    )
}
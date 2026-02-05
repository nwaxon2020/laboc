"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaStar, 
  FaPenNib, 
  FaGoogle, 
  FaTimes, 
  FaTrash,
  FaExclamationTriangle 
} from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { auth, db } from "@/lib/firebaseConfig"; 
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, setDoc, doc, serverTimestamp, query, onSnapshot, orderBy, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface Review {
  id: string;
  userId: string;
  name: string;
  photo: string;
  rating: number;
  quote: string;
  relation: string;
  createdAt: any;
}

export default function TestimonialsSection() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isPaused, setIsPaused] = useState(false);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { return "Recently"; }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
      setAllReviews(reviewsData);
      if (auth.currentUser) {
        const existing = reviewsData.find(r => r.userId === auth.currentUser?.uid);
        setUserReview(existing || null);
      } else { setUserReview(null); }
    });
    return () => { unsubscribeSnapshot(); unsubscribeAuth(); };
  }, []);

  // --- Auto-scroll Logic with Start/End Buffer Support ---
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider || allReviews.length === 0) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5 

    const animate = () => {
      if (!isPaused) {
        slider.scrollLeft += scrollSpeed;
        
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        // Reset to 0 when end is reached
        if (slider.scrollLeft >= maxScroll - 1) {
          slider.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, allReviews]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName}!`);
    } catch (error) { toast.error("Login failed."); }
  };

  const confirmDeleteReview = async () => {
    if (!userReview || !currentUser) return;
    const loadingToast = toast.loading("Deleting...");
    try {
      await deleteDoc(doc(db, "reviews", currentUser.uid));
      toast.success("Review deleted.", { id: loadingToast });
      setIsDeleteConfirmOpen(false);
    } catch (error) { toast.error("Failed to delete.", { id: loadingToast }); }
  };

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || userReview) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading("Publishing...");
    try {
      await setDoc(doc(db, "reviews", currentUser.uid), {
        name: currentUser.displayName,
        photo: currentUser.photoURL,
        rating,
        quote: message,
        relation: "Family Member",
        createdAt: serverTimestamp(),
        userId: currentUser.uid
      });
      toast.success("Review submitted!", { id: loadingToast });
      setIsModalOpen(false);
      setMessage("");
    } catch (error) { toast.error("Error saving review.", { id: loadingToast }); } 
    finally { setIsSubmitting(false); }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      scrollRef.current.scrollTo({ 
        left: direction === "left" ? scrollLeft - 320 : scrollLeft + 320, 
        behavior: "smooth" 
      });
    }
  };

  return (
    <section className="py-12 md:py-24 bg-[#050b18] text-white relative overflow-hidden font-sans">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h2 className="text-2xl md:pl-10 md:text-5xl font-serif font-bold mb-4 flex items-center gap-4">
              <HiOutlineChatAlt2 className="text-blue-500" />
              Families Served
              {allReviews.length > 0 && (
                <span className="text-sm font-sans bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full border border-gray-500/30">
                  {allReviews.length}
                </span>
              )}
            </h2>
            <p className="md:pl-10 -mt-4 text-sm text-slate-400">Trusted reviews from the Sagamu community.</p>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              userReview ? (
                <button onClick={() => setIsDeleteConfirmOpen(true)} className="w-full flex justify-center md:justify-start items-center gap-2 bg-red-500/10 text-red-500 border border-red-400/40 px-6 py-3 rounded-lg md:rounded-full text-xs font-bold hover:bg-red-400/25 transition-all">
                  <FaTrash /> Remove My Review
                </button>
              ) : (
                <button onClick={() => setIsModalOpen(true)} className="w-full flex justify-center md:justify-start items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg md:rounded-full transition-all font-bold text-sm">
                  <FaPenNib /> Share Your Story
                </button>
              )
            ) : (
              <div className="w-full flex flex-col items-center">
                <p className="pb-1 text-xs text-blue-400 md:text-gray-400 font-semibold">Want to share your review ?</p>
                <button onClick={handleGoogleLogin} className="w-full flex justify-center md:justify-start items-center gap-3 text-white text-xs border border-slate-700 px-5 py-2.5 rounded-lg md:rounded-full bg-slate-900/50 hover:bg-slate-800 transition-all">
                  <FaGoogle className="text-green-500" /> Continue with Google
                </button>
              </div>
            )}
          </div>
        </div>

        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)} 
        >
          <button onClick={() => scroll("left")} className="absolute left-[-20px] top-28 -translate-y-1/2 z-10 p-4 rounded-full bg-blue-300/60 text-black shadow-xl hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity"><FaChevronLeft size={18} /></button>
          <button onClick={() => scroll("right")} className="absolute right-[-20px] top-28 -translate-y-1/2 z-10 p-4 rounded-full bg-blue-300/60 text-black shadow-xl hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity"><FaChevronRight size={18} /></button>
          
          <div 
            ref={scrollRef} 
            className={`flex gap-6 overflow-x-auto no-scrollbar pb-10 touch-pan-x cursor-grab active:cursor-grabbing ${isPaused ? 'snap-x snap-mandatory' : ''}`}
          >
            {/* Start Buffer Space */}
            <div className="flex-shrink-0 w-4 md:w-10 h-full" aria-hidden="true" />

            {allReviews.map((t) => (
              <div key={t.id} className="snap-start flex-shrink-0">
                <div className="bg-white text-slate-900 p-4 md:p-6 rounded-lg md:rounded-xl shadow-2xl w-[280px] md:w-[320px] h-[230px] flex flex-col relative transition-transform">
                  <span className="absolute top-6 right-6 text-[8px] font-bold uppercase text-slate-400 tracking-tighter">
                    {formatDate(t.createdAt)}
                  </span>
                  
                  <div className="flex gap-1 mb-4 text-yellow-400 text-xs">
                    {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
                  </div>
                  
                  <p className="text-sm text-slate-700 italic flex-grow overflow-y-auto line-clamp-6 leading-relaxed">
                    "{t.quote}"
                  </p>
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <img src={t.photo || "/img_holder.png"} alt="Commenter" className="h-8 w-8 rounded-full object-cover border border-slate-200" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm truncate">{t.name}</h4>
                      <p className="text-blue-500 text-[9px] uppercase tracking-widest font-black">{t.relation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* End Buffer Space */}
            <div className="flex-shrink-0 w-10 md:w-20 h-full" aria-hidden="true" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-xl p-8 shadow-2xl text-slate-900">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><FaTimes size={20}/></button>
              <div className="text-center mb-6">
                <img src={currentUser?.photoURL || ""} alt="" className="h-16 w-16 rounded-full mx-auto mb-4 border-2 border-blue-500" />
                <h3 className="text-2xl font-serif font-bold italic">Share your experience</h3>
              </div>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className={`text-3xl ${star <= (hover || rating) ? 'text-yellow-400' : 'text-slate-200'}`}><FaStar /></button>
                  ))}
                </div>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-900 outline-none focus:border-blue-500 min-h-[120px] text-sm" placeholder="Tell us how we helped your family..." />
                <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 py-4 rounded-lg font-bold text-white hover:bg-blue-700 transition-all">
                  {isSubmitting ? "Posting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteConfirmOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#050b18] border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center text-white">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <FaExclamationTriangle size={30} />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Review?</h3>
              <p className="text-slate-400 text-sm mb-6">Are you sure you want to remove your testimonial? You will need to write a new one if you change your mind.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-all">Cancel</button>
                <button onClick={confirmDeleteReview} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
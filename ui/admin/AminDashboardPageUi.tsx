'use client'
import { useRouter } from 'next/navigation'
import { auth, db, storage } from '@/lib/firebaseConfig' 
import { signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { 
  FaUserShield, FaFileAlt, FaImages, FaTools, 
  FaSignOutAlt, FaArrowRight, FaCamera, FaLink, FaTimes, FaCheckCircle 
} from 'react-icons/fa'
import { HiShieldCheck } from 'react-icons/hi'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminDashboardUi() {
    const router = useRouter()
    const defaultBg = 'https://thumbs.dreamstime.com/b/peaceful-landscape-sea-hills-sunrise-south-europe-croatia-idyllic-morning-view-hvar-island-80791895.jpg'
    
    const [bgImage, setBgImage] = useState('')
    const [showBgEditor, setShowBgEditor] = useState(false)
    const [bgUrlInput, setBgUrlInput] = useState('')
    
    // ✅ LOCAL STATES (No Firebase interaction yet)
    const [previewUrl, setPreviewUrl] = useState('') 
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        const fetchBg = async () => {
            try {
                const docSnap = await getDoc(doc(db, "settings", "dashboard"));
                if (docSnap.exists()) setBgImage(docSnap.data().backgroundImage);
            } catch (error) { console.error(error); }
        };
        fetchBg();
    }, []);

    // ✅ STEP 1: LOCAL PREVIEW ONLY (No Firebase code runs here)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const localURL = URL.createObjectURL(file); // Temporary browser-only link
        setPreviewUrl(localURL);
        toast.success("Local preview loaded");
    }

    // ✅ STEP 2: THE ONLY FIREBASE ACTION (Runs only on Save)
    const handleFinalSave = async () => {
        if (!previewUrl) return toast.error("Nothing to save");
        
        setIsProcessing(true);
        const tId = toast.loading("Uploading and saving to cloud...");

        try {
            let finalUrl = previewUrl;

            // If it's a file, upload it now
            if (selectedFile) {
                const storageRef = ref(storage, `admin/bg_${Date.now()}`);
                await uploadBytes(storageRef, selectedFile);
                finalUrl = await getDownloadURL(storageRef);
            }

            // Save the URL (either the pasted link or the new upload link) to Firestore
            await setDoc(doc(db, "settings", "dashboard"), {
                backgroundImage: finalUrl
            }, { merge: true });

            setBgImage(finalUrl);
            setShowBgEditor(false);
            setPreviewUrl('');
            setSelectedFile(null);
            toast.success("Dashboard updated!", { id: tId });
        } catch (error) {
            toast.error("Update failed", { id: tId });
        } finally {
            setIsProcessing(false);
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) { toast.error("Logout failed"); }
    }

    const adminCards = [
        { title: "Service Manager", desc: "Edit funeral packages and pricing.", icon: <FaTools size={24} />, url: "/admin/services", color: "bg-blue-600" },
        { title: "Obituary Editor", desc: "Manage digital tributes.", icon: <FaFileAlt size={24} />, url: "/admin/obituaries", color: "bg-emerald-600" },
        { title: "Gallery & Inventory", desc: "Update casket catalog.", icon: <FaImages size={24} />, url: "/admin/inventory", color: "bg-purple-600" },
        { title: "Staff & Inquiries", desc: "View customer requests.", icon: <FaUserShield size={24} />, url: "/admin/staff", color: "bg-amber-600" }
    ];

    return (
        <div className="min-h-screen text-sans">
            <div className="fixed inset-0 bg-center bg-cover transition-all duration-700"
                style={{ 
                    backgroundImage: `linear-gradient(to bottom, rgba(4, 13, 8, 0.92), rgba(4, 13, 8, 0.6)), url('${bgImage || defaultBg}')`,
                    zIndex: -1 
                }}
            />

            <nav className="bg-gray-900 fixed w-full z-[200] border-b border-gray-200/20 px-6 py-4 flex gap-2 flex-col md:flex-row justify-between items-center shadow-sm backdrop-blur-md bg-black/10">
                <div className="flex items-center gap-2">
                    <HiShieldCheck className="text-emerald-600 text-2xl" />
                    <h1 className="text-lg font-black text-white uppercase tracking-tight">Laboc Control</h1>
                </div>
                <div className="flex justify-center items-center gap-12 md:gap-8">
                    <button onClick={() => { setShowBgEditor(true); setPreviewUrl(''); }} className="text-[10px] font-black text-white uppercase tracking-widest underline decoration-amber-500 underline-offset-4">
                        Change Background
                    </button>
                    <button onClick={handleLogout} className="text-xs font-black text-gray-200 hover:text-red-400 uppercase tracking-widest flex items-center gap-2">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </nav>

            {showBgEditor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-bold flex items-center gap-2"><FaImages className="text-amber-500" /> Background Editor</h3>
                            <button onClick={() => setShowBgEditor(false)} className="text-slate-400 hover:text-white"><FaTimes /></button>
                        </div>

                        {/* ✅ PREVIEW BOX (Instant, No Firebase) */}
                        {previewUrl && (
                            <div className="mb-6 animate-in fade-in">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 text-center">Previewing Selection</p>
                                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-amber-500 shadow-xl shadow-amber-500/10">
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <button 
                                            onClick={handleFinalSave}
                                            disabled={isProcessing}
                                            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                        >
                                            <FaCheckCircle /> Apply & Save Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <input 
                                type="text" 
                                value={bgUrlInput}
                                onChange={(e) => { setBgUrlInput(e.target.value); setPreviewUrl(e.target.value); setSelectedFile(null); }}
                                placeholder="Paste image link here..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-amber-500"
                            />
                            
                            <div className="relative flex justify-center text-[10px] uppercase text-slate-500 font-bold">
                                <span className="bg-slate-900 px-2 z-10">OR</span>
                                <div className="absolute top-1/2 left-0 right-0 border-t border-slate-800"></div>
                            </div>

                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-xl hover:bg-slate-800/50 cursor-pointer">
                                <FaCamera className="text-slate-500 text-xl mb-1" />
                                <p className="text-[10px] text-slate-400 font-bold">UPLOAD FILE</p>
                                <input type='file' className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-6xl mx-auto py-12 px-6">
                <header className="my-12 text-center md:text-left">
                    <h2 className="text-3xl font-black text-gray-300 tracking-tight">Master Dashboard</h2>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adminCards.map((card, i) => (
                        <Link key={i} href={card.url}>
                            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all relative overflow-hidden h-full">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`}></div>
                                <div className={`w-14 h-14 ${card.color} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">{card.desc}</p>
                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">Launch <FaArrowRight /></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
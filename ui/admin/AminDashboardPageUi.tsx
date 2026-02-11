'use client'
import { useRouter } from 'next/navigation'
import { auth, db, storage } from '@/lib/firebaseConfig' 
import { signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { 
  FaUserShield, FaFileAlt, FaImages, FaTools, 
  FaSignOutAlt, FaArrowRight, FaCamera, FaStoreAlt , FaTimes, FaCheckCircle,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaBriefcase, FaWhatsapp
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
    
    const [previewUrl, setPreviewUrl] = useState('') 
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // ✅ CONTACT STATES
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [contactData, setContactData] = useState({
        mobile: '',
        office: '',
        email: '',
        address: '',
        experience: '',
        whatsappMsg: ''
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docSnap = await getDoc(doc(db, "settings", "dashboard"));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBgImage(data.backgroundImage);
                    setContactData({
                        mobile: data.mobile || '',
                        office: data.office || '',
                        email: data.email || '',
                        address: data.address || '',
                        experience: data.experience || '',
                        whatsappMsg: data.whatsappMsg || ''
                    });
                }
            } catch (error) { console.error(error); }
        };
        fetchSettings();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        const localURL = URL.createObjectURL(file);
        setPreviewUrl(localURL);
        toast.success("Local preview loaded");
    }

    const handleFinalSave = async () => {
        if (!previewUrl) return toast.error("Nothing to save");
        setIsProcessing(true);
        const tId = toast.loading("Uploading and saving to cloud...");
        try {
            let finalUrl = previewUrl;
            if (selectedFile) {
                const storageRef = ref(storage, `admin/bg_${Date.now()}`);
                await uploadBytes(storageRef, selectedFile);
                finalUrl = await getDownloadURL(storageRef);
            }
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

    const saveContactInfo = async () => {
        const tId = toast.loading("Saving contact info...");
        try {
            await setDoc(doc(db, "settings", "dashboard"), contactData, { merge: true });
            toast.success("Contact info updated!", { id: tId });
            setIsContactOpen(false);
        } catch (error) {
            toast.error("Failed to save contact info", { id: tId });
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) { toast.error("Logout failed"); }
    }

    const adminCards = [
        { title: "Home Page Manager", desc: "Edit Home-Page pictures, values and others.", icon: <FaTools size={24} />, url: "/admin/home-editor", color: "bg-blue-600" },
        { title: "Service Page Manager", desc: "Manage Service Page and Prices.", icon: <FaFileAlt size={24} />, url: "/admin/service-editor", color: "bg-emerald-600" },
        { title: "Event Page Manager", desc: "Update events catalog.", icon: <FaImages size={24} />, url: "/admin/event-editor", color: "bg-purple-600" },
        { title: "Market Page Editor", desc: "Show customers Products Available.", icon: <FaStoreAlt  size={24} />, url: "/admin/market-editor", color: "bg-amber-600" }
    ];

    return (
        <div className="min-h-screen text-sans">
            <div className="fixed inset-0 bg-center bg-cover transition-all duration-700"
                style={{ 
                    backgroundImage: `linear-gradient(to bottom, rgba(4, 13, 8, 0.92), rgba(4, 13, 8, 0.5)), url('${bgImage || defaultBg}')`,
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

            <main className="px-3 max-w-6xl mx-auto py-12">
                <header className="my-12 text-center md:text-left">
                    <h2 className="text-3xl font-black text-gray-300 tracking-tight">Master Dashboard</h2>
                </header>

                {/* ✅ CONTACT INFORMATION SECTION */}
                <div className="mb-8 bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                    <button 
                        onClick={() => setIsContactOpen(!isContactOpen)}
                        className="w-full p-6 flex justify-between items-center bg-gray-50/50 hover:bg-gray-200 transition-colors"
                    >
                        <div className="flex items-center gap-4 text-gray-800 font-bold uppercase tracking-widest text-xs">
                            <FaPhoneAlt className="text-emerald-600" /> 
                            Contact & Business Information
                        </div>
                        {isContactOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </button>

                    {isContactOpen && (
                        <div className="px-4 py-6 md:p-6 border-t border-gray-100 animate-in slide-in-from-top duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Mobile Phone (WhatsApp)</label>
                                    <div className="relative">
                                        <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                        <input 
                                            type="text" value={contactData.mobile} 
                                            onChange={(e) => setContactData({...contactData, mobile: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm"
                                            placeholder="+234..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Office Phone</label>
                                    <div className="relative">
                                        <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                        <input 
                                            type="text" value={contactData.office} 
                                            onChange={(e) => setContactData({...contactData, office: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm"
                                            placeholder="Office Line"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                        <input 
                                            type="email" value={contactData.email} 
                                            onChange={(e) => setContactData({...contactData, email: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm"
                                            placeholder="info@laboc.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Years of Experience</label>
                                    <div className="relative">
                                        <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                        <input 
                                            type="text" value={contactData.experience} 
                                            onChange={(e) => setContactData({...contactData, experience: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold"
                                            placeholder="e.g. 15+"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">WhatsApp Boiler Message</label>
                                    <div className="relative">
                                        <FaWhatsapp className="absolute left-4 top-4 text-emerald-500 text-xs" />
                                        <textarea 
                                            value={contactData.whatsappMsg} 
                                            onChange={(e) => setContactData({...contactData, whatsappMsg: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm min-h-[100px]"
                                            placeholder="Hello Laboc, I would like to inquire about..."
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Office Address</label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                        <input 
                                            type="text" value={contactData.address} 
                                            onChange={(e) => setContactData({...contactData, address: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm"
                                            placeholder="Full business address..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={saveContactInfo}
                                className="mt-6 w-full md:w-auto bg-emerald-600 text-white px-12 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-200"
                            >
                                Save Information
                            </button>
                        </div>
                    )}
                </div>
                
                {/* LINK CARDS */}
                <div className="px-3 grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* ABOUT EDITOR PAGE LINK */}
                <div className="my-8 bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                    <Link href={"/admin/about-terms-editor"} className='flex justify-between items-center px-4 py-6 hover:bg-gray-200'>
                        <div className="flex items-end gap-2 text-gray-800 font-bold uppercase tracking-widest text-xs">
                            <FaUserShield className="text-lg text-emerald-600" /> 
                            About & Term/Policy
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">Launch <FaArrowRight /></div>
                    </Link>
                </div>
            </main>
        </div>
    )
}
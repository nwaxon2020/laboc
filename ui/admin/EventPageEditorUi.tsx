"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { 
  FaCalendarAlt, FaEdit, FaSync, FaPlus, FaTrash, 
  FaArrowLeft, FaVideo, FaImage, FaUpload, FaExclamationTriangle, 
  FaTimes, FaCheck, FaLink, FaSortAmountDown 
} from "react-icons/fa";
import Link from "next/link";

export default function EventPageEditorUi() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});
    const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>({});
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "settings", "eventPage");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                // ✅ Sort by newest update on load
                if (fetchedData.events) {
                    fetchedData.events.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));
                }
                setData(fetchedData);
            } else {
                setData({
                    header: { title: "Laboc Events", subtitle: "Updates, Tributes, & Premium Services" },
                    events: []
                });
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // ✅ Helper to update data and set the timestamp for priority
    const updateEventWithTimestamp = (index: number, updatedFields: any) => {
        const temp = [...data.events];
        temp[index] = { 
            ...temp[index], 
            ...updatedFields, 
            updatedAt: Date.now() // Mark as recently touched
        };
        setData({ ...data, events: temp });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const objectUrl = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, [index]: objectUrl }));
        setFilesToUpload(prev => ({ ...prev, [index]: file }));
        updateEventWithTimestamp(index, { mediaUrl: objectUrl });
    };

    const saveEverything = async () => {
        setSaving(true);
        const tId = toast.loading("Sorting and Publishing updates...");
        try {
            let updatedEvents = [...data.events];

            // Handle File Uploads
            for (const indexStr in filesToUpload) {
                const index = parseInt(indexStr);
                const file = filesToUpload[index];
                const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                updatedEvents[index].mediaUrl = url;
            }

            // ✅ FINAL SORT: Ensure most recently edited are at the top of the array
            updatedEvents.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));

            const finalData = { ...data, events: updatedEvents };
            await setDoc(doc(db, "settings", "eventPage"), finalData);
            
            setFilesToUpload({});
            setPreviews({});
            setData(finalData);
            toast.success("Event Page Reordered & Live!", { id: tId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to save", { id: tId });
        } finally {
            setSaving(false);
        }
    };

    const addEvent = () => {
        const newEvent = {
            id: Date.now(),
            title: "",
            description: "",
            content: "",
            mediaUrl: "",
            type: "image",
            updatedAt: Date.now() // New items go to top
        };
        setData({ ...data, events: [newEvent, ...data.events] });
    };

    const deleteEvent = (index: number) => {
        const filtered = data.events.filter((_: any, i: number) => i !== index);
        setData({ ...data, events: filtered });
        setConfirmDelete(null);
    };

    if (loading) return <div className="h-screen bg-[#040d08] flex items-center justify-center text-emerald-500 font-black animate-pulse tracking-widest">LOADING EVENTS SYSTEM...</div>;

    return (
        <div className="min-h-screen bg-[#040d08] text-slate-200 pb-20 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* STICKY HEADER */}
                <header className="flex flex-col gap-4 md:flex-row justify-between items-center bg-emerald-950/20 backdrop-blur-xl p-4 md:p-6 sticky top-4 z-50 border border-emerald-900/30 md:rounded-2xl shadow-2xl md:mx-2">
                    <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4">
                        <Link href="/admin" className="flex items-center gap-2 bg-emerald-900/40 hover:bg-emerald-800 text-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-700/30">
                            <FaArrowLeft /> Back
                        </Link>
                        <div className="text-right md:text-left">
                            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 italic">
                                <FaCalendarAlt className="text-emerald-500" /> EVENTS EDITOR
                            </h1>
                            <p className="text-[10px] text-emerald-500/50 font-bold uppercase tracking-widest flex items-center gap-1"><FaSortAmountDown /> Recent edits move to top</p>
                        </div>
                    </div>
                    <button onClick={saveEverything} disabled={saving} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? <FaSync className="animate-spin" /> : "PUBLISH & REORDER"}
                    </button>
                </header>

                <div className="px-3 space-y-8">
                    {/* PAGE HEADER SETTINGS */}
                    <section className="bg-emerald-950/10 px-3 py-6 md:p-6 rounded-lg md:rounded-3xl border border-emerald-900/20 shadow-xl space-y-4">
                        <h2 className="text-emerald-400 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2 underline underline-offset-8">Hero Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-emerald-700 uppercase ml-2">Main Title</label>
                                <input className="w-full p-4 bg-[#08120c] border border-emerald-900/30 rounded-xl outline-none focus:border-emerald-500 text-white font-bold" value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-emerald-700 uppercase ml-2">Subtitle</label>
                                <input className="w-full p-4 bg-[#08120c] border border-emerald-900/30 rounded-xl outline-none focus:border-emerald-500 text-gray-200" value={data.header.subtitle} onChange={(e) => setData({...data, header: {...data.header, subtitle: e.target.value}})} />
                            </div>
                        </div>
                    </section>

                    {/* EVENTS GRID EDITOR */}
                    <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-4 px-2">
                        <h2 className="text-emerald-400 font-bold uppercase text-xs tracking-[0.2em]">Manage Event Cards</h2>
                        <button onClick={addEvent} className="w-50 bg-white text-black px-6 py-3 rounded-xl text-xs font-black flex justify-center items-center gap-2 hover:bg-emerald-400 transition-all active:scale-95 shadow-xl">
                            <FaPlus /> NEW EVENT
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.events.map((event: any, idx: number) => (
                            <div key={event.id} className="relative bg-emerald-950/10 rounded-lg md:rounded-3xl border border-emerald-900/20 overflow-hidden group">
                                
                                {/* DELETE OVERLAY */}
                                {confirmDelete === idx && (
                                    <div className="absolute inset-0 z-50 bg-[#040d08]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-200">
                                        <FaExclamationTriangle className="text-amber-500 text-4xl mb-4" />
                                        <h3 className="font-black text-white text-lg uppercase italic">Delete this event?</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => setConfirmDelete(null)} className="px-8 py-3 bg-emerald-900/40 rounded-xl text-xs font-bold uppercase tracking-widest">Cancel</button>
                                            <button onClick={() => deleteEvent(idx)} className="px-8 py-3 bg-red-600 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-600/20">Delete</button>
                                        </div>
                                    </div>
                                )}

                                <div className="p-3 md:p-4 flex flex-col gap-4">
                                    {/* MEDIA PREVIEW */}
                                    <div className="relative h-56 w-full rounded-lg md:rounded-2xl bg-black border border-emerald-900/30 overflow-hidden">
                                        {(previews[idx] || event.mediaUrl) ? (
                                            event.type === 'video' ? (
                                                <video src={previews[idx] || event.mediaUrl} className="w-full h-full object-cover opacity-60" muted />
                                            ) : (
                                                <img src={previews[idx] || event.mediaUrl} className="w-full h-full object-cover opacity-60" />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-900">
                                                <FaImage size={40} />
                                                <span className="text-[10px] font-black uppercase mt-2">No Media Uploaded</span>
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <button onClick={() => updateEventWithTimestamp(idx, { type: 'image' })} className={`p-2 rounded-lg transition-all ${event.type === 'image' ? 'bg-emerald-500 text-black' : 'bg-black/60 text-white hover:bg-black'}`}><FaImage /></button>
                                            <button onClick={() => updateEventWithTimestamp(idx, { type: 'video' })} className={`p-2 rounded-lg transition-all ${event.type === 'video' ? 'bg-emerald-500 text-black' : 'bg-black/60 text-white hover:bg-black'}`}><FaVideo /></button>
                                        </div>

                                        <button onClick={() => setConfirmDelete(idx)} className="absolute top-4 right-4 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-xl transition-all"><FaTrash /></button>
                                    </div>

                                    {/* MEDIA SOURCES */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <label className="flex items-center justify-center gap-2 bg-emerald-900/30 p-3 rounded-xl text-[10px] font-black cursor-pointer hover:bg-emerald-800 border border-emerald-700/30 uppercase tracking-widest"><FaUpload /> File<input type="file" hidden accept={event.type === 'video' ? "video/*" : "image/*"} onChange={(e) => handleFileChange(e, idx)} /></label>
                                        <div className="relative">
                                            <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700" />
                                            <input className="w-full p-3 pl-9 bg-[#08120c] border border-emerald-900/30 rounded-xl outline-none focus:border-emerald-500 text-[10px]" placeholder="URL" value={event.mediaUrl} onChange={(e) => updateEventWithTimestamp(idx, { mediaUrl: e.target.value })} />
                                        </div>
                                    </div>

                                    {/* CONTENT EDITING */}
                                    <div className="space-y-3">
                                        <input className="w-full p-4 bg-[#08120c] border border-emerald-900/30 rounded-xl outline-none focus:border-emerald-500 text-white font-black italic uppercase tracking-tighter" placeholder="Event Title" value={event.title} onChange={(e) => updateEventWithTimestamp(idx, { title: e.target.value })} />
                                        <textarea className="w-full p-4 bg-[#08120c] border border-emerald-900/30 rounded-xl outline-none focus:border-emerald-500 text-emerald-500 text-sm h-20 leading-relaxed" placeholder="Short description..." value={event.description} onChange={(e) => updateEventWithTimestamp(idx, { description: e.target.value })} />
                                        <textarea className="w-full p-4 bg-[#08120c] border border-emerald-900/30 rounded-xl outline-none focus:border-emerald-500 text-slate-300 text-sm h-32 leading-relaxed" placeholder="Full story content..." value={event.content} onChange={(e) => updateEventWithTimestamp(idx, { content: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
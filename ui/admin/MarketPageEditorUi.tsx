"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { 
  FaStore, FaSync, FaPlus, FaTrash, FaArrowLeft, 
  FaImage, FaUpload, FaExclamationTriangle, FaTimes, 
  FaCheck, FaLink, FaSortAmountDown, FaMoneyBillWave 
} from "react-icons/fa";
import Link from "next/link";

export default function MarketPageEditorUi() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});
    const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>({});
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "settings", "marketPage");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                // ✅ Sort by newest update on load
                if (fetchedData.items) {
                    fetchedData.items.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));
                }
                setData(fetchedData);
            } else {
                setData({
                    header: { title: "Laboc Market Place", subtitle: "Updates, Tributes, & Premium Services" },
                    items: []
                });
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const updateItemWithTimestamp = (index: number, updatedFields: any) => {
        const temp = [...data.items];
        temp[index] = { 
            ...temp[index], 
            ...updatedFields, 
            updatedAt: Date.now() // Logic to move edited item to top
        };
        setData({ ...data, items: temp });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const objectUrl = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, [index]: objectUrl }));
        setFilesToUpload(prev => ({ ...prev, [index]: file }));
        updateItemWithTimestamp(index, { mediaUrl: objectUrl });
    };

    const saveEverything = async () => {
        setSaving(true);
        const tId = toast.loading("Publishing Market items...");
        try {
            let updatedItems = [...data.items];

            for (const indexStr in filesToUpload) {
                const index = parseInt(indexStr);
                const file = filesToUpload[index];
                const storageRef = ref(storage, `market/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                updatedItems[index].mediaUrl = url;
            }

            // ✅ FINAL SORT: Ensure most recently edited are at the top
            updatedItems.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));

            const finalData = { ...data, items: updatedItems };
            await setDoc(doc(db, "settings", "marketPage"), finalData);
            
            setFilesToUpload({});
            setPreviews({});
            setData(finalData);
            toast.success("Market Reordered & Live!", { id: tId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to save market", { id: tId });
        } finally {
            setSaving(false);
        }
    };

    const addItem = () => {
        const newItem = {
            id: Date.now(),
            title: "",
            description: "",
            content: "",
            mediaUrl: "",
            price: 0,
            type: "image", // Image only as requested
            updatedAt: Date.now()
        };
        setData({ ...data, items: [newItem, ...data.items] });
    };

    const deleteItem = (index: number) => {
        const filtered = data.items.filter((_: any, i: number) => i !== index);
        setData({ ...data, items: filtered });
        setConfirmDelete(null);
    };

    if (loading) return <div className="h-screen bg-black flex items-center justify-center text-amber-500 font-black animate-pulse tracking-widest uppercase">Initializing Market Editor...</div>;

    return (
        <div className="min-h-screen bg-black text-slate-200 pb-20 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* STICKY HEADER */}
                <header className="flex flex-col gap-4 md:flex-row justify-between items-center bg-gray-900/80 backdrop-blur-xl p-4 md:p-6 sticky top-4 z-50 border border-gray-800 md:rounded-3xl shadow-2xl md:mx-2">
                    <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4">
                        <Link href="/admin" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-600">
                            <FaArrowLeft /> Back
                        </Link>
                        <div className="text-right md:text-left">
                            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 italic uppercase">
                                <FaStore className="text-amber-500" /> Market Editor
                            </h1>
                            <p className="text-[10px] text-amber-500/50 font-bold uppercase tracking-widest flex items-center gap-1"><FaSortAmountDown /> Recent edits move to top</p>
                        </div>
                    </div>
                    <button onClick={saveEverything} disabled={saving} className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? <FaSync className="animate-spin" /> : "PUBLISH MARKET"}
                    </button>
                </header>

                <div className="px-3 space-y-8">
                    {/* PAGE HEADER SETTINGS */}
                    <section className="bg-gray-900/40 px-3 py-6 md:p-6 rounded-lg md:rounded-3xl border border-gray-800 shadow-xl space-y-4">
                        <h2 className="text-amber-400 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2 underline underline-offset-8">Page Header</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Header Title</label>
                                <input className="w-full p-4 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-amber-500 text-white font-bold" value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Subtitle</label>
                                <input className="w-full p-4 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-amber-500 text-blue-400" value={data.header.subtitle} onChange={(e) => setData({...data, header: {...data.header, subtitle: e.target.value}})} />
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-4 px-2">
                        <h2 className="text-amber-400 font-bold uppercase text-xs tracking-[0.2em]">Product Inventory</h2>
                        <button onClick={addItem} className="w-50 bg-white text-black px-6 py-3 rounded-xl text-xs font-black flex justify-center items-center gap-2 hover:bg-amber-400 transition-all active:scale-95 shadow-xl">
                            <FaPlus /> ADD PRODUCT
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.items.map((item: any, idx: number) => (
                            <div key={item.id} className="relative bg-gray-900/40 rounded-lg md:rounded-3xl border border-gray-800 overflow-hidden group">
                                
                                {/* DELETE OVERLAY */}
                                {confirmDelete === idx && (
                                    <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-200">
                                        <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
                                        <h3 className="font-black text-white text-lg uppercase italic">Remove Product?</h3>
                                        <div className="flex gap-4 mt-6">
                                            <button onClick={() => setConfirmDelete(null)} className="px-8 py-3 bg-gray-800 rounded-xl text-xs font-bold uppercase">Cancel</button>
                                            <button onClick={() => deleteItem(idx)} className="px-8 py-3 bg-red-600 rounded-xl text-xs font-bold uppercase shadow-lg shadow-red-600/20">Delete</button>
                                        </div>
                                    </div>
                                )}

                                <div className="p-3 md:p-4 flex flex-col gap-4">
                                    {/* IMAGE PREVIEW */}
                                    <div className="relative h-56 w-full rounded-lg md:rounded-2xl bg-black border border-gray-800 overflow-hidden">
                                        {(previews[idx] || item.mediaUrl) ? (
                                            <img src={previews[idx] || item.mediaUrl} className="w-full h-full object-cover opacity-70" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-800">
                                                <FaImage size={40} />
                                                <span className="text-[10px] font-black uppercase mt-2">No Image</span>
                                            </div>
                                        )}
                                        <button onClick={() => setConfirmDelete(idx)} className="absolute top-4 right-4 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-xl transition-all"><FaTrash /></button>
                                    </div>

                                    {/* SOURCES & PRICE */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <label className="flex items-center justify-center gap-2 bg-gray-800 p-3 rounded-xl text-[10px] font-black cursor-pointer hover:bg-gray-700 border border-gray-700 uppercase tracking-widest"><FaUpload /> Upload<input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, idx)} /></label>
                                        <input className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-amber-500 text-[10px]" placeholder="Image URL" value={item.mediaUrl} onChange={(e) => updateItemWithTimestamp(idx, { mediaUrl: e.target.value })} />
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-xs">₦</span>
                                            <input type="number" className="w-full p-3 pl-7 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-amber-500 text-[10px] font-bold" placeholder="Price" value={item.price} onChange={(e) => updateItemWithTimestamp(idx, { price: Number(e.target.value) })} />
                                        </div>
                                    </div>

                                    {/* TEXT CONTENT */}
                                    <div className="space-y-3">
                                        <input className="w-full p-4 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-amber-500 text-white font-black uppercase italic tracking-tighter" placeholder="Product Name" value={item.title} onChange={(e) => updateItemWithTimestamp(idx, { title: e.target.value })} />
                                        <textarea className="w-full p-4 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-amber-500 text-gray-400 text-sm h-20" placeholder="Card description..." value={item.description} onChange={(e) => updateItemWithTimestamp(idx, { description: e.target.value })} />
                                        <textarea className="w-full p-4 bg-gray-950 border border-gray-800 rounded-xl outline-none focus:border-amber-500 text-slate-300 text-sm h-32" placeholder="Full product details..." value={item.content} onChange={(e) => updateItemWithTimestamp(idx, { content: e.target.value })} />
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
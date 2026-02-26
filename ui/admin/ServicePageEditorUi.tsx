"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { 
  FaConciergeBell, FaEdit, FaSync, FaUpload, FaArrowLeft, FaPlus, 
  FaTrash, FaLayerGroup, FaTag, FaCar, FaHorse, FaUsers, FaAsterisk, 
  FaCamera, FaLeaf, FaExclamationTriangle, FaTimes, FaCheck 
} from "react-icons/fa";
import Link from "next/link";

// ✅ 1. ICON MAPPING OBJECT
const priceIcons: { [key: string]: React.ReactNode } = {
  "Car": <FaCar />,
  "Horse": <FaHorse />,
  "Users": <FaUsers />,
  "Decoration": <FaAsterisk />,
  "Wreath": <FaLeaf />,
  "Camera": <FaCamera />,
  "Default": <FaTag />
};

export default function ServicePageEditorUi() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});
    const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>({});

    // ✅ State for Overlays
    const [confirmDelete, setConfirmDelete] = useState<{ 
        type: 'service' | 'pricing' | 'item', 
        index: number, 
        subIndex?: number 
    } | null>(null);

    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ category: "", description: "", icon: "" });

    const [editingItem, setEditingItem] = useState<{ catIdx: number, itemIdx: number } | null>(null);
    const [itemForm, setItemForm] = useState({ name: "", price: "", note: "" });

    const iconOptions = ["🎗️", "⚱️", "📋", "🤝", "🚗", "💎", "🚔", "💐", "⚰️", "🕯️", "🕊️"];

    useEffect(() => {
        const fetchData = async () => {
        const docRef = doc(db, "settings", "servicePage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setData(docSnap.data());
        } else {
            setData({
            header: { title: "Our Services", description: "Dignified and transparent pricing." },
            services: [],
            pricing: []
            });
        }
        setLoading(false);
        };
        fetchData();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, [path]: objectUrl }));
        setFilesToUpload(prev => ({ ...prev, [path]: file }));
    };

    const saveEverything = async () => {
        setSaving(true);
        const tId = toast.loading("Publishing services data...");
        try {
        let updatedData = JSON.parse(JSON.stringify(data));
        for (const [key, file] of Object.entries(filesToUpload)) {
            const storageRef = ref(storage, `servicePage/${key}_${Date.now()}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            if (key.startsWith('svc_img_')) {
            const idx = parseInt(key.split('_')[2]);
            updatedData.services[idx].image = downloadUrl;
            }
        }
        await setDoc(doc(db, "settings", "servicePage"), updatedData);
        setFilesToUpload({});
        setPreviews({});
        setData(updatedData);
        toast.success("Service Page Updated!", { id: tId });
        } catch (error) {
        toast.error("Save failed", { id: tId });
        } finally {
        setSaving(false);
        }
    };

    // --- Add New Cartegory---
    const addPriceCategory = () => {
        setData({
        ...data,
        pricing: [{ category: "New Category", icon: "Default", description: "", items: [] }, ...data.pricing]
        });
    };


    // --- Logic Functions ---
    const updatePriceCategory = (idx: number) => {
        const temp = [...data.pricing];
        temp[idx] = { ...temp[idx], ...editForm };
        setData({ ...data, pricing: temp });
        setEditingCategory(null);
        toast.success("Category updated locally");
    };

    const updatePriceItem = (cIdx: number, iIdx: number) => {
        const temp = [...data.pricing];
        temp[cIdx].items[iIdx] = { ...itemForm };
        setData({ ...data, pricing: temp });
        setEditingItem(null);
        toast.success("Item updated locally");
    };

    const addService = () => {
        setData({
        ...data,
        services: [{ title: "", description: "", longDescription: "", image: "", icon: "🎗️" }, ...data.services, ]
        });
    };

    const deleteService = (idx: number) => {
        const filtered = data.services.filter((_: any, i: number) => i !== idx);
        setData({ ...data, services: filtered });
        setConfirmDelete(null);
    };

    const deletePriceCategory = (idx: number) => {
        const filtered = data.pricing.filter((_: any, i: number) => i !== idx);
        setData({ ...data, pricing: filtered });
        setConfirmDelete(null);
    };

    const addPriceItem = (catIdx: number) => {
        const temp = [...data.pricing];
        temp[catIdx].items.push({ name: "", price: "", note: "" });
        setData({ pricing: temp, ...data});
    };

    const deletePriceItem = (catIdx: number, itemIdx: number) => {
        const temp = [...data.pricing];
        temp[catIdx].items.splice(itemIdx, 1);
        setData({ ...data, pricing: temp });
        setConfirmDelete(null);
    };

    if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-bold tracking-widest animate-pulse">LABOC INITIALIZING...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
            <div className="max-w-6xl mx-auto space-y-8">
                
                <header className="flex flex-col gap-2 md:flex-row justify-between items-center bg-slate-900/80 backdrop-blur-md p-4 md:p-6 md:rounded-3xl border border-slate-800 sticky top-4 z-50 shadow-2xl">
                    <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4">
                        <Link href="/admin" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700">
                            <FaArrowLeft /> Back
                        </Link>
                        <div className="text-right md:text-left">
                        <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 italic md:not-italic">
                            <FaConciergeBell className="hidden md:block text-blue-500" /> SERVICE EDITOR
                        </h1>
                        <p className="hidden md:block text-slate-500 text-xs font-bold uppercase tracking-widest">LABOC DASHBOARD</p>
                        </div>
                    </div>
                    <button onClick={saveEverything} disabled={saving} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50">
                        {saving ? <FaSync className="animate-spin" /> : "PUBLISH CHANGES"}
                    </button>
                </header>

                <div className="px-2 space-y-8">
                    {/* 1. HEADER SECTION */}
                    <section className="bg-slate-900 px-2 py-6 md:p-6 rounded-lg md:rounded-3xl border border-slate-800 shadow-xl space-y-4">
                        <h2 className="text-blue-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2"><FaEdit /> Page Header</h2>
                        <input className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-blue-500" value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} placeholder="Main Title" />
                        <textarea className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-blue-500" value={data.header.description} onChange={(e) => setData({...data, header: {...data.header, description: e.target.value}})} placeholder="Short Intro Description" />
                    </section>

                    {/* 2. PRICING EDITOR */}
                    <section className="bg-slate-900 px-2 py-6 md:p-6 rounded-lg md:rounded-3xl border border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-blue-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2"><FaTag /> Price Quotations</h2>
                            <button onClick={addPriceCategory} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-amber-500"><FaPlus /> NEW CATEGORY</button>
                        </div>

                        <div className="space-y-8">
                            {data.pricing.map((cat: any, cIdx: number) => (
                            <div key={cIdx} className="overflow-y-auto relative bg-slate-800/30 p-3 md:p-4 md:rounded-lg md:rounded-2xl border border-slate-700 overflow-hidden">
                                
                                {/* CATEGORY EDIT OVERLAY */}
                                {editingCategory === cIdx && (
                                    <div className="absolute inset-0 z-10 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center py-4 px-3 md:p-6 text-center overflow-y-auto animate-in zoom-in duration-200">
                                        <FaEdit className="text-blue-500 text-3xl mb-2" />
                                        <h3 className="font-black text-white text-sm uppercase italic">Edit Category</h3>
                                        <div className="w-full space-y-3 mt-4">
                                            <input 
                                                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md md:rounded-xl outline-none focus:border-blue-500 text-sm"
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                                placeholder="Category Name"
                                            />
                                            <input 
                                                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md md:rounded-xl outline-none focus:border-blue-500 text-sm"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                                placeholder="Category Description"
                                            />
                                            <div className="flex items-center gap-2 bg-slate-800 p-3 rounded-md md:rounded-xl border border-slate-700">
                                                <span className="text-amber-500 text-xl">{priceIcons[editForm.icon || "Default"]}</span>
                                                <select 
                                                    className="flex-1 bg-transparent text-sm outline-none font-bold"
                                                    value={editForm.icon || "Default"} 
                                                    onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                                                >
                                                    {Object.keys(priceIcons).map(key => (
                                                        <option key={key} value={key} className="bg-slate-800">{key}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 md:gap-4 mt-6">
                                            <button onClick={() => setEditingCategory(null)} className="px-6 py-2 bg-slate-800 rounded-md md:rounded-xl text-xs font-bold uppercase">Cancel</button>
                                            <button onClick={() => updatePriceCategory(cIdx)} className="px-6 py-2 bg-blue-600 rounded-md md:rounded-xl text-xs font-bold uppercase flex items-center gap-2"><FaEdit /> Update</button>
                                        </div>
                                    </div>
                                )}

                                {/* CATEGORY DELETE OVERLAY */}
                                {confirmDelete?.type === 'pricing' && confirmDelete.index === cIdx && (
                                    <div className="absolute inset-0 z-10 bg-black backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-200">
                                        <FaExclamationTriangle className="text-red-500 text-3xl mb-2" />
                                        <h3 className="font-black text-white text-sm uppercase italic">Delete Category?</h3>
                                        <p className="text-slate-400 text-xs mt-1 mb-4">Are you sure? This deletes everything in this list.</p>
                                        <div className="flex gap-4">
                                            <button onClick={() => setConfirmDelete(null)} className="px-6 py-2 bg-slate-800 rounded-xl text-xs font-bold uppercase">Keep</button>
                                            <button onClick={() => deletePriceCategory(cIdx)} className="px-6 py-2 bg-red-600 rounded-xl text-xs font-bold uppercase">Delete</button>
                                        </div>
                                    </div>
                                )}

                                {/* CATEGORY HEADER WITH EDIT AND DELETE BUTTON */}
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="relative flex items-center justify-between md:justify-start gap-4">
                                        <div className="flex items-center gap-2 bg-slate-700 p-2 rounded">
                                            <span className="text-amber-500 text-xl">{priceIcons[cat.icon || "Default"]}</span>
                                            <span className="text-xs font-bold">{cat.category}</span>
                                        </div>
                                        <div className="p-1 border border-slate-600 rounded absolute right-0 z-20 bg-slate-700 flex items-center gap-5 md:gap-2 md:hidden">
                                            <button onClick={() => {
                                                setEditForm({ category: cat.category, description: cat.description, icon: cat.icon || "Default" });
                                                setEditingCategory(cIdx);
                                            }} className="text-blue-500 bg-blue-500/10 p-2 rounded-lg"><FaEdit size={12} /></button>
                                            <button onClick={() => setConfirmDelete({ type: 'pricing', index: cIdx })} className="text-red-500 bg-red-500/10 p-2 rounded-lg"><FaTrash size={12} /></button>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex items-center gap-2">
                                        <input className="flex-1 bg-transparent border-b border-blue-500 text-lg font-bold outline-none" value={cat.category} placeholder="Category Name" readOnly />
                                        <div className="hidden md:flex items-center gap-2">
                                            <button onClick={() => {
                                                setEditForm({ category: cat.category, description: cat.description, icon: cat.icon || "Default" });
                                                setEditingCategory(cIdx);
                                            }} className="text-blue-500 hover:text-blue-400"><FaEdit /></button>
                                            <button onClick={() => setConfirmDelete({ type: 'pricing', index: cIdx })} className="text-red-500"><FaTrash /></button>
                                        </div>
                                    </div>
                                </div>
                                
                                <input className="w-full bg-transparent border-b border-slate-700 text-xs mb-4 outline-none" value={cat.description} placeholder="Subtitle (e.g. Transportation inclusive)" readOnly />

                                {/* ITEM LIST */}
                                <div className="space-y-2">
                                    {cat.items.map((item: any, iIdx: number) => (
                                    <div key={iIdx} className="relative flex flex-col md:flex-row gap-2 bg-black/20 p-2 rounded-lg group/item">
                                        
                                        {/* ITEM EDIT OVERLAY */}
                                        {editingItem?.catIdx === cIdx && editingItem.itemIdx === iIdx && (
                                            <div className="h-[24rem] md:h-58 absolute inset-0 z-10 bg-slate-950/95 backdrop-blur-md flex flex-col items-center md:justify-center px-2 py-4 md:p-6 text-center animate-in zoom-in duration-200">
                                                <FaEdit className="text-blue-500 text-3xl mb-2" />
                                                <h3 className="font-black text-white text-sm uppercase italic">Edit Item</h3>
                                                <div className="w-full space-y-3 mt-4">
                                                    <input className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md md:rounded-xl outline-none focus:border-blue-500 text-sm" value={itemForm.name} onChange={(e) => setItemForm({...itemForm, name: e.target.value})} placeholder="Item Name" />
                                                    <div className="flex flex-col md:flex-row gap-2">
                                                        <input className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-md md:rounded-xl outline-none focus:border-blue-500 text-sm" value={itemForm.price} onChange={(e) => setItemForm({...itemForm, price: e.target.value})} placeholder="Price (₦)" />
                                                        <input className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-md md:rounded-xl outline-none focus:border-blue-500 text-sm italic" value={itemForm.note} onChange={(e) => setItemForm({...itemForm, note: e.target.value})} placeholder="Short note" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 md:gap-4 mt-6">
                                                    <button onClick={() => setEditingItem(null)} className="px-6 py-2 bg-slate-800 rounded-md md:rounded-xl text-xs font-bold uppercase">Cancel</button>
                                                    <button onClick={() => updatePriceItem(cIdx, iIdx)} className="px-6 py-2 bg-blue-600 rounded-md md:rounded-xl text-xs font-bold uppercase flex items-center gap-2"><FaEdit /> Update</button>
                                                </div>
                                            </div>
                                        )}

                                        {/* ITEM DELETE OVERLAY */}
                                        {confirmDelete?.type === 'item' && confirmDelete.index === cIdx && confirmDelete.subIndex === iIdx && (
                                            <div className="absolute inset-0 z-10 bg-red-950/95 flex items-center justify-between px-4 animate-in slide-in-from-right duration-200">
                                                <p className="text-[10px] font-black uppercase text-white flex items-center gap-2">Confirm Item Deletion?</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setConfirmDelete(null)} className="p-1.5 bg-white/10 rounded-lg"><FaTimes /></button>
                                                    <button onClick={() => deletePriceItem(cIdx, iIdx)} className="p-1.5 bg-red-600 rounded-lg"><FaCheck /></button>
                                                </div>
                                            </div>
                                        )}

                                        <input className="flex-[2] bg-transparent text-sm outline-none" value={item.name} placeholder="Item Name" readOnly />
                                        <div className="flex gap-2">
                                            <input className="flex-1 bg-transparent text-sm font-bold text-emerald-400 outline-none" value={item.price} placeholder="Price (₦)" readOnly />
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => {
                                                    setItemForm({ name: item.name, price: item.price, note: item.note });
                                                    setEditingItem({ catIdx: cIdx, itemIdx: iIdx });
                                                }} className="text-blue-500 hover:text-blue-400 p-2 md:p-0"><FaEdit size={12}/></button>
                                                <button onClick={() => setConfirmDelete({ type: 'item', index: cIdx, subIndex: iIdx })} className="text-slate-600 hover:text-red-500 p-2 md:p-0"><FaTrash size={12}/></button>
                                            </div>
                                        </div>
                                        <input className="flex-1 bg-transparent text-[10px] italic outline-none" value={item.note} placeholder="Short note" readOnly />
                                    </div>
                                    ))}
                                    <button onClick={() => addPriceItem(cIdx)} className="text-[10px] text-blue-400 font-bold uppercase mt-2">+ Add Item</button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. SERVICES */}
                    <section className="bg-slate-900 px-2 py-6 md:p-6 rounded-lg md:rounded-3xl border border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-blue-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2"><FaLayerGroup /> Service Cards</h2>
                            <button onClick={addService} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-emerald-500"><FaPlus /> ADD CARD</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.services.map((svc: any, idx: number) => (
                            <div key={idx} className="bg-slate-800/50 p-3 md:p-4 rounded-lg md:rounded-2xl border border-slate-700 relative group overflow-hidden">
                                
                                {/* SERVICE DELETE OVERLAY */}
                                {confirmDelete?.type === 'service' && confirmDelete.index === idx && (
                                    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-200">
                                        <FaExclamationTriangle className="text-red-500 text-3xl mb-2" />
                                        <h3 className="font-black text-white text-sm uppercase italic">Delete Card?</h3>
                                        <p className="text-slate-400 text-[10px] mt-1 mb-4">This will be removed from the site.</p>
                                        <div className="flex gap-3">
                                            <button onClick={() => setConfirmDelete(null)} className="px-5 py-2 bg-slate-800 rounded-xl text-[10px] font-bold uppercase">Keep</button>
                                            <button onClick={() => deleteService(idx)} className="px-5 py-2 bg-red-600 rounded-xl text-[10px] font-bold uppercase">Delete</button>
                                        </div>
                                    </div>
                                )}

                                <button onClick={() => setConfirmDelete({ type: 'service', index: idx })} className="absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"><FaTrash size={12} /></button>
                                
                                <div className="flex flex-col gap-4 mb-4">
                                <div className="w-full md:w-24 h-48 md:h-24 rounded-xl bg-black overflow-hidden border border-slate-600 shadow-lg">
                                    <img src={previews[`svc_img_${idx}`] || svc.image || '/placeholder.jpg'} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <select className="bg-slate-700 p-3 md:p-2 rounded text-lg outline-none" value={svc.icon} onChange={(e) => {
                                            const temp = [...data.services]; temp[idx].icon = e.target.value; setData({...data, services: temp});
                                        }}>
                                            {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                        </select>
                                        <input className="flex-1 bg-slate-700 p-3 md:p-2 rounded text-sm font-bold outline-none" value={svc.title} onChange={(e) => {
                                            const temp = [...data.services]; temp[idx].title = e.target.value; setData({...data, services: temp});
                                        }} placeholder="Card Title" />
                                    </div>
                                    <label className="flex items-center justify-center gap-2 bg-slate-700 p-3 md:p-2 rounded text-[10px] cursor-pointer hover:bg-slate-600 border border-slate-600 uppercase font-black"><FaUpload /> UPLOAD FILE<input type="file" hidden onChange={(e) => handleFileChange(e, `svc_img_${idx}`)} /></label>
                                </div>
                                </div>

                                <textarea className="w-full p-3 bg-slate-900 border border-slate-700 rounded text-xs mb-2 h-16" value={svc.description} onChange={(e) => {
                                    const temp = [...data.services]; temp[idx].description = e.target.value; setData({...data, services: temp});
                                }} placeholder="Short Description" />
                                
                                <textarea className="w-full p-3 bg-slate-900 border border-slate-700 rounded text-xs h-28 focus:border-blue-500 outline-none" value={svc.longDescription} onChange={(e) => {
                                    const temp = [...data.services]; temp[idx].longDescription = e.target.value; setData({...data, services: temp});
                                }} placeholder="Long Detailed Description" />
                                
                                <input className="w-full mt-2 p-2 bg-slate-900 border border-slate-700 rounded text-[10px] outline-none italic" value={svc.image} onChange={(e) => {
                                    const temp = [...data.services]; temp[idx].image = e.target.value; setData({...data, services: temp});
                                    setPreviews(prev => ({ ...prev, [`svc_img_${idx}`]: '' }));
                                }} placeholder="Or Paste Image URL" />
                            </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
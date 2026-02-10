"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { FaSave, FaImage, FaVideo, FaLink, FaEdit, FaSync, FaQuoteLeft, FaUpload, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function HomePageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>({});

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "settings", "homePage");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData({
          hero: { title: "", subtitle: "", image: "" },
          services: [
            { title: "Service 1", desc: "", link: "/services", images: ["", "", ""] },
            { title: "Service 2", desc: "", link: "/events", images: ["", "", ""] },
            { title: "Service 3", desc: "", link: "/blog", images: ["", "", ""] },
          ],
          values: { 
            heading: "Why Families Trust Laboc", 
            list: [{title: "", desc: ""}, {title: "", desc: ""}, {title: "", desc: ""}], 
            image: "" 
          },
          legacy: { quote: "", heading: "", videoUrl: "", steps: [{title: "", desc: "", step: "01"}, {title: "", desc: "", step: "02"}, {title: "", desc: "", step: "03"}] }
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, path: string, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'video' && file.size > 15 * 1024 * 1024) {
      return toast.error("Video is too large (Max 15MB)");
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [path]: objectUrl }));
    setFilesToUpload(prev => ({ ...prev, [path]: file }));
    toast.success("New media ready for preview!");
  };

  const saveEverything = async () => {
    setSaving(true);
    const tId = toast.loading("Publishing all changes...");
    try {
      let updatedData = JSON.parse(JSON.stringify(data)); 

      for (const [key, file] of Object.entries(filesToUpload)) {
        const storageRef = ref(storage, `homePage/${key}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        if (key === 'hero') updatedData.hero.image = downloadUrl;
        else if (key === 'values') updatedData.values.image = downloadUrl;
        else if (key === 'legacy') updatedData.legacy.videoUrl = downloadUrl;
        else if (key.startsWith('service_')) {
            const [_, sIdx, iIdx] = key.split('_');
            updatedData.services[parseInt(sIdx)].images[parseInt(iIdx)] = downloadUrl;
        }
      }

      await setDoc(doc(db, "settings", "homePage"), updatedData);
      
      setData(updatedData);
      setFilesToUpload({});
      setPreviews({});
      toast.success("Home page published successfully!", { id: tId });
    } catch (error) {
      console.error(error);
      toast.error("Save failed.", { id: tId });
    }
    setSaving(false);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500 animate-pulse font-bold tracking-widest">LABOC INITIALIZING...</div>;

  return (
    <div className="min-h-screen bg-slate-950 md:p-8 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        <header className="flex flex-col gap-2 md:flex-row justify-between items-center bg-slate-900/80 backdrop-blur-md p-4 md:p-6 md:rounded-3xl border border-slate-800 sticky top-4 z-[100] shadow-2xl">
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4">
             <Link href="/admin" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700">
                <FaArrowLeft /> Back
             </Link>
             <div className="text-right md:text-left">
               <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 italic md:not-italic"><FaEdit className="hidden md:block text-blue-500" /> HOMEPAGE EDITOR</h1>
               <p className="hidden md:block text-slate-500 text-xs font-bold uppercase tracking-widest">LABOC DASHBOARD</p>
             </div>
          </div>
          
          <button onClick={saveEverything} disabled={saving} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50">
            {saving ? <FaSync className="animate-spin" /> : "PUBLISH CHANGES"}
          </button>
        </header>

        <div className="space-y-8 px-2 md:px-0">
            {/* --- HERO --- */}
            <div className="bg-slate-900 px-3 py-6 md:p-8 rounded-lg md:rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-8 shadow-xl">
            <div className="space-y-4">
                <h2 className="text-blue-400 font-bold uppercase text-xs tracking-widest underline underline-offset-8">Hero Content</h2>
                <input className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl font-bold focus:border-blue-500 outline-none" value={data.hero.title} onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})} placeholder="Main Title" />
                <textarea className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl h-32 focus:border-blue-500 outline-none" value={data.hero.subtitle} onChange={(e) => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} placeholder="Hero Subtitle" />
            </div>
            <div className="space-y-4 flex flex-col justify-end">
                <div className="relative h-48 rounded-xl overflow-hidden border border-slate-700 bg-black">
                    <img src={previews['hero'] || data.hero.image || '/placeholder.jpg'} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex gap-2">
                    <input className="flex-1 bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs outline-none" value={data.hero.image} onChange={(e) => {
                        setData({...data, hero: {...data.hero, image: e.target.value}});
                        setPreviews(prev => ({ ...prev, hero: '' })); // Reset file preview if typing URL
                    }} placeholder="Hero Image URL" />
                    <label className="bg-slate-700 p-3 rounded-xl cursor-pointer hover:bg-slate-600 transition-colors"><FaUpload /><input type="file" hidden onChange={(e) => handleFileChange(e, 'hero', 'image')} /></label>
                </div>
            </div>
            </div>

            {/* --- SERVICES --- */}
            <div className="bg-slate-900 px-3 py-6 md:p-8 rounded-lg md:rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-6 underline underline-offset-8">Service Card Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.services.map((s: any, idx: number) => (
                <div key={idx} className="bg-slate-800/50 px-3 py-5 md:p-5 rounded-lg md:rounded-2xl border border-slate-700 space-y-4">
                    <input className="w-full p-2 bg-slate-800 border border-slate-700 rounded font-bold outline-none" value={s.title} onChange={(e) => {
                    const temp = [...data.services]; temp[idx].title = e.target.value; setData({...data, services: temp});
                    }} />
                    <textarea className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-xs h-20 outline-none" value={s.desc} onChange={(e) => {
                    const temp = [...data.services]; temp[idx].desc = e.target.value; setData({...data, services: temp});
                    }} />
                    <div className="space-y-3">
                        {s.images.map((img: string, iIdx: number) => {
                            const pKey = `service_${idx}_${iIdx}`;
                            const displayImg = previews[pKey] || img;
                            return (
                                <div key={iIdx} className="space-y-1">
                                    {/* ✅ SHOW PREVIEW IF EITHER FILE OR URL EXISTS */}
                                    {displayImg && (
                                        <div className="h-16 w-full rounded bg-black/50 overflow-hidden border border-slate-700 animate-in fade-in duration-300">
                                            <img src={displayImg} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x200?text=Invalid+URL')} />
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded text-[10px] outline-none" value={img} onChange={(e) => {
                                            const temp = [...data.services]; temp[idx].images[iIdx] = e.target.value; setData({...data, services: temp});
                                            setPreviews(prev => ({ ...prev, [pKey]: '' })); // Clear file preview if manual URL entered
                                        }} placeholder={`Img URL ${iIdx+1}`} />
                                        <label className="bg-slate-700 px-3 flex items-center rounded cursor-pointer text-[10px] hover:bg-slate-600"><FaUpload /><input type="file" hidden onChange={(e) => handleFileChange(e, pKey, 'image')} /></label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* --- VALUES --- */}
            <div className="bg-slate-900 px-3 py-6 md:p-8 rounded-lg md:rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-6 underline underline-offset-8">Company Values Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 font-black uppercase">Main Heading</label>
                        <input className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl font-bold outline-none" value={data.values.heading} onChange={(e) => setData({...data, values: {...data.values, heading: e.target.value}})} />
                    </div>
                    <div className="space-y-3">
                        {data.values.list.map((v: any, idx: number) => (
                            <div key={idx} className="p-4 bg-slate-800 rounded-xl space-y-2 border border-slate-700 transition-all hover:border-slate-500">
                                <input className="w-full bg-transparent border-b border-slate-700 font-bold text-sm outline-none text-blue-300" value={v.title} onChange={(e) => {
                                    const temp = {...data.values}; temp.list[idx].title = e.target.value; setData({...data, values: temp});
                                }} placeholder="Value Title" />
                                <textarea className="w-full bg-transparent text-xs text-slate-400 outline-none h-12" value={v.desc} onChange={(e) => {
                                    const temp = {...data.values}; temp.list[idx].desc = e.target.value; setData({...data, values: temp});
                                }} placeholder="Value Description" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4 flex flex-col justify-between">
                    <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-700 bg-black">
                        <img src={previews['values'] || data.values.image || '/placeholder.jpg'} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                        <input className="flex-1 bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs outline-none" value={data.values.image} onChange={(e) => {
                            setData({...data, values: {...data.values, image: e.target.value}});
                            setPreviews(prev => ({ ...prev, values: '' }));
                        }} placeholder="Section Image URL" />
                        <label className="bg-slate-700 p-3 rounded-xl cursor-pointer hover:bg-slate-600"><FaUpload /><input type="file" hidden onChange={(e) => handleFileChange(e, 'values', 'image')} /></label>
                    </div>
                </div>
            </div>
            </div>

            {/* --- LEGACY --- */}
            <div className="bg-slate-900 px-3 py-6 md:p-8 rounded-lg md:rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <h2 className="text-blue-400 font-bold uppercase text-xs tracking-widest underline underline-offset-8">Legacy & Process Steps</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700">
                            <video key={previews['legacy'] || data.legacy.videoUrl} src={previews['legacy'] || data.legacy.videoUrl} className="w-full h-full object-cover opacity-60" autoPlay muted loop playsInline />
                            <div className="absolute inset-0 flex items-center justify-center p-6 text-center italic font-serif text-white drop-shadow-lg text-lg">"{data.legacy.quote}"</div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 font-black uppercase">Video Overlay Text</label>
                            <input className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl italic outline-none focus:border-blue-500" value={data.legacy.quote} onChange={(e) => setData({...data, legacy: {...data.legacy, quote: e.target.value}})} />
                        </div>
                        <div className="flex gap-2">
                            <input className="flex-1 bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs outline-none" value={data.legacy.videoUrl} onChange={(e) => {
                                setData({...data, legacy: {...data.legacy, videoUrl: e.target.value}});
                                setPreviews(prev => ({ ...prev, legacy: '' }));
                            }} placeholder="Video URL" />
                            <label className="bg-blue-600 p-3 rounded-xl cursor-pointer hover:bg-blue-500 transition-colors"><FaUpload /><input type="file" hidden accept="video/*" onChange={(e) => handleFileChange(e, 'legacy', 'video')} /></label>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {data.legacy.steps.map((step: any, idx: number) => (
                            <div key={idx} className="flex gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700 items-start">
                                <span className="text-xl font-black text-blue-900 select-none">{step.step}</span>
                                <div className="flex-1 space-y-2">
                                    <input className="w-full bg-transparent border-b border-slate-700 font-bold outline-none" value={step.title} onChange={(e) => {
                                        const temp = {...data.legacy}; temp.steps[idx].title = e.target.value; setData({...data, legacy: temp});
                                    }} placeholder="Step Title" />
                                    <textarea className="w-full bg-transparent text-xs text-slate-400 h-16 outline-none resize-none" value={step.desc} onChange={(e) => {
                                        const temp = {...data.legacy}; temp.steps[idx].desc = e.target.value; setData({...data, legacy: temp});
                                    }} placeholder="Step Description" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
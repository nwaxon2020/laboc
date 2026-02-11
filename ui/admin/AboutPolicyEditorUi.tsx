"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { 
    FaFileContract, FaSync, FaUpload, 
    FaImage, FaArrowLeft, FaTrash,
    FaHistory, FaMedal, FaHeart, FaShieldAlt, FaTiktok,
    FaHandsHelping, FaUserTie, FaBriefcase, FaAward,
    FaUsers,FaEnvelope, FaGlobe, FaFacebook, FaTwitter, 
    FaInstagram, FaLinkedin, FaYoutube
} from "react-icons/fa";
import Link from "next/link";

// Icon Map for Select
const ICON_OPTIONS = [
  { id: 'heart', label: 'Heart (Compassion)', icon: <FaHeart /> },
  { id: 'shield', label: 'Shield (Integrity)', icon: <FaShieldAlt /> },
  { id: 'hands', label: 'Hands (Excellence)', icon: <FaHandsHelping /> },
  { id: 'award', label: 'Award', icon: <FaAward /> },
  { id: 'users', label: 'Users', icon: <FaUsers /> },
  { id: 'briefcase', label: 'Briefcase', icon: <FaBriefcase /> }
];

const SOCIAL_ICON_OPTIONS = [
  { id: 'facebook', label: 'Facebook', icon: <FaFacebook /> },
  { id: 'tiktok', label: 'TikTok', icon: <FaTiktok /> },
  { id: 'instagram', label: 'Instagram', icon: <FaInstagram /> },
  { id: 'twitter', label: 'Twitter', icon: <FaTwitter /> },
  { id: 'youtube', label: 'YouTube', icon: <FaYoutube /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin /> },
];

export default function AboutPolicyEditorUi() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'about' | 'policy'>('about');
  
  const [data, setData] = useState<any>(null);
  const [adminContact, setAdminContact] = useState<any>(null);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; type: string; index: number; section: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "settings", "aboutPolicyPage");
      const docSnap = await getDoc(docRef);
      
      const contactSnap = await getDoc(doc(db, "settings", "dashboard"));
      if (contactSnap.exists()) setAdminContact(contactSnap.data());

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        // Initialize with complete about page structure
        setData({
          about: {
            // Hero Section
            heroTitle: "A Legacy of Compassion",
            heroSubtitle: "Serving communities nationwide with dignity, honor, and professional care for over a decade.",
            heroImages: [
              "https://ggsc.s3.us-west-2.amazonaws.com/assets/images/what_can_we_learn_from_the_worlds_most_peaceful_societies_-_abcdef_-_0a21b39134b316e51cdc0dd96c5e6bca3c0093e9_-_abcdef_-_c3aa4369bd53794b17dba2719890b56de8809755.webp",
              "https://www.quietkarma.org/wp-content/uploads/2018/12/world-peace-vs-inner-peace.jpg",
              "https://thumbs.dreamstime.com/b/word-peace-written-white-letters-body-water-water-appears-to-be-calm-serene-sun-setting-401987715.jpg"
            ],
            
            // CEO Section
            ceoMessage: "\"At Laboc, we believe every life has a story that deserves to be told with honor. Our mission isn't just about services; it's about supporting families during their most difficult moments with a shoulder they can lean on.\"",
            ceoName: "Hon. [CEO Name]",
            ceoPosition: "Founder & Managing Director",
            ceoImage: "/ceo1.png",
            ceoEmail: "labocfuneralservices@gmail.com",
            
            // Core Values
            coreValues: [
              { 
                title: "Compassion", 
                desc: "We treat every family as our own, with deep empathy.", 
                icon: "heart" 
              },
              { 
                title: "Integrity", 
                desc: "Transparent pricing and honest professional advice.", 
                icon: "shield" 
              },
              { 
                title: "Excellence", 
                desc: "Providing world-class funeral arrangements in Nigeria.", 
                icon: "hands" 
              }
            ],
            
            // Legacy Section
            legacyBadge: "Our Legacy",
            about2Title: "About Laboc",
            about2Subtitle: "Funeral Services",
            about2Highlight: "Funeral Services",
            companyDescription: `We believe in providing our services with clarity. Hence, we present a detailed breakdown of all costs involved in our package, ensuring that families can make informed decisions that align with their budget.
            
Our team of experienced professionals is dedicated to providing exceptional service with empathy and respect. We are available 24/7 to assist families and ensure that every detail meets their needs.

We recognize the importance of honouring the life of a loved one and would be honoured to provide our services to you and your family during this time. I would be happy to discuss our funeral package in more detail and answer any questions you may have.

Thank you for considering us as your partner in this important process.
Yours sincerely`,
            
            // Legacy Images (4 grid)
            legacyImages: [
              "/service6.jpeg",
              "/service5.jpeg",
              "/service2.jpeg",
              "/service3.jpeg"
            ],
            
            // Stats - Only 3 are editable (Years of Service comes from adminContact)
            stats: [
              { label: "Families Served", value: "5000+" },
              { label: "Emergency Support", value: "24/7" },
              { label: "Satisfaction", value: "100%" }
            ],
            
            // Additional sections from about page
            sections: {
              hero: {
                highlightWord: "Compassion",
                highlightColor: "text-blue-500",
                highlightStyle: "italic"
              },
              ceo: {
                aboutLink: {
                  text: "About Our Company?",
                  url: "#about2"
                },
                contactLabel: "Founder & Managing Director",
                quoteBorder: true
              },
              legacy: {
                statsLayout: "grid-cols-4",
                statsBackground: "bg-white",
                statsBorder: "border border-slate-100",
                statsRounded: "rounded-2xl"
              }
            },
            
            // Social Media Links
            socialLinks: [
              { platform: "facebook", url: "", icon: "facebook", enabled: false },
              { platform: "twitter", url: "", icon: "twitter", enabled: false },
              { platform: "instagram", url: "", icon: "instagram", enabled: false },
              { platform: "linkedin", url: "", icon: "linkedin", enabled: false },
              { platform: "youtube", url: "", icon: "youtube", enabled: false }
            ],
            
            // Contact Info Display Settings
            contactDisplay: {
              showPhone: true,
              showEmail: true,
              phoneLabel: "Emergency Contact",
              emailLabel: "Email Us"
            }
          },
          policy: {
            title: "Terms & Conditions",
            sections: [{ title: "Acceptance", content: "" }],
            regImage: ""
          }
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const saveEverything = async () => {
    setSaving(true);
    const tId = toast.loading("Saving changes...");
    try {
      let updatedData = { ...data };
      
      // Upload all pending files
      for (const path in filesToUpload) {
        const storageRef = ref(storage, `aboutPolicy/${Date.now()}_${path.replace(/\./g, '_')}`);
        await uploadBytes(storageRef, filesToUpload[path]);
        const url = await getDownloadURL(storageRef);
        
        // Handle nested paths
        const parts = path.split('.');
        if (parts.length === 2) {
          updatedData[parts[0]][parts[1]] = url;
        } else if (parts.length === 3) {
          if (parts[1].includes('Images') || parts[1].includes('legacyImages')) {
            updatedData[parts[0]][parts[1]][parseInt(parts[2])] = url;
          } else {
            updatedData[parts[0]][parts[1]][parts[2]] = url;
          }
        } else if (parts.length === 4) {
          updatedData[parts[0]][parts[1]][parseInt(parts[2])][parts[3]] = url;
        }
      }
      
      await setDoc(doc(db, "settings", "aboutPolicyPage"), updatedData);
      setFilesToUpload({});
      toast.success("Changes Published Successfully!", { id: tId });
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Save failed. Please try again.", { id: tId });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviews(prev => ({ ...prev, [path]: URL.createObjectURL(file) }));
    setFilesToUpload(prev => ({ ...prev, [path]: file }));
  };

  const handleAddCoreValue = () => {
    const newCoreValue = {
      title: "New Value",
      desc: "Description here...",
      icon: "heart"
    };
    setData({
      ...data,
      about: {
        ...data.about,
        coreValues: [...(data.about.coreValues || []), newCoreValue]
      }
    });
  };

  const handleRemoveCoreValue = (index: number) => {
    const updated = [...data.about.coreValues];
    updated.splice(index, 1);
    setData({
      ...data,
      about: {
        ...data.about,
        coreValues: updated
      }
    });
    setDeleteConfirm(null);
  };

  const handleAddStat = () => {
    const newStat = {
      label: "New Statistic",
      value: "0"
    };
    setData({
      ...data,
      about: {
        ...data.about,
        stats: [...(data.about.stats || []), newStat]
      }
    });
  };

  const handleRemoveStat = (index: number) => {
    const updated = [...data.about.stats];
    updated.splice(index, 1);
    setData({
      ...data,
      about: {
        ...data.about,
        stats: updated
      }
    });
    setDeleteConfirm(null);
  };

  const handleRemoveSocialLink = (index: number) => {
    const updated = [...data.about.socialLinks];
    updated.splice(index, 1);
    setData({
      ...data,
      about: {
        ...data.about,
        socialLinks: updated
      }
    });
    setDeleteConfirm(null);
  };

  if (loading) return (
    <div className="h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-blue-600 font-bold animate-pulse">LOADING EDITOR...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row gap-4 justify-between items-center p-5 md:p-8 bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-200">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                Visual Content Editor
              </h1>
              <p className="text-xs text-slate-500 mt-1">Complete About Page Control</p>
            </div>
          </div>
          <button 
            onClick={saveEverything} 
            disabled={saving} 
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
          >
            {saving ? <FaSync className="animate-spin" /> : <FaUpload />}
            {saving ? "PUBLISHING..." : "PUBLISH LIVE"}
          </button>
        </header>

        <div className="px-2 space-y-8">
          
          {/* PAGE SELECTOR */}
          <div className="bg-white p-2 rounded-lg md:rounded-3xl shadow-sm border border-slate-200 flex gap-2">
            <button 
              onClick={() => setActiveSection('about')} 
              className={`flex-1 py-4 rounded-lg md:rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeSection === 'about' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              About Page - Complete Editor
            </button>
            <button 
              onClick={() => setActiveSection('policy')} 
              className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeSection === 'policy' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              Policy Page
            </button>
          </div>

          {activeSection === 'about' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
              
              {/* HERO SECTION - COMPLETE EDITOR */}
              <div className="bg-white rounded-lg md:rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 md:p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <FaImage />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 uppercase text-sm">Hero Section - Slideshow</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">3 rotating background images with title & subtitle</p>
                  </div>
                </div>
                
                <div className="p-3 md:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hero Title</label>
                      <input 
                        className="w-full p-4 bg-slate-50 border-none rounded-lg md:rounded-2xl font-bold text-slate-800"
                        value={data.about.heroTitle} 
                        onChange={(e) => setData({
                          ...data, 
                          about: {...data.about, heroTitle: e.target.value}
                        })} 
                        placeholder="Hero Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Highlight Word</label>
                      <div className="flex flex-col md:flex-row gap-2">
                        <input 
                          className="flex-1 p-4 bg-slate-50 border-none rounded-lg md:rounded-2xl font-bold text-blue-600"
                          value={data.about.sections?.hero?.highlightWord || "Compassion"} 
                          onChange={(e) => {
                            const sections = data.about.sections || { hero: {} };
                            sections.hero = { ...sections.hero, highlightWord: e.target.value };
                            setData({
                              ...data,
                              about: {...data.about, sections}
                            });
                          }} 
                          placeholder="Highlighted word"
                        />
                        <select 
                          className="p-4 bg-slate-50 border-none rounded-lg md:rounded-2xl text-xs font-bold"
                          value={data.about.sections?.hero?.highlightColor || "text-blue-500"}
                          onChange={(e) => {
                            const sections = data.about.sections || { hero: {} };
                            sections.hero = { ...sections.hero, highlightColor: e.target.value };
                            setData({
                              ...data,
                              about: {...data.about, sections}
                            });
                          }}
                        >
                          <option value="text-blue-500">Blue</option>
                          <option value="text-amber-500">Amber</option>
                          <option value="text-emerald-500">Emerald</option>
                          <option value="text-rose-500">Rose</option>
                          <option value="text-purple-500">Purple</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hero Subtitle</label>
                    <input 
                      className="w-full p-4 bg-slate-50 border-none rounded-lg md:rounded-2xl"
                      value={data.about.heroSubtitle} 
                      onChange={(e) => setData({
                        ...data, 
                        about: {...data.about, heroSubtitle: e.target.value}
                      })} 
                      placeholder="Hero Subtitle"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Hero Slideshow Images (3 images - rotates every 5 seconds)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(data.about.heroImages || []).map((img: string, i: number) => (
                        <div key={i} className="group relative rounded-lg md:rounded-3xl overflow-hidden aspect-video bg-slate-100 border-2 border-dashed border-slate-200">
                          <img 
                            src={previews[`about.heroImages.${i}`] || img || '/placeholder-image.jpg'} 
                            className="w-full h-full object-cover"
                            alt={`Hero ${i + 1}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent md:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-lg text-[8px] font-bold">
                              Image {i + 1}
                            </div>
                            <label className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer mb-2 shadow-lg hover:bg-blue-50 transition-colors">
                              <FaUpload className="inline mr-1" /> UPLOAD NEW
                              <input 
                                type="file" 
                                hidden 
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, `about.heroImages.${i}`)}
                              />
                            </label>
                            <div className="w-full">
                              <input 
                                className="w-full p-2 bg-black/60 text-[9px] text-white rounded-lg border border-white/30 placeholder:text-white/50"
                                placeholder="Image URL" 
                                value={img} 
                                onChange={(e) => {
                                  const temp = [...data.about.heroImages];
                                  temp[i] = e.target.value;
                                  setData({
                                    ...data, 
                                    about: {...data.about, heroImages: temp}
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CEO SECTION - COMPLETE EDITOR */}
              <div className="bg-white rounded-lg md:rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 md:p-8 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <FaUserTie />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 uppercase text-sm">CEO Section - Leadership Message</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">CEO image, message, name, position, and contact</p>
                  </div>
                </div>
                
                <div className="p-3 md:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* CEO Image */}
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CEO Image</label>
                      <div className="group relative aspect-square rounded-lg md:rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden">
                        <img 
                          src={previews['about.ceoImage'] || data.about.ceoImage || '/placeholder-person.jpg'} 
                          className="w-full h-full object-cover"
                          alt="CEO"
                        />
                        <div className="absolute inset-0 bg-black/60 md:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                          <label className="bg-white text-slate-900 px-4 py-2 rounded-lg md:rounded-xl text-[10px] font-black cursor-pointer shadow-lg">
                            <FaUpload className="inline mr-1" /> CHANGE IMAGE
                            <input 
                              type="file" 
                              hidden 
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'about.ceoImage')}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* CEO Content */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Section Label</label>
                        <input 
                          className="w-full p-3 bg-slate-50 border-none rounded-lg md:rounded-xl font-bold text-blue-600 uppercase text-xs"
                          value={data.about.sections?.ceo?.sectionLabel || "Leadership"} 
                          onChange={(e) => {
                            const sections = data.about.sections || { ceo: {} };
                            sections.ceo = { ...sections.ceo, sectionLabel: e.target.value };
                            setData({
                              ...data,
                              about: {...data.about, sections}
                            });
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Section Title</label>
                        <input 
                          className="w-full p-3 bg-slate-50 border-none rounded-lg md:rounded-xl font-serif font-bold text-slate-800"
                          value={data.about.sections?.ceo?.sectionTitle || "A Message From Our CEO"} 
                          onChange={(e) => {
                            const sections = data.about.sections || { ceo: {} };
                            sections.ceo = { ...sections.ceo, sectionTitle: e.target.value };
                            setData({
                              ...data,
                              about: {...data.about, sections}
                            });
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CEO Message</label>
                        <textarea 
                          className="w-full p-4 bg-slate-50 border-none rounded-lg md:rounded-2xl h-32 italic text-slate-600"
                          value={data.about.ceoMessage} 
                          onChange={(e) => setData({
                            ...data, 
                            about: {...data.about, ceoMessage: e.target.value}
                          })} 
                          placeholder="CEO Message"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CEO Name</label>
                          <input 
                            className="w-full p-3 bg-slate-50 border-none rounded-lg md:rounded-xl font-bold"
                            value={data.about.ceoName} 
                            onChange={(e) => setData({
                              ...data, 
                              about: {...data.about, ceoName: e.target.value}
                            })} 
                            placeholder="CEO Name"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CEO Position</label>
                          <input 
                            className="w-full p-3 bg-slate-50 border-none rounded-lg md:rounded-xl"
                            value={data.about.ceoPosition || "Founder & Managing Director"} 
                            onChange={(e) => setData({
                              ...data, 
                              about: {...data.about, ceoPosition: e.target.value}
                            })} 
                            placeholder="Position"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CEO Email (Editable)</label>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FaEnvelope />
                          </div>
                          <input 
                            className="flex-1 p-3 bg-slate-50 border-none rounded-xl"
                            value={data.about.ceoEmail || "labocfuneralservices@gmail.com"} 
                            onChange={(e) => setData({
                              ...data, 
                              about: {...data.about, ceoEmail: e.target.value}
                            })} 
                            placeholder="CEO Email"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">About Link Text</label>
                        <input 
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-blue-600 text-xs underline"
                          value={data.about.sections?.ceo?.aboutLink?.text || "About Our Company?"} 
                          onChange={(e) => {
                            const sections = data.about.sections || { ceo: { aboutLink: {} } };
                            sections.ceo = { 
                              ...sections.ceo, 
                              aboutLink: { 
                                ...sections.ceo.aboutLink, 
                                text: e.target.value 
                              } 
                            };
                            setData({
                              ...data,
                              about: {...data.about, sections}
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CORE VALUES - COMPLETE EDITOR */}
              <div className="bg-white rounded-lg md:rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 md:p-8 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <FaMedal />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 uppercase text-sm">Core Values Cards</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Edit, add, or remove company values with icons</p>
                  </div>
                </div>
                
                <div className="p-3 md:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(data.about.coreValues || []).map((val: any, i: number) => (
                      <div key={i} className="p-6 rounded-lg md:rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => setDeleteConfirm({ show: true, type: 'coreValue', index: i, section: 'coreValues' })}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <FaTrash size={12} />
                        </button>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Icon</label>
                            <select 
                              value={val.icon} 
                              onChange={(e) => {
                                const temp = [...data.about.coreValues];
                                temp[i].icon = e.target.value;
                                setData({
                                  ...data, 
                                  about: {...data.about, coreValues: temp}
                                });
                              }}
                              className="w-full p-2 bg-white border rounded-xl text-xs font-bold text-blue-600 outline-none"
                            >
                              {ICON_OPTIONS.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                            <input 
                              className="w-full font-black bg-transparent outline-none uppercase text-sm tracking-tighter text-blue-600"
                              value={val.title} 
                              onChange={(e) => {
                                const temp = [...data.about.coreValues];
                                temp[i].title = e.target.value;
                                setData({
                                  ...data, 
                                  about: {...data.about, coreValues: temp}
                                });
                              }} 
                            />
                          </div>
                          
                          <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                            <textarea 
                              className="w-full bg-transparent text-xs text-slate-500 leading-relaxed h-20 outline-none border-none resize-none"
                              value={val.desc} 
                              onChange={(e) => {
                                const temp = [...data.about.coreValues];
                                temp[i].desc = e.target.value;
                                setData({
                                  ...data, 
                                  about: {...data.about, coreValues: temp}
                                });
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Core Value Button */}
                    <button 
                      onClick={handleAddCoreValue}
                      className="p-6 rounded-lg md:rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-3 min-h-[250px] group"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        +
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Add Core Value</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* LEGACY & STATS SECTION - COMPLETE EDITOR */}
              <div className="bg-white rounded-lg md:rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 md:p-8 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <FaHistory />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 uppercase text-sm">Legacy Story & Statistics</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Company story, legacy badge, images, and stats (Years of Service synced from Contact)</p>
                  </div>
                </div>
                
                <div className="p-3 md:p-8 space-y-8">
                  {/* Legacy Badge & Titles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Legacy Badge</label>
                      <input 
                        className="w-full p-3 bg-slate-50 border-none rounded-lg md:rounded-xl font-bold text-xs"
                        value={data.about.legacyBadge || "Our Legacy"} 
                        onChange={(e) => setData({
                          ...data, 
                          about: {...data.about, legacyBadge: e.target.value}
                        })} 
                        placeholder="Legacy Badge"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Section Title</label>
                      <input 
                        className="w-full p-3 bg-slate-50 border-none rounded-lg md:rounded-xl font-serif font-bold"
                        value={data.about.about2Title || "About Laboc"} 
                        onChange={(e) => setData({
                          ...data, 
                          about: {...data.about, about2Title: e.target.value}
                        })} 
                        placeholder="About Title"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Subtitle / Highlight</label>
                      <input 
                        className="w-full p-3 bg-slate-50 border-none rounded-lg md:rounded-xl font-bold text-blue-600"
                        value={data.about.about2Subtitle || "Funeral Services"} 
                        onChange={(e) => setData({
                          ...data, 
                          about: {...data.about, about2Subtitle: e.target.value}
                        })} 
                        placeholder="Subtitle"
                      />
                    </div>
                  </div>
                  
                  {/* Company Description */}
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Company Story / Description</label>
                    <textarea 
                      className="w-full p-6 bg-slate-50 border-none rounded-lg md:rounded-[2rem] h-64 outline-none text-slate-600 text-sm leading-relaxed"
                      value={data.about.companyDescription} 
                      onChange={(e) => setData({
                        ...data, 
                        about: {...data.about, companyDescription: e.target.value}
                      })} 
                    />
                  </div>
                  
                  {/* Statistics Cards */}
                  <div>
                    <div className="flex flex-col md:flex-row gap-5 md:gap-2 items-center justify-between mb-6 md:mb-4">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Statistics Cards (4 cards - Years of Service synced from Contact Editor)
                      </label>
                      <button 
                        onClick={handleAddStat}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        + Add Statistic
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Years of Service - READ ONLY from adminContact */}
                      <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg md:rounded-[2rem] text-center space-y-1 shadow-lg shadow-blue-200 relative group">
                        <div className="absolute inset-0 bg-black/20 rounded-lg md:rounded-[2rem] md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[8px] font-bold uppercase px-2 py-1 bg-white/20 rounded-full">
                            Synced
                          </span>
                        </div>
                        <div className="text-2xl font-black">{adminContact?.experience || "15"}+</div>
                        <div className="text-[9px] font-bold uppercase opacity-90">Years of Service</div>
                        <div className="text-[7px] italic mt-1 opacity-75">from Contact Settings</div>
                      </div>
                      
                      {/* Editable Stats */}
                      {(data.about.stats || []).map((stat: any, i: number) => (
                        <div key={i} className="p-5 bg-white border border-slate-100 rounded-lg md:rounded-[2rem] text-center space-y-1 shadow-sm relative group">
                          <button 
                            onClick={() => setDeleteConfirm({ show: true, type: 'stat', index: i, section: 'stats' })}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <FaTrash size={10} />
                          </button>
                          <input 
                            className="w-full text-center font-black text-slate-800 text-2xl bg-transparent outline-none"
                            value={stat.value} 
                            onChange={(e) => {
                              const temp = [...data.about.stats];
                              temp[i].value = e.target.value;
                              setData({
                                ...data, 
                                about: {...data.about, stats: temp}
                              });
                            }} 
                            placeholder="Value"
                          />
                          <input 
                            className="w-full text-center text-[9px] font-bold uppercase text-slate-400 bg-transparent outline-none"
                            value={stat.label} 
                            onChange={(e) => {
                              const temp = [...data.about.stats];
                              temp[i].label = e.target.value;
                              setData({
                                ...data, 
                                about: {...data.about, stats: temp}
                              });
                            }} 
                            placeholder="Label"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Legacy Images - 4 Grid */}
                  <div className="pt-6 border-t border-slate-200">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 block">
                      Legacy Gallery Images (4 images - grid layout)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(data.about.legacyImages || []).map((img: string, i: number) => (
                        <div key={i} className="group relative aspect-square rounded-lg md:rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden">
                          <img 
                            src={previews[`about.legacyImages.${i}`] || img || '/placeholder-image.jpg'} 
                            className="w-full h-full object-cover"
                            alt={`Legacy ${i + 1}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 via-blue-600/50 to-transparent md:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                            <div className="absolute top-2 left-2 bg-white/90 text-blue-600 px-2 py-1 rounded-lg text-[8px] font-bold">
                              Image {i + 1}
                            </div>
                            <label className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[8px] font-black cursor-pointer">
                              <FaUpload className="inline mr-1" /> UPLOAD
                              <input 
                                type="file" 
                                hidden 
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, `about.legacyImages.${i}`)}
                              />
                            </label>
                            <input 
                              className="w-full p-1.5 bg-white/90 text-[7px] text-slate-800 rounded outline-none placeholder:text-slate-400"
                              placeholder="Image URL" 
                              value={img} 
                              onChange={(e) => {
                                const temp = [...data.about.legacyImages];
                                temp[i] = e.target.value;
                                setData({
                                  ...data, 
                                  about: {...data.about, legacyImages: temp}
                                });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SOCIAL MEDIA LINKS SECTION */}
              <div className="bg-white rounded-lg md:rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 md:p-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg md:rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <FaGlobe />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 uppercase text-sm">Social Media Links</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Connect your social media profiles</p>
                  </div>
                </div>
                
                <div className="p-3 md:p-8">
                  <div className="grid gap-4">
                    {(data.about.socialLinks || []).map((social: any, i: number) => (
                      <div key={i} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-slate-50 rounded-lg md:rounded-xl border border-slate-100 relative group">
                        <button 
                          onClick={() => setDeleteConfirm({ show: true, type: 'socialLink', index: i, section: 'socialLinks' })}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <FaTrash size={12} />
                        </button>
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600">
                          {SOCIAL_ICON_OPTIONS.find(opt => opt.id === social.icon)?.icon || <FaGlobe />}
                        </div>
                        <select 
                          className="w-full md:max-w-30 p-3 bg-white border rounded-lg text-xs font-bold"
                          value={social.icon}
                          onChange={(e) => {
                            const temp = [...data.about.socialLinks];
                            temp[i].icon = e.target.value;
                            temp[i].platform = e.target.value;
                            setData({
                              ...data,
                              about: {...data.about, socialLinks: temp}
                            });
                          }}
                        >
                          {SOCIAL_ICON_OPTIONS.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                        <input 
                          className="w-full p-3 bg-white border-none rounded-lg text-xs"
                          placeholder="Profile URL"
                          value={social.url}
                          onChange={(e) => {
                            const temp = [...data.about.socialLinks];
                            temp[i].url = e.target.value;
                            setData({
                              ...data,
                              about: {...data.about, socialLinks: temp}
                            });
                          }}
                        />
                        <button 
                          onClick={() => {
                            const temp = [...data.about.socialLinks];
                            temp[i].enabled = !temp[i].enabled;
                            setData({
                              ...data,
                              about: {...data.about, socialLinks: temp}
                            });
                          }}
                          className={`w-full md:max-w-50 p-3 rounded-lg text-[8px] font-bold uppercase ${
                            social.enabled 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {social.enabled ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => {
                        const newSocial = {
                          platform: "facebook",
                          url: "",
                          icon: "facebook",
                          enabled: true
                        };
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            socialLinks: [...(data.about.socialLinks || []), newSocial]
                          }
                        });
                      }}
                      className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-lg md:rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      + Add Social Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* POLICY PAGE EDITOR */}
          {activeSection === 'policy' && (
            <div className="bg-white rounded-lg md:rounded-[2.5rem] shadow-sm border border-slate-200 p-3 md:p-8 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg md:rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <FaFileContract />
                </div>
                <h3 className="text-xs font-black uppercase text-rose-600 tracking-widest">
                  Policy Document Builder
                </h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Policy Title</label>
                <input 
                  className="w-full p-4 bg-slate-50 border-none rounded-lg md:rounded-2xl font-bold"
                  value={data.policy.title} 
                  onChange={(e) => setData({
                    ...data, 
                    policy: {...data.policy, title: e.target.value}
                  })} 
                  placeholder="Policy Title"
                />
              </div>
              
              <div className="space-y-4">
                {(data.policy.sections || []).map((sec: any, i: number) => (
                  <div key={i} className="p-3 md:p-6 rounded-lg md:rounded-3xl bg-slate-50 border border-slate-100 space-y-4 relative group">
                    <button 
                      onClick={() => setDeleteConfirm({ show: true, type: 'policySection', index: i, section: 'policy' })}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <FaTrash size={12}/>
                    </button>
                    
                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Section Title</label>
                      <input 
                        className="w-full font-black bg-transparent text-blue-700 outline-none uppercase text-xs"
                        value={sec.title} 
                        onChange={(e) => {
                          const temp = [...data.policy.sections];
                          temp[i].title = e.target.value;
                          setData({
                            ...data, 
                            policy: {...data.policy, sections: temp}
                          });
                        }} 
                      />
                    </div>
                    
                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Section Content</label>
                      <textarea 
                        className="w-full bg-white p-3 rounded-lg md:rounded-xl text-sm outline-none min-h-[120px] text-slate-500"
                        value={sec.content} 
                        onChange={(e) => {
                          const temp = [...data.policy.sections];
                          temp[i].content = e.target.value;
                          setData({
                            ...data, 
                            policy: {...data.policy, sections: temp}
                          });
                        }} 
                      />
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => {
                    setData({
                      ...data, 
                      policy: {
                        ...data.policy, 
                        sections: [...(data.policy.sections || []), {
                          title: "NEW POLICY SECTION", 
                          content: ""
                        }]
                      }
                    });
                  }} 
                  className="w-full py-6 border-2 border-dashed border-slate-200 rounded-lg md:rounded-2xl text-[10px] font-black text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors flex items-center justify-center gap-2"
                >
                  + ADD POLICY SECTION
                </button>
              </div>
              
              {/* Policy Registration Image */}
              <div className="pt-6 border-t border-slate-200">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                  Registration Image
                </label>
                <div className="group relative aspect-video max-w-md rounded-lg md:rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden">
                  <img 
                    src={previews['policy.regImage'] || data.policy.regImage || '/placeholder-image.jpg'} 
                    className="w-full h-full object-cover"
                    alt="Registration"
                  />
                  <div className="absolute inset-0 bg-black/60 md:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <label className="bg-white text-slate-900 px-4 py-2 rounded-lg md:rounded-xl text-[10px] font-black cursor-pointer">
                      <FaUpload className="inline mr-1" /> UPLOAD IMAGE
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'policy.regImage')}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION CARD */}
      {deleteConfirm?.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-lg md:rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaTrash className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-xl font-black text-center text-slate-800 uppercase tracking-tight mb-2">
              Confirm Delete
            </h3>
            <p className="text-center text-slate-500 text-sm mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (deleteConfirm.type === 'coreValue') {
                    handleRemoveCoreValue(deleteConfirm.index);
                  } else if (deleteConfirm.type === 'stat') {
                    handleRemoveStat(deleteConfirm.index);
                  } else if (deleteConfirm.type === 'socialLink') {
                    handleRemoveSocialLink(deleteConfirm.index);
                  } else if (deleteConfirm.type === 'policySection') {
                    const temp = [...data.policy.sections];
                    temp.splice(deleteConfirm.index, 1);
                    setData({
                      ...data, 
                      policy: {...data.policy, sections: temp}
                    });
                    setDeleteConfirm(null);
                  }
                }}
                className="flex-1 bg-red-600 text-white py-4 rounded-lg md:rounded-xl font-black text-sm uppercase tracking-wider hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-lg md:rounded-xl font-black text-sm uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
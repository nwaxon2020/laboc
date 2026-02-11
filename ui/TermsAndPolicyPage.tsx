"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { FaWhatsapp } from 'react-icons/fa';

export default function TermsAndConditionsUi() {
  const [data, setData] = useState<any>(null);
  const [adminContact, setAdminContact] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState("October 24, 2023");

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const docRef = doc(db, "settings", "aboutPolicyPage");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const policyData = docSnap.data().policy;
          setData(policyData);
          if (policyData.sections || policyData.title) {
             setLastUpdated(new Date().toLocaleDateString('en-US', {
               month: 'long', day: 'numeric', year: 'numeric'
             }));
          }
        }

        const dashSnap = await getDoc(doc(db, "settings", "dashboard"));
        if (dashSnap.exists()) {
          setAdminContact(dashSnap.data());
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchPolicyData();
  }, []);

  const companyName = adminContact?.companyName || "Labock Funeral Services";
  const rawMobile = adminContact?.mobile || "2347065870898";
  const cleanMobile = rawMobile.replace(/\D/g, '');

  // Reusable component for the policy points to keep code clean
  const PolicyPoint = ({ num, title, children }: { num: string, title: string, children: React.ReactNode }) => (
    <div className="group mb-10 p-4 md:p-6 rounded-2xl transition-all duration-300 hover:bg-slate-50 border-l-4 border-transparent hover:border-blue-600">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 transition-colors group-hover:text-blue-800">
        {num}. {title}
      </h2>
      <div className="text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header Section */}
      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            {data?.title || "Terms & Conditions"}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Please read these terms carefully. They outline the legal framework under which {companyName} provides its services to you.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-slate lg:prose-lg max-w-none">
            <p className="text-sm text-slate-500 mb-8 italic">
              Last Updated: {lastUpdated}
            </p>

            <PolicyPoint num="1" title="Acceptance of Terms">
              By accessing the {companyName} website or engaging our funeral, cremation, or convoy services, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
            </PolicyPoint>

            <PolicyPoint num="2" title="Service Provision">
              We provide funeral arrangements, transportation, diplomatic convoys, and memorial products. While we strive for perfection, all services are subject to availability and local regulatory requirements. {companyName} reserves the right to refuse service that violates health, safety, or legal standards.
            </PolicyPoint>

            <PolicyPoint num="3" title="Payment & Pricing">
              <p className="font-semibold mb-2">Payment terms are as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A deposit is required before the commencement of any service arrangements.</li>
                <li>Full payment must be settled within the timeframe specified in your service contract.</li>
                <li>Prices quoted are subject to change based on third-party costs (e.g., cemetery fees, specialized floral imports).</li>
              </ul>
            </PolicyPoint>

            <PolicyPoint num="4" title="Diplomatic Convoy & Transportation">
              Our convoy services are conducted in compliance with local traffic laws. While we facilitate smooth processions, {companyName} is not liable for delays caused by extreme traffic, road closures, or government-mandated diversions.
            </PolicyPoint>

            <PolicyPoint num="5" title="Privacy & Data">
              We handle your personal information and that of the deceased with the highest level of confidentiality. Your data is used solely for the purpose of fulfilling service requirements and legal documentation.
            </PolicyPoint>

            <PolicyPoint num="6" title="Limitation of Liability">
              {companyName} shall not be held liable for any indirect or consequential loss arising from the use of our website or the provision of our services, except where prohibited by law.
            </PolicyPoint>

            {/* Dynamic Sections from Editor */}
            {data?.sections?.map((sec: any, i: number) => (
              <PolicyPoint key={i} num={(i + 7).toString()} title={sec.title}>
                <p className="whitespace-pre-line">{sec.content}</p>
              </PolicyPoint>
            ))}

            <hr className="my-12 border-slate-200" />

            <div className='p-5 text-center mx-auto flex flex-col max-w-60 h-auto'>
              <p className='font-bold text-gray-500 mb-4 uppercase text-[10px] tracking-widest'>Proof of Registration</p>
              <img 
                src={data?.regImage || "/reg.jpeg"} 
                alt="Registration" 
                className='border-4 border-slate-800 rounded-lg w-full h-full shadow-lg'
              />
            </div>

            <hr className="my-12 border-slate-200" />

            {/* Centered Question Part */}
            <div className="bg-amber-50 p-4 md:p-10 rounded-lg md:rounded-[2rem] border border-amber-100 text-center flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Questions regarding our policy?</h3>
              <p className="text-amber-800 mb-8 max-w-md">
                Our team is available 24/7 to clarify any of these terms for you.
              </p>
              <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                <a 
                  href={`https://wa.me/${cleanMobile}?text=Hello, I have a question about the Terms and Conditions.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white md:px-10 py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                >
                  <FaWhatsapp /> WhatsApp Support
                </a>
                <Link href="/" className="bg-white text-amber-700 px-10 py-3 font-bold border border-amber-200 rounded-xl hover:bg-amber-100 transition-all">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm italic uppercase tracking-widest font-bold text-[10px]">
          © {new Date().getFullYear()} {companyName}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
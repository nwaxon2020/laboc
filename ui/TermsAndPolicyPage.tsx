"use client";

import React from 'react';
import Link from 'next/link';

export default function TermsAndConditionsUi() {
  const lastUpdated = "October 24, 2023";
  const companyName = "Labock Funeral Services";

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Terms & Conditions
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

            <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing the {companyName} website or engaging our funeral, cremation, or convoy services, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
            </p>

            <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4">2. Service Provision</h2>
            <p className="text-slate-600 leading-relaxed">
              We provide funeral arrangements, transportation, diplomatic convoys, and memorial products. While we strive for perfection, all services are subject to availability and local regulatory requirements. {companyName} reserves the right to refuse service that violates health, safety, or legal standards.
            </p>

            <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4">3. Payment & Pricing</h2>
            <p className="text-slate-600 leading-relaxed font-semibold">
              Payment terms are as follows:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>A deposit is required before the commencement of any service arrangements.</li>
              <li>Full payment must be settled within the timeframe specified in your service contract.</li>
              <li>Prices quoted are subject to change based on third-party costs (e.g., cemetery fees, specialized floral imports).</li>
            </ul>

            <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4">4. Diplomatic Convoy & Transportation</h2>
            <p className="text-slate-600 leading-relaxed">
              Our convoy services are conducted in compliance with local traffic laws. While we facilitate smooth processions, {companyName} is not liable for delays caused by extreme traffic, road closures, or government-mandated diversions.
            </p>

            <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4">5. Privacy & Data</h2>
            <p className="text-slate-600 leading-relaxed">
              We handle your personal information and that of the deceased with the highest level of confidentiality. Your data is used solely for the purpose of fulfilling service requirements and legal documentation.
            </p>

            <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              {companyName} shall not be held liable for any indirect or consequential loss arising from the use of our website or the provision of our services, except where prohibited by law.
            </p>

            <hr className="my-12 border-slate-200" />

            <div className='p-5 text-center mx-auto flex flex-col max-w-60 h-auto'>
              <p className='font-bold text-gray-500'>Proof of Registration</p>
              <img src="/reg.jpeg" alt="Registration Image" className='border-5 border-gray-700 rounded w-full h-full'/>
            </div>

            <hr className="my-12 border-slate-200" />

            <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Questions regarding our policy?</h3>
              <p className="text-amber-800 mb-4">
                Our team is available 24/7 to clarify any of these terms for you.
              </p>
              <div className="flex flex-col md:flex-row gap-4 text-center">
                <Link href="/contact" className="bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors">
                  Contact Support
                </Link>
                <Link href="/" className="text-amber-700 px-6 py-2 font-semibold hover:underline">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} {companyName}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
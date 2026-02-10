'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
// Added React Icons for the update
import { FaHome, FaServicestack, FaStore, FaCalendarAlt, FaInfoCircle, FaPhoneAlt, FaFileInvoiceDollar } from 'react-icons/fa';

function NavContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  
  const shouldBeWhite = pathname === '/blog' || pathname === '/events'|| pathname === '/about';
  const textColor = shouldBeWhite ? 'text-white' : 'text-gray-700';
  const activeTextColor = shouldBeWhite ? 'text-white' : 'text-gray-900';
  const activeBorder = shouldBeWhite ? 'border-white' : 'border-gray-800';

  const COMPANY_ADDRESS = "12 Surulere Street, Beside Old Fanmilk Depot, Makun, Sagamu, Ogun State";
  const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/${encodeURIComponent(COMPANY_ADDRESS)}`;

  const openChat = () => {
    window.dispatchEvent(new Event("open-chat"));
    setIsMenuOpen(false);
  };

  const handleServiceLinkClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    router.push(`/services?service=${encodeURIComponent(title)}`);
  };

  const handlePriceCategoryClick = (category: string) => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setIsQuotationOpen(false);
    router.push(`/services?price-category=${encodeURIComponent(category)}`);
    if (pathname === '/services') {
      window.location.href = `/services?price-category=${encodeURIComponent(category)}`;
    }
  };

  const serviceSubItems = [
    'Traditional Funerals',
    'Cremation Services',
    'Pre-Planning',
    'Grief Support',
    'Transportation',
    'Memorial Products',
    'Diplomatic Convoy',
    'Floral & Venue Decor'
  ];

  const quotationItems = [
    'Hearse Services',
    'Horse Carriage',
    'Pall Bearers & Band',
    'Lying-In-State Decoration',
    'Wreaths',
    'Photography & Media'
  ];

  const blogSubItems =[
    {name: "Market Place", href: "/blog"},
    {name: "Events", href: "/events"},
  ];

  const aboutSubItems = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Location', href: GOOGLE_MAPS_URL, isExternal: true },
    { name: 'Our Policy', href: '/terms' },
  ];

  const isServicesActive = pathname === '/services';

  return (
    <>
      {/* DESKTOP NAVIGATION */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className={`${pathname === '/' ? `${activeTextColor} font-bold border-b-2 ${activeBorder}` : `${textColor} hover:opacity-80 font-medium`} transition duration-300 py-2`}
        >
          <FaHome size={24} />
        </Link>

        {/* SERVICES DROPDOWN */}
        <div className="relative group">
          <button 
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
            className={`flex items-center transition duration-300 font-medium py-2 ${isServicesActive ? `${activeTextColor} font-bold border-b-2 ${activeBorder}` : `${textColor} hover:opacity-80`}`}
          >
            Services
            <svg className={`ml-1 w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
            className={`absolute left-0 w-64 bg-white shadow-xl rounded-lg border border-gray-100 py-2 transition-all duration-300 z-[60] ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
          >
            <Link href="/services" className="block px-4 py-2 text-xs font-black text-blue-600 uppercase tracking-widest border-b border-gray-50 mb-1 hover:bg-gray-50">
              View All Services
            </Link>

            <div className="relative group/sub">
                <button className="flex gap-4 justify-start items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700 font-medium text-left">
                    Services Quotations
                    <svg className="w-3 h-3 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-full top-0 w-56 bg-white shadow-xl rounded-lg border border-gray-100 py-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all">
                    {quotationItems.map(q => (
                        <button 
                          key={q} 
                          onClick={() => handlePriceCategoryClick(q)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700 font-medium"
                        >
                          {q}
                        </button>
                    ))}
                </div>
            </div>

            {serviceSubItems.map((service) => (
              <Link
                key={service}
                href={`/services?service=${encodeURIComponent(service)}`}
                onClick={(e) => handleServiceLinkClick(e, service)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700 font-medium"
              >
                {service}
              </Link>
            ))}
          </div>
        </div>

        {/* BLOG DROPDOWN */}
        <div className="relative group">
            <button onMouseEnter={() => setIsBlogOpen(true)} onMouseLeave={() => setIsBlogOpen(false)} className={`flex items-center transition duration-300 font-medium py-2 ${blogSubItems.some(s => pathname === s.href) ? `${activeTextColor} font-bold border-b-2 ${activeBorder}` : `${textColor} hover:opacity-80`}`}>
                Blog
                <svg className={`ml-1 w-4 h-4 transition-transform ${isBlogOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div onMouseEnter={() => setIsBlogOpen(true)} onMouseLeave={() => setIsBlogOpen(false)} className={`absolute left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 py-2 transition-all duration-300 z-[60] ${isBlogOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                {blogSubItems.map((sub) => (
                    <Link key={sub.name} href={sub.href} className={`block px-4 py-2 text-sm ${pathname === sub.href ? 'text-gray-900 font-bold bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-700 font-medium'}`}>{sub.name}</Link>
                ))}
            </div>
        </div>

        {/* ABOUT DROPDOWN */}
        <div className="relative group">
          <button onMouseEnter={() => setIsAboutOpen(true)} onMouseLeave={() => setIsAboutOpen(false)} className={`flex items-center transition duration-300 font-medium py-2 ${aboutSubItems.some(s => pathname === s.href) ? `${activeTextColor} font-bold border-b-2 ${activeBorder}` : `${textColor} hover:opacity-80`}`}>
            About
            <svg className={`ml-1 w-4 h-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div onMouseEnter={() => setIsAboutOpen(true)} onMouseLeave={() => setIsAboutOpen(false)} className={`absolute left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 py-2 transition-all duration-300 z-[60] ${isAboutOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
            {aboutSubItems.map((sub) => (
              sub.isExternal ? (
                <a key={sub.name} href={sub.href} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700 font-medium">{sub.name}</a>
              ) : (
                <Link key={sub.name} href={sub.href} className={`block px-4 py-2 text-sm ${pathname === sub.href ? 'text-gray-900 font-bold bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-700 font-medium'}`}>{sub.name}</Link>
              )
            ))}
          </div>
        </div>

        <button onClick={openChat} className={`${textColor} hover:opacity-80 transition duration-300 font-medium`}>Contact</button>
      </nav>

      {/* MOBILE MENU BUTTON */}
      <button className={`md:hidden ${shouldBeWhite ? 'text-white' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50 h-screen overflow-y-auto pb-24">
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
            <Link href="/" className={`${pathname === '/' ? 'text-gray-900 font-bold underline' : 'text-gray-700 font-medium'} text-lg border-b border-gray-50 pb-2 flex items-center gap-3`} onClick={() => setIsMenuOpen(false)}>
              <FaHome className="text-gray-400" /> Home
            </Link>
            
            {/* MOBILE SERVICES */}
            <div className="flex flex-col">
              <button onClick={() => setIsServicesOpen(!isServicesOpen)} className={`flex justify-between items-center text-lg font-medium py-2 border-b border-gray-50 ${isServicesActive ? 'text-gray-900 font-bold underline' : 'text-gray-700'}`}>
                <span className="flex items-center gap-3"><FaServicestack className="text-gray-400" /> Services</span>
                <svg className={`w-5 h-5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isServicesOpen && (
                <div className="flex flex-col space-y-3 pl-4 mt-3 border-l-2 border-blue-100 text-gray-700">
                  <Link href="/services" onClick={() => setIsMenuOpen(false)} className="text-blue-600 font-bold text-sm">View All Services</Link>
                  
                  {/* MOBILE QUOTATIONS NESTED */}
                  <button onClick={() => setIsQuotationOpen(!isQuotationOpen)} className="flex justify-between items-center text-amber-600 font-bold text-sm">
                      <span className="flex items-center gap-2"><FaFileInvoiceDollar /> Services Quotations</span>
                      <svg className={`w-4 h-4 transition-transform ${isQuotationOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isQuotationOpen && (
                    <div className="flex flex-col space-y-2 pl-3 border-l border-amber-200">
                        {quotationItems.map(q => (
                            <button 
                              key={q} 
                              onClick={() => handlePriceCategoryClick(q)}
                              className="text-left text-gray-500 text-xs py-1 hover:text-amber-700"
                            >
                              {q}
                            </button>
                        ))}
                    </div>
                  )}

                  {serviceSubItems.map((service) => (
                    <Link key={service} href={`/services?service=${encodeURIComponent(service)}`} onClick={(e) => handleServiceLinkClick(e, service)} className="text-gray-600 font-medium">{service}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/blog" className="text-gray-700 font-medium text-lg border-b border-gray-50 pb-2 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
              <FaStore className="text-gray-400" /> Market Place
            </Link>
            <Link href="/events" className="text-gray-700 font-medium text-lg border-b border-gray-50 pb-2 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
              <FaCalendarAlt className="text-gray-400" /> Events
            </Link>
            <Link href="/about" className="text-gray-700 font-medium text-lg border-b border-gray-50 pb-2 flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
              <FaInfoCircle className="text-gray-400" /> About Us
            </Link>
            <button onClick={openChat} className="text-left text-gray-700 py-2 text-lg font-medium border-b border-gray-50 pb-2 flex items-center gap-3">
              <FaPhoneAlt className="text-gray-400" /> Contact
            </button>
            <a href="tel:07065870898" className="bg-slate-900 text-white px-4 py-3 rounded-xl text-center font-bold shadow-lg">24/7 Emergency Line</a>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navigation() {
  return (
    <Suspense fallback={<div className="h-15" />}>
      <NavContent />
    </Suspense>
  );
}
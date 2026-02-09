'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

function NavContent() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isBlogOpen, setIsBlogOpen] = useState(false)
  
  // TEXT ONLY LOGIC: Determine if text should be white based on the route
  const shouldBeWhite = pathname === '/blog' || pathname === '/events'|| pathname === '/about';
  const textColor = shouldBeWhite ? 'text-white' : 'text-gray-700';
  const activeTextColor = shouldBeWhite ? 'text-white' : 'text-gray-900';
  const activeBorder = shouldBeWhite ? 'border-white' : 'border-gray-800';

  const COMPANY_ADDRESS = "12 Surulere Street, Beside Old Fanmilk Depot, Makun, Sagamu, Ogun State";
  const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/${encodeURIComponent(COMPANY_ADDRESS)}`;

  const openChat = () => {
    window.dispatchEvent(new Event("open-chat"));
    setIsMenuOpen(false);
    setIsAboutOpen(false);
    setIsServicesOpen(false);
    setIsBlogOpen(false)
  };

  const handleServiceLinkClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    
    // Using router.push for smooth SPA transition (Same as Footer fix)
    router.push(`/services?service=${encodeURIComponent(title)}`);
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
  ]

  const blogSubItems =[
    {name: "Market Place", href: "/blog"},
    {name: "Events", href: "/events"},
  ]

  const aboutSubItems = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Location', href: GOOGLE_MAPS_URL, isExternal: true },
    { name: 'Our Policy', href: '/terms' },
  ]

  const isServicesActive = pathname === '/services';
  const isBlogActive = blogSubItems.some(sub => pathname === sub.href)
  const isAboutActive = aboutSubItems.some(sub => pathname === sub.href);

  return (
    <>
      {/* DESKTOP NAVIGATION */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className={`${pathname === '/' ? `${activeTextColor} font-bold border-b-2 ${activeBorder}` : `${textColor} hover:opacity-80 font-medium`} transition duration-300`}
        >
          Home
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
          <button 
            onMouseEnter={() => setIsBlogOpen(true)}
            onMouseLeave={() => setIsBlogOpen(false)}
            className={`flex items-center transition duration-300 font-medium py-2 ${isBlogActive ? `${activeTextColor} font-bold border-b-2 ${activeBorder}` : `${textColor} hover:opacity-80`}`}
          >
            Blog
            <svg className={`ml-1 w-4 h-4 transition-transform ${isBlogOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            onMouseEnter={() => setIsBlogOpen(true)}
            onMouseLeave={() => setIsBlogOpen(false)}
            className={`absolute left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 py-2 transition-all duration-300 z-[60] ${isBlogOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
          >
            {blogSubItems.map((sub) => (
              <Link key={sub.name} href={sub.href} className={`block px-4 py-2 text-sm ${pathname === sub.href ? 'text-gray-900 font-bold bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-700 font-medium'}`}>{sub.name}</Link>
            ))}
          </div>
        </div>

        {/* ABOUT DROPDOWN */}
        <div className="relative group">
          <button 
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
            className={`flex items-center transition duration-300 font-medium py-2 ${isAboutActive ? `${activeTextColor} font-bold border-b-2 ${activeBorder}` : `${textColor} hover:opacity-80`}`}
          >
            About
            <svg className={`ml-1 w-4 h-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
            className={`absolute left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 py-2 transition-all duration-300 z-[60] ${isAboutOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
          >
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

      {/* MOBILE MENU - FIXED OVERFLOW AND SCROLL ISSUE */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50 animate-in slide-in-from-top duration-300 h-screen overflow-y-auto overflow-x-hidden max-w-full pb-24">
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
            <Link href="/" className={`${pathname === '/' ? 'text-gray-900 font-bold underline' : 'text-gray-700 font-medium'} text-lg border-b border-gray-50 pb-2`} onClick={() => setIsMenuOpen(false)}>Home</Link>
            
            <div className="flex flex-col">
              <button onClick={() => setIsServicesOpen(!isServicesOpen)} className={`flex justify-between items-center text-lg font-medium py-2 border-b border-gray-50 ${isServicesActive ? 'text-gray-900 font-bold underline' : 'text-gray-700'}`}>
                Services
                <svg className={`w-5 h-5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isServicesOpen && (
                <div className="flex flex-col space-y-3 pl-4 mt-3 border-l-2 border-blue-100 text-gray-700">
                  <Link href="/services" onClick={() => setIsMenuOpen(false)} className="text-blue-600 font-bold text-sm">View All Services</Link>
                  {serviceSubItems.map((service) => (
                    <Link key={service} href={`/services?service=${encodeURIComponent(service)}`} onClick={(e) => handleServiceLinkClick(e, service)} className="text-gray-600 font-medium">{service}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/blog" className={`${pathname === '/blog' ? 'text-gray-900 font-bold underline' : 'text-gray-700 font-medium'} text-lg border-b border-gray-50 pb-2`} onClick={() => setIsMenuOpen(false)}>Market Place</Link>
            
            <Link href="/events" className={`${pathname === '/events' ? 'text-gray-900 font-bold underline' : 'text-gray-700 font-medium'} text-lg border-b border-gray-50 pb-2`} onClick={() => setIsMenuOpen(false)}>Events</Link>
            
            <div className="flex flex-col">
              <button onClick={() => setIsAboutOpen(!isAboutOpen)} className={`flex justify-between items-center text-lg font-medium py-2 border-b border-gray-50 ${isAboutActive ? 'text-gray-900 font-bold underline' : 'text-gray-700'}`}>
                About
                <svg className={`w-5 h-5 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isAboutOpen && (
                <div className="border-l-2 border-amber-300 flex flex-col space-y-3 pl-4 mt-3">
                  {aboutSubItems.map((sub) => (
                    <Link key={sub.name} href={sub.href} className={`${pathname === sub.href ? 'text-gray-900 font-bold underline' : 'text-gray-600 font-medium'}`} onClick={() => setIsMenuOpen(false)} {...(sub.isExternal ? { target: "_blank" } : {})}>{sub.name}</Link>
                  ))}
                </div>
              )}
            </div>

            <button onClick={openChat} className="text-left text-gray-700 py-2 text-lg font-medium">Contact</button>
            <a href="tel:07065870898" className="bg-slate-900 text-white px-4 py-3 rounded-xl text-center font-bold shadow-lg" onClick={() => setIsMenuOpen(false)}>24/7 Emergency Line</a>
          </div>
        </div>
      )}
    </>
  )
}

export default function Navigation() {
  return (
    <Suspense fallback={<div className="h-15" />}>
      <NavContent />
    </Suspense>
  )
}
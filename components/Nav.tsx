'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  
  // DYNAMIC ADDRESS CONFIGURATION
  // Change the 'address' string below to update the Google Maps link automatically
  const COMPANY_ADDRESS = "12 Surulere Street, Beside Old Fanmilk Depot, Makun, Sagamu, Ogun State";
  const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_ADDRESS)}`;

  const openChat = () => {
    window.dispatchEvent(new Event("open-chat"));
    setIsMenuOpen(false);
    setIsAboutOpen(false);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
  ]

  const aboutSubItems = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Location', href: GOOGLE_MAPS_URL, isExternal: true },
    { name: 'Our Policy', href: '/terms' },
  ]

  return (
    <>
      {/* DESKTOP NAVIGATION */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              pathname === item.href
                ? 'text-gray-900 font-bold border-b-2 border-gray-800'
                : 'text-gray-700 hover:text-gray-900 font-medium'
            } transition duration-300`}
          >
            {item.name}
          </Link>
        ))}

        {/* ABOUT DROPDOWN */}
        <div className="relative group">
          <button 
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
            className={`flex items-center transition duration-300 font-medium py-2 ${
              aboutSubItems.some(sub => pathname === sub.href) ? 'text-gray-900 font-bold' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            About
            <svg className={`ml-1 w-4 h-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* DROPDOWN MENU */}
          <div 
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
            className={`absolute left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 py-2 transition-all duration-300 z-[60] ${
              isAboutOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}
          >
            {aboutSubItems.map((sub) => (
              sub.isExternal ? (
                <a 
                  key={sub.name}
                  href={sub.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700"
                >
                  {sub.name}
                </a>
              ) : (
                <Link
                  key={sub.name}
                  href={sub.href}
                  className={`block px-4 py-2 text-sm ${
                    pathname === sub.href ? 'text-gray-900 font-bold bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-700'
                  }`}
                >
                  {sub.name}
                </Link>
              )
            ))}
          </div>
        </div>

        <button 
          onClick={openChat}
          className="text-gray-700 hover:text-gray-900 transition duration-300 font-medium"
        >
          Contact
        </button>
      </nav>

      {/* MOBILE MENU BUTTON */}
      <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href ? 'text-gray-900 font-bold underline' : 'text-gray-700 font-medium'
                } text-lg border-b border-gray-50 pb-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* MOBILE ABOUT DROPDOWN */}
            <div className="flex flex-col">
              <button 
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className={`flex justify-between items-center text-lg font-medium py-2 border-b border-gray-50 ${
                  aboutSubItems.some(sub => pathname === sub.href) ? 'text-gray-900 font-bold' : 'text-gray-700'
                }`}
              >
                About
                <svg className={`w-5 h-5 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isAboutOpen && (
                <div className="border-l-2 border-amber-300 flex flex-col space-y-3 pl-2 mt-3 animate-in fade-in slide-in-from-left-2">
                  {aboutSubItems.map((sub) => (
                    sub.isExternal ? (
                      <a 
                        key={sub.name}
                        href={sub.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.name}
                      </a>
                    ) : (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`${
                          pathname === sub.href ? 'text-gray-900 font-bold underline' : 'text-gray-600 font-medium'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            <button onClick={openChat} className="text-left text-gray-700 py-2 text-lg font-medium">
              Contact
            </button>
            
            <Link
              href="/contact"
              className="bg-slate-900 text-white px-4 py-3 rounded-xl text-center font-bold shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              24/7 Emergency Line
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
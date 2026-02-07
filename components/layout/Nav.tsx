'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Logic to broadcast the open signal for the chat box
  const openChat = () => {
    window.dispatchEvent(new Event("open-chat"));
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ]

  return (
    <>
      {/* DESKTOP NAVIGATION: Emergency Line Removed */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              pathname === item.href
                ? 'text-gray-900 font-semibold border-b-2 border-gray-800'
                : 'text-gray-700 hover:text-gray-900'
            } transition duration-300`}
          >
            {item.name}
          </Link>
        ))}
        <button 
          onClick={openChat}
          className="text-gray-700 hover:text-gray-900 transition duration-300 font-medium"
        >
          Contact
        </button>
      </nav>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* MOBILE MENU: Emergency Line Stays Here */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-700'
                  } py-2`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={openChat}
                className="text-left text-gray-700 py-2 font-medium"
              >
                Contact
              </button>
              
              {/* Emergency Line remains in Mobile as requested */}
              <Link
                href="/contact"
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-center font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                24/7 Emergency Line
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
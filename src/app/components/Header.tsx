'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserCircleIcon, SunIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// Final, corrected, unified, and responsive Header component.
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock data for display
  const weather = "맑음, 24°C";
  const date = "2025-06-15";

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/today', label: '오늘 뭐 먹지?' },
    { href: '/travel-plans', label: '추천 여행 코스' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* This is the critical fix: flex-nowrap prevents the line break */}
        <div className="flex justify-between items-center py-3 flex-nowrap">
          
          {/* Left Section: Logo & Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile Menu Button (Hamburger) - Moved to the left for better UX */}
            <div className="md:hidden mr-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600">
                {isMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
              </button>
            </div>
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              LifeAI
            </Link>
          </div>

          {/* Center Section: Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-indigo-600">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section: Info & User Icon */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
              <SunIcon className="h-5 w-5 text-yellow-500" />
              <span>{weather}</span>
              <span className="text-gray-300">|</span>
              <span>{date}</span>
            </div>
            <button className="hidden md:block text-gray-500 hover:text-indigo-600">
              <UserCircleIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-2 text-sm text-gray-500 pt-4 border-t w-full justify-center">
                <SunIcon className="h-5 w-5 text-yellow-500" />
                <span>{weather}</span>
                <span className="text-gray-300">|</span>
                <span>{date}</span>
            </div>
             <button className="text-gray-500 hover:text-indigo-600 mt-4">
                <UserCircleIcon className="h-8 w-8" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

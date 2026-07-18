"use client";

import React, { useState, useTransition } from 'react';
import { Menu, Globe, X, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathSegments = pathname.split('/').filter(Boolean);
  const currentLang = pathSegments[0] === 'am' ? 'AM' : 'EN';
  const cleanPath = '/' + pathSegments.slice(1).join('/');

  const navItems = [
    { key: 'home', pathName: 'Home', fallback: 'Home' },
    { key: 'previousWorks', pathName: 'Previous Works', fallback: 'Previous Works' },
    { key: 'customOrder', pathName: 'Custom Order', fallback: 'Custom Order' },
    { key: 'newProducts', pathName: 'New Products', fallback: 'New Products' },
    { key: 'aboutUs', pathName: 'About Us', fallback: 'About Us' },
    { key: 'contact', pathName: 'Contact', fallback: 'Contact' }
  ];

  const getRoutePath = (itemPathName: string) => {
    if (itemPathName === 'Home') return `/${currentLang.toLowerCase()}`;
    return `/${currentLang.toLowerCase()}/${itemPathName.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const handleLanguageChange = (newLang: string) => {
    const targetLang = newLang.toLowerCase();
    startTransition(() => {
      router.push(`/${targetLang}${cleanPath === '/' ? '' : cleanPath}`);
    });
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 selection:bg-orange-500 selection:text-white">
      
      {/* Brand Logo Section */}
      <a href={`/${currentLang.toLowerCase()}`} className="flex items-center gap-4 cursor-pointer group select-none relative z-[60]">
        <div className="relative w-9 h-9 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900 group-hover:text-orange-500 transition-colors duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 C10 20, 25 10, 50 10 C75 10, 90 20, 90 50 C90 80, 75 90, 50 90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
            <path d="M38 25 H55 C68 25, 68 43, 55 43 H38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 43 H58 C72 43, 72 65, 58 65 H38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 25 V75" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="50" cy="50" r="2.5" className="fill-orange-500 animate-pulse" />
          </svg>
        </div>
        
        {/* Typographic Branding */}
        <div className="flex flex-col justify-center">
          <span className="text-xl font-bold text-gray-900 leading-none group-hover:text-orange-500 transition-colors duration-300">
            BEBA
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-medium text-gray-500 leading-none">
              Furniture
            </span>
            <span className="h-2 w-[1px] bg-gray-300" />
            <span className="text-[10px] font-normal text-gray-500 leading-none mt-[1px]">
              ቤባ የቤትና የቢሮ ዕቃዎች
            </span>
          </div>
        </div>
      </a>

      {/* Desktop Navigation Links - Clean & Modern */}
      <div className="hidden lg:flex items-center gap-8">
        {navItems.map((item) => {
          const itemPath = getRoutePath(item.pathName);
          const isActive = pathname === itemPath;
          
          return (
            <a 
              key={item.key} 
              href={itemPath} 
              className={`text-[15px] font-medium transition-colors duration-200 ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-gray-500 hover:text-orange-500'
              }`}
            >
              {t(item.key, { fallback: item.fallback })}
            </a>
          );
        })}
      </div>

      {/* Controls Section */}
      <div className="flex items-center gap-5 relative z-[60]">
        
        {/* Language Selector Dropdown */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 transition-all duration-300 cursor-pointer relative group/lang">
          <Globe size={16} className="text-gray-400 group-hover/lang:text-orange-500 transition-colors duration-300" />
          <select 
            value={currentLang} 
            disabled={isPending}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent outline-none cursor-pointer pr-4 text-[13px] font-medium text-gray-500 hover:text-gray-900 appearance-none disabled:opacity-40"
          >
            <option value="EN">EN</option>
            <option value="AM">አማ</option>
          </select>
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Highlight CTA Button (Like "Summer Bootcamp") */}
        <a 
          href={`/${currentLang.toLowerCase()}/custom-order`}
          className="bg-[#f97316] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#ea580c] transition-all duration-300 shadow-sm shadow-orange-500/20 text-center"
        >
          {t("ctaButton", { fallback: "Start Custom Order" })}
        </a>

        {/* Mobile Hamburger Menu Trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-orange-500 rounded-full transition-colors active:scale-95"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 py-6 px-8 flex flex-col gap-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const itemPath = getRoutePath(item.pathName);
            const isActive = pathname === itemPath;

            return (
              <a
                key={item.key}
                href={itemPath}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left font-medium text-[15px] py-3 transition-colors border-b border-gray-50 last:border-0 block ${
                  isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {t(item.key, { fallback: item.fallback })}
              </a>
            );
          })}
          
          {/* Mobile Language Selector */}
          <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-400">
              Language / ቋንቋ
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => { handleLanguageChange('EN'); setMobileMenuOpen(false); }} 
                disabled={isPending}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${currentLang === 'EN' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'}`}
              >
                EN
              </button>
              <button 
                onClick={() => { handleLanguageChange('AM'); setMobileMenuOpen(false); }} 
                disabled={isPending}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${currentLang === 'AM' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'}`}
              >
                አማርኛ
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
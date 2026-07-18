"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations("Footer");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  // Dynamic array mapping to perfectly replicate the "New Products" collection filters
  const structuralCategories = [
    { key: 'living_room', slug: 'living-room', label: t("catLivingRoom", { defaultValue: 'Living Room' }) },
    { key: 'kitchen', slug: 'kitchen', label: t("catKitchen", { defaultValue: 'Kitchen' }) },
    { key: 'bedroom', slug: 'bedroom', label: t("catBedroom", { defaultValue: 'Bedroom' }) },
    { key: 'office', slug: 'office', label: t("catOffice", { defaultValue: 'Office' }) },
    { key: 'dining', slug: 'dining-room', label: t("catDining", { defaultValue: 'Dining Room' }) }
  ];

  return (
    <footer className="w-full bg-neutral-950 text-neutral-400 py-24 px-6 md:px-12 border-t border-neutral-900/50 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Main Grid Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          
          {/* Column 1: Brand Identifier */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-2">
              <span className="font-serif text-2xl tracking-[0.08em] text-neutral-100 font-bold block">
                BEBA
              </span>
              <span className="text-[8px] font-semibold tracking-[0.3em] text-amber-500 uppercase block">
                FURNITURE
              </span>
            </div>
            <p className="text-neutral-500 text-[13px] leading-relaxed max-w-sm font-normal">
              {t("desc")}
            </p>
          </div>

          {/* Column 2: Synchronized Workspace Categories */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="font-serif text-xs text-neutral-200 font-medium tracking-[0.15em] uppercase">
              {t("colCategories")}
            </h4>
            <ul className="space-y-3.5 text-[13px]">
              {structuralCategories.map((category) => (
                <li key={category.key}>
                  <Link 
                    href={`/${locale}/new-products?category=${category.key}`} 
                    className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Global Interactive Support */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="font-serif text-xs text-neutral-200 font-medium tracking-[0.15em] uppercase">
              {t("colSupport")}
            </h4>
            <ul className="space-y-3.5 text-[13px]">
              <li>
                <Link href={`/${locale}/new-products`} className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {t("supOurProducts", { defaultValue: 'Our Products' })}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/knowledge-base`} className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {t("supFAQs", { defaultValue: 'FAQs' })}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about-us`} className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {t("supAboutUs", { defaultValue: 'About Us' })}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {t("supContactUs", { defaultValue: 'Contact Us' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Atelier Mapping */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="font-serif text-xs text-neutral-200 font-medium tracking-[0.15em] uppercase">
              {t("colContact")}
            </h4>
            
            <ul className="space-y-4 text-[13px] text-neutral-400">
              {/* Location Reference */}
              <li className="flex items-start gap-3.5">
                <MapPin size={16} className="text-neutral-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-neutral-400">{t("address")}</span>
              </li>
              
              {/* Email Communications */}
              <li className="flex items-center gap-3.5">
                <Mail size={16} className="text-neutral-500 shrink-0" />
                <a href="mailto:info@alphafurniture.net" className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  info@bebafurniture.net
                </a>
              </li>

              {/* Live Support Hub */}
              <li className="flex items-start gap-3.5 pt-1">
                <div className="relative flex h-4 w-4 shrink-0 items-center justify-center mt-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/30 opacity-75"></span>
                  <svg className="relative w-4 h-4 text-emerald-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="space-y-1.5 font-mono text-xs tracking-wider text-neutral-400">
                  <a href="https://wa.me/251911000000" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 block transition-colors duration-300">
                    +251 911 000 000 <span className="text-[9px] font-sans text-neutral-500 tracking-normal ml-1">(WhatsApp Live)</span>
                  </a>
                  <a href="tel:+251911111111" className="hover:text-white block transition-colors duration-300">+251 911 111 111</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Segment */}
        <div className="pt-8 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Copyright Stamp */}
          <p className="text-[11px] text-neutral-600 tracking-wide order-2 md:order-1 text-center md:text-left font-light">
            {t("rights")}
          </p>

          {/* Social Links Panel */}
          <div className="flex items-center justify-center md:justify-end gap-6 order-1 md:order-2">
            <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" aria-label="Telegram">
              <Send size={16} />
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" aria-label="Facebook">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" aria-label="Instagram">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
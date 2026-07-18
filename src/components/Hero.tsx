"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const HERO_IMAGES = [
  { src: "/images/image%202.png", alt: "Artisan Furniture Design 1" },
  { src: "/images/image%203.png", alt: "Artisan Furniture Design 2" },
  { src: "/images/image%205.png", alt: "Artisan Furniture Design 3" },
  { src: "/images/image%206.png", alt: "Artisan Furniture Design 4" },
  { src: "/images/image%209.png", alt: "Artisan Furniture Design 5" },
  { src: "/images/image%2010.jpg", alt: "Modern Premium Sofa" },
  { src: "/images/image%2012.png", alt: "Crafted Wooden Table" },
];

export default function Hero() {
  const t = useTranslations("Hero");
  const pathname = usePathname();
  const [currentImage, setCurrentImage] = useState(0);

  // Safely capture current language from path to prevent routing breaks
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentLang = pathSegments[0] === 'am' ? 'am' : 'en';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full min-h-[calc(100vh-76px)] lg:h-[calc(100vh-76px)] bg-[#F9F9F8] grid grid-cols-1 lg:grid-cols-12 overflow-hidden border-b border-stone-200/60 selection:bg-amber-900 selection:text-white">
      
      {/* Left Column: Text Content Workspace */}
      <div className="lg:col-span-6 flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-16 lg:py-8 space-y-8 bg-[#F9F9F8] h-full relative z-20">
        
        {/* Brand Meta Identifier */}
        <div className="animate-fade-in">
          <span className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-amber-900/5 text-amber-700 border border-amber-900/10 text-[10px] tracking-widest font-bold uppercase shadow-sm">
            <Sparkles size={12} />
            {t("brandLabel")}
          </span>
        </div>

        {/* Editorial Headline Layout */}
        <h1 className="text-4xl sm:text-5xl xl:text-6xl lg:text-[4rem] font-serif font-medium text-stone-900 leading-[1.1] tracking-tight">
          {t("headlineText")}, <br /> 
          <span className="font-light text-amber-800 italic font-serif relative inline-block mt-2">
            {t("headlineHighlight")}
          </span>
        </h1>

        {/* Detailed Descriptive Architecture */}
        <div className="space-y-4 max-w-xl">
          <p className="text-stone-500 text-[14px] md:text-base leading-relaxed font-light">
            {t("desc1")}
          </p>
          <p className="text-stone-400 text-xs md:text-[13px] leading-relaxed font-light hidden sm:block border-l-2 border-amber-900/10 pl-4">
            {t("desc2")}
          </p>
        </div>

        {/* Call to Actions (CTA) */}
        <div className="pt-6 flex flex-wrap items-center gap-6">
          <a 
            href={`/${currentLang}/custom-order`}
            className="group relative overflow-hidden flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 text-[11px] font-bold tracking-[0.15em] uppercase"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            <span className="relative z-10 flex items-center gap-3">
              {t("ctaStart")} 
              <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </span>
          </a>
          <a 
            href="../../../new-products" 
            className="text-stone-500 hover:text-stone-900 font-bold px-4 py-3.5 text-[11px] tracking-[0.15em] uppercase transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative group"
          >
            NEW PRODUCTS
            <span className="absolute bottom-3 left-4 w-[30%] h-[1px] bg-amber-700/40 group-hover:bg-amber-700 group-hover:w-[75%] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          </a>
        </div>
      </div>

      {/* Right Column: Dynamic Image Canvas */}
      <div className="lg:col-span-6 relative w-full h-[480px] lg:h-full bg-stone-100 overflow-hidden border-t lg:border-t-0 lg:border-l border-stone-200/60">
        {HERO_IMAGES.map((imgObj, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
              index === currentImage ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            {/* Soft Ambient Overlay */}
            <div className="absolute inset-0 bg-stone-950/[0.04] mix-blend-multiply z-10 pointer-events-none" />
            
            <Image
              src={imgObj.src}
              alt={imgObj.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Minimalist Carousel Control Dock */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 bg-stone-900/15 backdrop-blur-xl px-5 py-3.5 rounded-full border border-white/20 shadow-sm">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`h-1 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                idx === currentImage ? 'w-8 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
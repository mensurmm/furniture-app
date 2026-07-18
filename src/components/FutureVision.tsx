"use client";

import React from 'react';
import Image from 'next/image';
import { Globe, Trees, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FutureVision() {
  const t = useTranslations("FutureVision");

  const initiatives = [
    {
      icon: <Trees className="text-amber-500" size={16} />,
      title: t("initiative1Title"),
      description: t("initiative1Desc")
    },
    {
      icon: <Building2 className="text-amber-500" size={16} />,
      title: t("initiative2Title"),
      description: t("initiative2Desc")
    },
    {
      icon: <Globe className="text-amber-500" size={16} />,
      title: t("initiative3Title"),
      description: t("initiative3Desc")
    }
  ];

  return (
    <section className="py-28 px-6 md:px-12 lg:px-16 bg-[#0c100e] text-white relative overflow-hidden border-t border-white/[0.02]">
      
      {/* Decorative Spatial Key Light Aura */}
      <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-emerald-500/[0.01] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* Editorial Heading Matrix */}
        <div className="max-w-3xl space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase block">
            {t("label")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-stone-50 leading-[1.1]">
            {t("title1")} <br />
            <span className="italic font-normal text-amber-500 mt-2 block">{t("title2")}</span>
          </h2>
        </div>

        {/* Structural Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Narrative Copy & Interactive Rows */}
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-6 max-w-2xl border-l border-white/10 pl-6 lg:pl-8">
              <p className="text-stone-200 text-lg md:text-xl font-serif italic font-light leading-relaxed">
                {t("narrative1")}
              </p>
              <p className="text-stone-400 text-[13px] md:text-sm font-normal leading-relaxed text-justify">
                {t("narrative2")}
              </p>
            </div>

            {/* Seamless List Architecture */}
            <div className="space-y-4 pt-4">
              {initiatives.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group flex gap-6 items-start p-6 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.07] hover:bg-white/[0.02] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  <div className="p-3 bg-white/[0.03] rounded-xl shrink-0 border border-white/[0.05] group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {item.icon}
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="text-base font-serif font-medium text-stone-100 group-hover:text-amber-500 transition-colors duration-400">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-stone-400 leading-relaxed max-w-xl font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Frameless Canvas Frame & Data Metrics */}
          <div className="lg:col-span-5 space-y-10 w-full">
            
            {/* Cinematic Focal Image Container */}
            <div className="relative aspect-[4/5] w-full bg-stone-900/40 rounded-2xl overflow-hidden border border-white/[0.05] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] group">
              <Image 
                src="/images/image%2034.png"
                alt="Future Studio Architecture Vision"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-103 group-hover:opacity-90 transition-all duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c100e] via-[#0c100e]/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-75" />
              
              {/* Suspended Monolithic Descriptor Box */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#0c100e]/80 backdrop-blur-xl rounded-xl border border-white/[0.06] shadow-2xl">
                <span className="text-[9px] font-bold tracking-[0.2em] text-amber-500 block mb-1.5 uppercase">
                  {t("roadmapLabel")}
                </span>
                <p className="text-xs text-stone-300 font-normal leading-relaxed">
                  {t("roadmapDesc")}
                </p>
              </div>
            </div>

            {/* Structured Dual Performance Cells */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/[0.01] border border-white/[0.03] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-amber-500/20 hover:bg-white/[0.02]">
                <div className="text-3xl md:text-4xl font-serif font-light text-stone-50 tracking-tight">100%</div>
                <div className="text-[9px] uppercase font-bold text-stone-500 tracking-widest mt-2">
                  {t("metric1")}
                </div>
              </div>
              <div className="p-6 bg-white/[0.01] border border-white/[0.03] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-amber-500/20 hover:bg-white/[0.02]">
                <div className="text-3xl md:text-4xl font-serif font-light text-stone-50 tracking-tight">0%</div>
                <div className="text-[9px] uppercase font-bold text-stone-500 tracking-widest mt-2">
                  {t("metric2")}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
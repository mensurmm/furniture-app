"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface FurnitureItem {
  name: string;
  localWood: string;
  priceETB: string;
  imageUrl: string;
  description: string;
}

interface CategoryGroup {
  category: string;
  story: string;
  items: FurnitureItem[];
}

export default function HandcraftedMaterials() {
  const t = useTranslations("BrandPillars");
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const pillars = [
    { title: t("pillar1Title"), tagline: t("pillar1Tagline"), description: t("pillar1Desc"), imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600" },
    { title: t("pillar2Title"), tagline: t("pillar2Tagline"), description: t("pillar2Desc"), imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600" },
    { title: t("pillar3Title"), tagline: t("pillar3Tagline"), description: t("pillar3Desc"), imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=600" },
    { title: t("pillar4Title"), tagline: t("pillar4Tagline"), description: t("pillar4Desc"), imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600" },
    { title: t("pillar5Title"), tagline: t("pillar5Tagline"), description: t("pillar5Desc"), imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600" },
    { title: t("pillar6Title"), tagline: t("pillar6Tagline"), description: t("pillar6Desc"), imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600" }
  ];

  const showcaseData: CategoryGroup[] = [
    {
      category: t("catLivingRoom"),
      story: t("storyLivingRoom"),
      items: [
        { name: t("itemLiving1Name"), localWood: t("itemLiving1Wood"), priceETB: t("itemLiving1Price"), imageUrl: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=800", description: t("itemLiving1Desc") },
        { name: t("itemLiving2Name"), localWood: t("itemLiving2Wood"), priceETB: t("itemLiving2Price"), imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800", description: t("itemLiving2Desc") }
      ]
    },
    {
      category: t("catDining"),
      story: t("storyDining"),
      items: [
        { name: t("itemDining1Name"), localWood: t("itemDining1Wood"), priceETB: t("itemDining1Price"), imageUrl: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=800", description: t("itemDining1Desc") },
        { name: t("itemDining2Name"), localWood: t("itemDining2Wood"), priceETB: t("itemDining2Price"), imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800", description: t("itemDining2Desc") }
      ]
    },
    {
      category: t("catWorkspace"),
      story: t("storyWorkspace"),
      items: [
        { name: t("itemWork1Name"), localWood: t("itemWork1Wood"), priceETB: t("itemWork1Price"), imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800", description: t("itemWork1Desc") },
        { name: t("itemWork2Name"), localWood: t("itemWork2Wood"), priceETB: t("itemWork2Price"), imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800", description: t("itemWork2Desc") }
      ]
    }
  ];

  return (
    <>
      {/* SECTION 1: Architectural Design Pillars */}
      <section className="py-28 px-6 md:px-12 lg:px-16 bg-neutral-50/70 border-t border-neutral-200/50">
        <div className="max-w-7xl mx-auto space-y-20">
          
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber-600 uppercase block">
              {t("standardLabel")}
            </span>
            <h2 className="text-4xl font-serif text-neutral-950 font-light tracking-tight leading-none">
              {t("standardTitle")}
            </h2>
            <p className="text-neutral-500 text-xs md:text-[13px] font-normal leading-relaxed max-w-sm mx-auto">
              {t.has("standardSubtitle") ? t("standardSubtitle") : "Exploring timeless craftsmanship aesthetics."}
            </p>
          </div>

          {/* New Card Design: Stark Minimalist Architectural Frames */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {pillars.map((item, index) => (
              <div 
                key={index} 
                className="group flex flex-col space-y-5 bg-transparent transition-all duration-500"
              >
                {/* Frameless Borderless Media Block */}
                <div className="relative aspect-[11/8] w-full rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-500 bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-103"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-md text-[10px] font-mono font-medium rounded-md text-neutral-800 shadow-sm">
                    0{index + 1}
                  </div>
                </div>

                {/* Simplified Content Block */}
                <div className="space-y-2 px-1">
                  <span className="text-[9px] font-bold tracking-widest text-amber-600 uppercase block">
                    {item.tagline}
                  </span>
                  <h3 className="text-lg font-serif font-medium text-neutral-950 group-hover:text-amber-700 transition-colors duration-400">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 leading-relaxed text-[13px] font-normal pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Dynamic Category Collections */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-28 space-y-20 relative overflow-hidden bg-white">
        
        <div className="absolute top-1/4 left-[5%] w-96 h-96 bg-amber-500/[0.01] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[5%] w-96 h-96 bg-neutral-950/[0.02] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          {/* Header Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end pb-6 border-b border-neutral-100">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase block">
                {t("heritageLabel")}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-neutral-950 leading-tight">
                {t("heritageTitle1")} <br />
                <span className="font-semibold italic text-neutral-900 block mt-1">{t("heritageTitle2")}</span>
              </h2>
            </div>
            
            <div className="lg:col-span-7 space-y-4 text-neutral-500 text-xs md:text-[13px] leading-relaxed font-normal max-w-2xl lg:pb-1">
              <p>{t("heritageDesc1")}</p>
              <p>{t("heritageDesc2")}</p>
            </div>
          </div>

          {/* Luxury Navigation Filter Track */}
          <div className="flex flex-wrap gap-3">
            {showcaseData.map((data, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-3 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  activeCategory === index
                    ? 'bg-neutral-950 text-white shadow-md shadow-neutral-950/10'
                    : 'text-neutral-400 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                {data.category}
              </button>
            ))}
          </div>

          {/* Narrative Frame & Dynamic Cards Grid */}
          <div className="space-y-12">
            <div className="max-w-3xl border-l-2 border-neutral-200 pl-6">
              <p className="text-[15px] text-neutral-600 font-serif italic leading-relaxed">
                "{showcaseData[activeCategory].story}"
              </p>
            </div>

            {/* New Card Design: Premium Horizontal Studio Split-Cards */}
            <div className="grid grid-cols-1 gap-12">
              {showcaseData[activeCategory].items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group flex flex-col md:flex-row bg-neutral-50/40 rounded-2xl overflow-hidden border border-neutral-200/50 hover:border-neutral-300/80 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-xl hover:shadow-neutral-950/[0.01]"
                >
                  {/* Left Side: Photo Container Frame (Takes up half width on Desktop) */}
                  <div className="relative aspect-[16/10] md:aspect-auto md:w-1/2 min-h-[300px] lg:min-h-[380px] overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-103"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-neutral-950/[0.02] mix-blend-multiply" />
                  </div>

                  {/* Right Side: Specification Panel Metadata (Takes up half width on Desktop) */}
                  <div className="p-8 lg:p-12 flex flex-col justify-between flex-1 bg-white">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold tracking-widest text-amber-600 uppercase block">
                            {item.localWood}
                          </span>
                          <h3 className="text-xl lg:text-2xl font-serif font-medium text-neutral-950 group-hover:text-amber-700 transition-colors duration-500">
                            {item.name}
                          </h3>
                        </div>
                        <div className="bg-neutral-950 text-white px-3.5 py-1.5 rounded-lg text-[11px] font-mono tracking-wide shadow-sm flex-shrink-0">
                          {item.priceETB}
                        </div>
                      </div>
                      <p className="text-neutral-500 leading-relaxed text-[13px] font-normal pt-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-950 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <span>{t("viewSpecs")}</span>
                      <span className="text-xs transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
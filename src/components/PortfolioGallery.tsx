"use client";

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const PORTFOLIO_ITEMS = [
  { id: 'k1', title: 'diningTable', category: 'Kitchen', image: '/images/kitchen/1.PNG' },
  { id: 'k2', title: 'kitchenStool', category: 'Kitchen', image: '/images/kitchen/2.PNG' },
  { id: 'k3', title: 'timberIsland', category: 'Kitchen', image: '/images/kitchen/3.PNG' },
  { id: 'l1', title: 'premiumSofa', category: 'Living Room', image: '/images/living%20room/1.PNG' },
  { id: 'l2', title: 'loungeChair', category: 'Living Room', image: '/images/living%20room/2.PNG' },
  { id: 'l3', title: 'accentTable', category: 'Living Room', image: '/images/living%20room/3.PNG' },
  { id: 'l4', title: 'coffeeTable', category: 'Living Room', image: '/images/living%20room/4.PNG' },
  { id: 'o1', title: 'credenza', category: 'Office', image: '/images/office/1.PNG' },
  { id: 'o2', title: 'workspaceDesk', category: 'Office', image: '/images/office/2.PNG' },
  { id: 'o3', title: 'executiveDesk', category: 'Office', image: '/images/office/3.PNG' }
];

export default function PortfolioGallery() {
  const t = useTranslations("PortfolioGallery");
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredItems = PORTFOLIO_ITEMS.filter((item) => {
    if (activeCategory.toLowerCase() === 'all') return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const categoryMap = [
    { key: 'All', label: t("catAll") },
    { key: 'Living Room', label: t("catLivingRoom") },
    { key: 'Office', label: t("catOffice") },
    { key: 'Kitchen', label: t("catKitchen") },
  ];

  const getLocalizedCategoryName = (category: string) => {
    const matched = categoryMap.find(c => c.key.toLowerCase() === category.toLowerCase());
    return matched ? matched.label : category;
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-24 bg-white space-y-14">
      
      {/* Editorial Header Block */}
      <div className="space-y-4 max-w-xl">
        <span className="text-[10px] font-bold tracking-[0.25em] text-amber-600 uppercase block">
          {t("label")}
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-neutral-950 font-light tracking-tight leading-[1.15]">
          {t("title")}
        </h2>
        <p className="text-neutral-500 text-[13px] font-normal leading-relaxed">
          {t("subtitle") || "Explore our handcrafted collection"}
        </p>
      </div>

      {/* Premium Studio Navigation Track */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-neutral-100">
        {categoryMap.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.key.toLowerCase();
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-6 py-3 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-md shadow-neutral-950/10' 
                  : 'bg-transparent text-neutral-400 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Balanced Portfolio Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white rounded-2xl overflow-hidden border border-neutral-200/60 shadow-sm hover:shadow-xl hover:shadow-neutral-950/[0.02] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
          >
            {/* Visual Canvas Container */}
            <div className="aspect-[16/10] overflow-hidden bg-neutral-50 relative w-full border-b border-neutral-100">
              <Image 
                src={item.image} 
                alt={t(item.title)} 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-102" 
              />
              <div className="absolute inset-0 bg-neutral-950/[0.01] mix-blend-multiply" />
              <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg text-neutral-800 shadow-sm border border-neutral-200/40">
                {getLocalizedCategoryName(item.category)}
              </span>
            </div>

            {/* Spec Sheet Footer Component */}
            <div className="p-8 flex justify-between items-center bg-white">
              <div className="space-y-1.5">
                <h3 className="font-serif font-medium text-neutral-950 text-lg group-hover:text-amber-600 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {t(item.title)}
                </h3>
                <p className="text-[11px] text-neutral-400 font-normal tracking-wide uppercase">
                  {t("materialTag")}
                </p>
              </div>
              <div className="p-3 rounded-full bg-neutral-50 text-neutral-400 group-hover:bg-neutral-950 group-hover:text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-neutral-100 group-hover:border-neutral-950 shadow-sm">
                <ArrowRight size={14} className="-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5" />
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, Compass, Leaf, Hammer, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const PROCESS_STEPS = [
  {
    id: '01',
    icon: Compass,
    titleKey: "step1Title",
    descKey: "step1Desc",
    defaultTitle: "Design Consultation",
    defaultDesc: "We begin by understanding your space, lifestyle, and aesthetic vision. Whether visiting our Arat Kilo showroom or consulting at your property, we listen to your exact needs."
  },
  {
    id: '02',
    icon: Leaf,
    titleKey: "step2Title",
    descKey: "step2Desc",
    defaultTitle: "Material Sourcing",
    defaultDesc: "Select from our curated collection of sustainably sourced lumbers, from rich indigenous Ethiopian woods to premium imported hardwoods, ensuring the perfect texture and tone."
  },
  {
    id: '03',
    icon: Hammer,
    titleKey: "step3Title",
    descKey: "step3Desc",
    defaultTitle: "Master Craftsmanship",
    defaultDesc: "Your piece is meticulously shaped and joined by our master artisans. We blend traditional woodworking techniques with modern precision to guarantee lifelong durability."
  },
  {
    id: '04',
    icon: Truck,
    titleKey: "step4Title",
    descKey: "step4Desc",
    defaultTitle: "White-Glove Delivery",
    defaultDesc: "We personally deliver and install the finished piece in your home, ensuring it sits perfectly in its intended environment, ready to be enjoyed for generations."
  }
];

export default function BespokeProcess() {
  const t = useTranslations("BespokeProcess");

  return (
    <section className="w-full py-24 lg:py-32 bg-white border-b border-stone-200/60 selection:bg-amber-900 selection:text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Context & Branding (Sticky) */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
            <div className="space-y-6">
              <span className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-amber-900/5 text-amber-700 border border-amber-900/10 text-[10px] tracking-widest font-bold uppercase shadow-sm">
                <Sparkles size={12} />
                {t("badge", { fallback: "Bespoke Production" })}
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 font-medium tracking-tight leading-[1.1]">
                {t("title", { fallback: "Tailored to Your Exact Specifications" })}
              </h2>
              
              <p className="text-stone-500 text-base md:text-lg font-light leading-relaxed max-w-md">
                {t("desc", { fallback: "True luxury lies in the details. Rather than mass production, we offer a deeply collaborative journey to create master-built furniture that perfectly adapts to your physical space and personal narrative." })}
              </p>
            </div>

            <div className="pt-4">
              <Link 
                href="/custom-order"
                className="group relative overflow-hidden inline-flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-xl transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 text-xs font-bold tracking-[0.15em] uppercase"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {t("ctaBtn", { fallback: "Start Your Custom Order" })}
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: The Process Steps */}
          <div className="lg:col-span-7 relative">
            
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-[#F9F9F8] rounded-[3rem] -z-10 hidden md:block"></div>
            
            <div className="space-y-6 md:p-8">
              {PROCESS_STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className="bg-white p-8 md:p-10 rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-500 group flex flex-col sm:flex-row gap-6 md:gap-8 items-start"
                >
                  {/* Step Indicator & Icon */}
                  <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-900/5 group-hover:border-amber-900/20 group-hover:scale-110 transition-all duration-500">
                      <step.icon size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-stone-300 font-serif">
                      {step.id}
                    </span>
                  </div>

                  {/* Step Content */}
                  <div className="space-y-3 pt-1">
                    <h3 className="text-xl md:text-2xl font-serif font-medium text-stone-900 group-hover:text-amber-800 transition-colors duration-300">
                      {t(step.titleKey, { fallback: step.defaultTitle })}
                    </h3>
                    <p className="text-stone-500 text-sm md:text-base leading-relaxed font-light">
                      {t(step.descKey, { fallback: step.defaultDesc })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
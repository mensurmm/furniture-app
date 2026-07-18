"use client";

import { useTranslations } from 'next-intl';
import { Sparkles, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-stone-900 selection:bg-amber-900 selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative py-24 lg:py-32 px-6 overflow-hidden flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 flex flex-col items-center">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/5 text-amber-700 border border-amber-900/10 text-[10px] tracking-widest font-bold uppercase shadow-sm">
            <Sparkles size={12} />
            {t("heroTag")}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-stone-900 leading-[1.1]">
            {t("heroTitle1")} <span className="italic font-light text-amber-800">{t("heroTitleItalic")}</span>.
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed font-light">
            {t("heroDescription")}
          </p>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-stone-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
      </section>

      {/* 2. Brand Story Section */}
      <section className="py-20 lg:py-32 px-6 bg-white border-y border-stone-200/60 shadow-[0_4px_40px_rgb(0,0,0,0.02)] relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              <span className="w-8 h-px bg-stone-300"></span> {t("storyTag")}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-stone-900 leading-tight">
              {t("storyTitle")}
            </h2>
            <div className="space-y-6 text-stone-500 text-sm md:text-base leading-loose font-light">
              <p>
                {t("storyParagraph1")}
              </p>
              <p>
                {t("storyParagraph2")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative group overflow-hidden rounded-[2rem] aspect-[4/3] md:aspect-[16/11] lg:aspect-[4/3] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-100">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80" 
                alt="Woodworking workshop" 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors duration-700" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Pillars */}
      <section className="py-24 lg:py-32 px-6 bg-[#F9F9F8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 mb-4">
              <span className="w-4 h-px bg-amber-700/30"></span> {t("pillarsTag")} <span className="w-4 h-px bg-amber-700/30"></span>
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-stone-900">
              {t("pillarsTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            
            {/* Pillar 1 */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group flex flex-col h-full hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-amber-800 font-serif text-2xl font-medium mb-8 group-hover:bg-amber-900/5 group-hover:border-amber-900/20 transition-colors duration-500">
                01
              </div>
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-4">{t("pillar1Title")}</h3>
              <p className="text-stone-500 text-sm leading-loose font-light">
                {t("pillar1Desc")}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group flex flex-col h-full hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-amber-800 font-serif text-2xl font-medium mb-8 group-hover:bg-amber-900/5 group-hover:border-amber-900/20 transition-colors duration-500">
                02
              </div>
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-4">{t("pillar2Title")}</h3>
              <p className="text-stone-500 text-sm leading-loose font-light">
                {t("pillar2Desc")}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group flex flex-col h-full hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-amber-800 font-serif text-2xl font-medium mb-8 group-hover:bg-amber-900/5 group-hover:border-amber-900/20 transition-colors duration-500">
                03
              </div>
              <h3 className="text-2xl font-serif font-medium text-stone-900 mb-4">{t("pillar3Title")}</h3>
              <p className="text-stone-500 text-sm leading-loose font-light">
                {t("pillar3Desc")}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Elegant Call-to-Action (CTA) */}
      <section className="pb-24 lg:pb-32 px-4 sm:px-6 bg-[#F9F9F8]">
        <div className="max-w-5xl mx-auto bg-stone-900 text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_40px_rgb(0,0,0,0.15)]">
          {/* Refined gradient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-stone-950 opacity-90" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-serif font-medium tracking-tight">
              {t("ctaTitle")}
            </h2>
            <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed max-w-lg">
              {t("ctaDesc")}
            </p>
            <div className="pt-6 w-full sm:w-auto">
              <Link 
                href="/custom-order"
                className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-stone-950 px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-stone-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
              >
                {t("ctaBtn")}
                <ArrowRight size={16} className="transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
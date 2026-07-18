"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function WelcomeIntro() {
  const t = useTranslations("WelcomeIntro");
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

  const welcomeMessages = [
    t("welcomeMsg1"),
    t("welcomeMsg2"),
    t("welcomeMsg3"),
    t("welcomeMsg4")
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setFadeState('fade-out');
      
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % welcomeMessages.length);
        setFadeState('fade-in');
      }, 500);

    }, 5000);

    return () => clearInterval(textInterval);
  }, [welcomeMessages.length]);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-12 text-center space-y-8 overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Anti-Layout-Shift Alternating Text Container */}
        <div className="h-6 flex items-center justify-center relative select-none">
          <span 
            className={`text-[10px] font-semibold tracking-[0.25em] text-neutral-400 uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              fadeState === 'fade-in' 
                ? 'opacity-100 translate-y-0 filter blur-0' 
                : 'opacity-0 -translate-y-1.5 filter blur-[2px]'
            }`}
          >
            {welcomeMessages[currentTextIndex]}
          </span>
        </div>

        {/* Master Typographic Heading Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-neutral-950 leading-[1.2] tracking-tight">
          {t("headlineText")} <br />
          <span className="font-semibold text-neutral-900 italic block mt-1">{t("headlineHighlight")}</span>
        </h2>

        {/* Hairline Structural Accent Line */}
        <div className="w-10 h-[1px] bg-neutral-200 mx-auto my-6" />

        {/* Refined Descriptive Proportions */}
        <p className="max-w-2xl mx-auto text-neutral-500 text-[14px] md:text-base leading-relaxed font-normal">
          {t("description")}
        </p>

      </div>
    </section>
  );
}
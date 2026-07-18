"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageSquare, ShieldCheck, Clock, Hammer } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'craft' | 'orders' | 'care' | 'service';
}

export default function KnowledgeBasePage() {
  const t = useTranslations("KnowledgeBase");
  const [openId, setOpenId] = useState<string | null>(null);

  // Structural FAQs with safe fallback translations to avoid translation missing crashes
  const faqs: FAQItem[] = [
    {
      id: 'q1',
      category: 'craft',
      question: t("q1_title", { defaultValue: "What types of wood do you source for heirloom furniture?" }),
      answer: t("q1_body", { defaultValue: "We exclusively select premium, ethically-sourced Ethiopian hardwoods including sustainably harvested Hagenia (Kosso), Cordia (Wanza), and Walnut. Each piece is chosen for its structural density and distinct structural grain configurations." })
    },
    {
      id: 'q2',
      category: 'orders',
      question: t("q2_title", { defaultValue: "How long does a completely custom artisan commission take?" }),
      answer: t("q2_body", { defaultValue: "A typical tailor-made creation spans between 4 to 8 weeks. This timeline includes conceptual design drafting, wood stabilization, hand-assembly joinery, and natural oil curing processes." })
    },
    {
      id: 'q3',
      category: 'care',
      question: t("q3_title", { defaultValue: "How should I clean and maintain the natural timber finishes?" }),
      answer: t("q3_body", { defaultValue: "Avoid using volatile industrial chemicals. Simply wipe down the surfaces using a clean, micro-fiber cloth dampened with mild soapy water, followed immediately by dry microfiber buffing. Rewax once a year to preserve tone." })
    },
    {
      id: 'q4',
      category: 'service',
      question: t("q4_title", { defaultValue: "Do you offer structural warranties on master joints?" }),
      answer: t("q4_body", { defaultValue: "Yes, we stand firmly behind our joinery standards. Every premium piece leaves our atelier with a comprehensive structural framework coverage validation against joinery faults." })
    }
  ];

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'craft': return <Hammer size={18} className="text-amber-600" />;
      case 'orders': return <Clock size={18} className="text-blue-600" />;
      case 'care': return <ShieldCheck size={18} className="text-emerald-600" />;
      default: return <MessageSquare size={18} className="text-purple-600" />;
    }
  };

  return (
    <main className="py-24 px-6 md:px-12 lg:px-16 bg-neutral-50 text-neutral-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Editorial Heading Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold tracking-[0.25em] text-amber-700 uppercase block">
            {t("sectionLabel", { defaultValue: "ATELIER DESK" })}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-950 font-light tracking-tight">
            {t("sectionTitle", { defaultValue: "Knowledge Base" })}
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
            {t("sectionSubtitle", { defaultValue: "Transparent answers covering our sourcing ethics, generational carpentry joinery, and structural care protocols." })}
          </p>
        </div>

        {/* Interactive Accordion Workspace */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-white rounded-2xl border border-neutral-200/50 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 select-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(faq.category)}
                    </div>
                    <h3 className="font-serif text-sm md:text-base font-medium text-neutral-900 tracking-tight group-hover:text-neutral-950 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-6 h-6 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-neutral-950 transition-all duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-neutral-950 text-white border-neutral-950 shadow-sm' : ''}`}>
                    <ChevronDown size={14} />
                  </div>
                </button>

                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-neutral-50' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 pt-2 text-xs md:text-sm text-neutral-500 leading-relaxed font-light pl-[60px] pr-8 text-justify">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unresolved Question Section */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-200/40 shadow-sm text-center space-y-5 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-neutral-950 flex items-center justify-center text-white mx-auto shadow-sm">
            <HelpCircle size={18} />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-serif text-base text-neutral-950 font-medium">
              {t("stillQuestionsTitle", { defaultValue: "Have a bespoke inquiry?" })}
            </h4>
            <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
              {t("stillQuestionsDesc", { defaultValue: "Connect directly with our workshop engineers to map out customized spatial dimensions." })}
            </p>
          </div>
          <div className="pt-2">
            <a 
              href={`/contact`}
              className="inline-flex px-6 py-3 bg-neutral-50 hover:bg-neutral-950 hover:text-white border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm"
            >
              {t("ctaContactText", { defaultValue: "Get in Touch" })}
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
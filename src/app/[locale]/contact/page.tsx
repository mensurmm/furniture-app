"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Clock, Phone, Mail, Send, CheckCircle, Sparkles, ChevronDown, AlertCircle } from "lucide-react";
// 1. IMPORT THE SERVER ACTION HERE (Make sure this path matches where you saved contact.ts)
import { submitContactForm } from "@/app/actions/contact"; 

export default function ContactPage() {
  const t = useTranslations("Contact");
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 2. LIVE ASYNC HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("email", formState.email);
    formData.append("reason", formState.subject);
    formData.append("message", formState.message);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsSubmitted(true);
        setFormState({ name: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        setErrorMessage(result.error || "Failed to submit message.");
      }
    } catch (err) {
      setErrorMessage("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-stone-900 selection:bg-amber-900 selection:text-white py-20 lg:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-16 space-y-6">
          <span className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-amber-900/5 text-amber-700 border border-amber-900/10 text-[10px] tracking-widest font-bold uppercase shadow-sm">
            <Sparkles size={12} />
            {t("getInTouch")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-stone-900 leading-[1.1]">
            {t("headerTitleNormal")} <span className="italic font-light text-amber-800">{t("headerTitleItalic")}</span>.
          </h1>
          <p className="text-stone-500 font-light leading-relaxed text-base md:text-lg max-w-2xl">
            {t("headerDesc")}
          </p>
        </div>

        {/* Main Grid Layout - Removed items-start to allow columns to stretch to equal height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Column 1: Informational Details (5 cols) - Changed to flex-col to allow inner stretching */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Showroom & Hours Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 space-y-6 group shrink-0">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-stone-50 rounded-2xl text-stone-500 border border-stone-100 shrink-0 group-hover:bg-amber-900/5 group-hover:text-amber-700 group-hover:border-amber-900/20 transition-colors duration-500">
                  <MapPin size={22} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    {t("showroomTitle")}
                  </h3>
                  <p className="text-lg font-serif font-medium text-stone-900">{t("showroomName")}</p>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    {t("showroomAddress")}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-stone-100 flex items-start gap-4">
                <div className="p-3.5 bg-stone-50 rounded-2xl text-stone-500 border border-stone-100 shrink-0 group-hover:bg-amber-900/5 group-hover:text-amber-700 group-hover:border-amber-900/20 transition-colors duration-500">
                  <Clock size={22} strokeWidth={1.5} />
                </div>
                <div className="w-full">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">{t("hoursTitle")}</p>
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between text-sm text-stone-500 font-light pb-2 border-b border-stone-50">
                      <span>{t("hoursWeekdays")}</span>
                      <span className="font-medium text-stone-800">{t("hoursWeekdaysTime")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-stone-500 font-light">
                      <span>{t("hoursSunday")}</span>
                      <span className="text-stone-400 font-normal">{t("hoursSundayTime")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Connect Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 space-y-6 group shrink-0">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-stone-50 rounded-2xl text-stone-500 border border-stone-100 shrink-0 group-hover:bg-amber-900/5 group-hover:text-amber-700 group-hover:border-amber-900/20 transition-colors duration-500">
                  <Phone size={22} strokeWidth={1.5} />
                </div>
                <div className="space-y-2 w-full">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">
                    {t("directContact")}
                  </h3>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1.5">{t("phone")}</p>
                    <div className="space-y-1.5">
                      <a href="tel:+251911000000" className="block text-sm font-medium text-stone-800 hover:text-amber-700 transition-colors">
                        +251 (0) 911 000 000
                      </a>
                      <a href="tel:+251911111111" className="block text-sm font-medium text-stone-800 hover:text-amber-700 transition-colors">
                        +251 (0) 911 111 111
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-stone-100 flex items-start gap-4">
                <div className="p-3.5 bg-stone-50 rounded-2xl text-stone-500 border border-stone-100 shrink-0 group-hover:bg-amber-900/5 group-hover:text-amber-700 group-hover:border-amber-900/20 transition-colors duration-500">
                  <Mail size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1.5">{t("email")}</p>
                  <a href="mailto:info@bebafurniture.com" className="block text-sm font-medium text-stone-800 hover:text-amber-700 transition-colors">
                    info@bebafurniture.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map Block - Replaced aspect ratio with flex-1 to stretch and fill remaining gap */}
            <div className="relative group overflow-hidden rounded-[2rem] flex-1 min-h-[300px] bg-stone-200 border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <iframe
                title="Beba Furniture Arat Kilo Showroom Map"
                src="https://maps.google.com/maps?q=Arat%20Kilo%20Monument,%20Addis%20Ababa&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0 filter grayscale-[0.3] contrast-[1.05] opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-stone-950/85 backdrop-blur-md rounded-2xl border border-white/10 pointer-events-none transition-all duration-500 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-4 flex justify-between items-center text-white">
                <div>
                  <h4 className="font-serif font-medium text-sm">{t("showroomName")}</h4>
                  <p className="text-[10px] text-stone-300 font-light mt-1 tracking-wide">{t("mapsSub")}</p>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-3 py-1.5 rounded-full text-white">
                  {t("openMapBtn")}
                </span>
              </div>
            </div>

          </div>

          {/* Column 2: Elegant Form */}
          <div className="lg:col-span-7 h-full">
            <div className="bg-white p-8 sm:p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-stone-100 relative overflow-hidden h-full flex flex-col">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

              <div className="mb-10 relative z-10 shrink-0">
                <h2 className="text-3xl font-serif font-medium text-stone-900 mb-3">{t("sendMessage")}</h2>
                <p className="text-stone-400 text-sm font-light">{t("replyTime")}</p>
              </div>

              {/* Dynamic Error Status Notice */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-center gap-2.5 animate-fade-in shrink-0">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isSubmitted ? (
                <div className="bg-stone-50 border border-stone-100 rounded-[2rem] p-12 text-center space-y-5 animate-fade-in flex flex-col items-center justify-center flex-1">
                  <div className="w-16 h-16 bg-white shadow-sm border border-stone-100 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                    <CheckCircle size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-stone-900">{t("sentSuccess")}</h3>
                  <p className="text-sm text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
                    {t("successDesc")}
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-semibold text-amber-800 hover:underline pt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex flex-col flex-1">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 pl-1">
                        {t("yourName")}
                      </label>
                      <input 
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full text-sm px-5 py-4 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:bg-white transition-all duration-300" 
                        placeholder={t("placeholderName")} 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 pl-1">
                        {t("yourEmail")}
                      </label>
                      <input 
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full text-sm px-5 py-4 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:bg-white transition-all duration-300" 
                        placeholder="abebe@example.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 shrink-0">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 pl-1">
                      {t("reason")}
                    </label>
                    <div className="relative">
                      <select 
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full text-sm px-5 py-4 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="General Inquiry">{t("generalInquiry")}</option>
                        <option value="Custom Furniture Quote">{t("customFurniture")}</option>
                        <option value="Showroom Private Booking">{t("bookVisit")}</option>
                        <option value="Wholesale & B2B">{t("wholesale")}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-stone-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Make textarea take remaining height using flex-1 */}
                  <div className="space-y-2 flex flex-col flex-1 min-h-[160px]">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 pl-1 shrink-0">
                      {t("message")}
                    </label>
                    <textarea 
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full h-full flex-1 text-sm px-5 py-4 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:bg-white transition-all duration-300 resize-none leading-relaxed" 
                      placeholder={t("placeholderMessage")} 
                    />
                  </div>

                  <div className="pt-2 shrink-0">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative overflow-hidden bg-stone-900 text-white py-5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                      <span className="relative flex items-center gap-2">
                        {isSubmitting ? t("sending", { defaultValue: 'Transmitting...' }) : t("sendButton")}
                        {!isSubmitting && <Send size={16} className="transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
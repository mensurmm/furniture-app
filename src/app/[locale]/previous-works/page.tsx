"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import ProductDetails from '@/components/ProductDetails';
import { useTranslations } from "next-intl";
import { Loader2, Star, Sparkles, ArrowRight } from "lucide-react";

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  created_at: string;
  comment: string;
}

export interface PreviousWorkProduct {
  id: string;
  title_en: string;
  title_am: string;
  category: 'living_room' | 'kitchen' | 'bedroom' | 'office' | 'dining';
  material_en: string;
  material_am: string;
  price_en: string;
  price_am: string;
  dimensions?: string;
  desc_en: string;
  desc_am: string;
  image_url: string; 
  detail_images: string[] | { url: string; price: string }[]; 
  reviews?: Review[];
}

export default function PreviousWorks() {
  const t = useTranslations("PreviousWorks");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [products, setProducts] = useState<PreviousWorkProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<PreviousWorkProduct | null>(null);

  const categories = [
    { key: 'All', label: t("catAll") },
    { key: 'living_room', label: t("catLivingRoom") },
    { key: 'kitchen', label: t("catKitchen") },
    { key: 'bedroom', label: t("catBedroom") },
    { key: 'office', label: t("catOffice") },
    { key: 'dining', label: t("catDining") }
  ];

  const fetchPreviousWorks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("previous_works")
        .select(`
          *,
          reviews (
            id,
            reviewer_name,
            rating,
            comment,
            created_at
          )
        `);

      if (error) throw error;
      if (data) {
        setProducts(data as PreviousWorkProduct[]);
        if (selectedProduct) {
          const updatedSelected = (data as PreviousWorkProduct[]).find(p => p.id === selectedProduct.id);
          if (updatedSelected) setSelectedProduct(updatedSelected);
        }
      }
    } catch (err) {
      console.error("Error fetching previous works:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousWorks();
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const getAverageRating = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return null;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center bg-[#F9F9F8]">
        <Loader2 className="animate-spin text-stone-900" size={32} />
        <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">Loading Archives...</span>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetails 
        product={selectedProduct} 
        onBack={() => {
          setSelectedProduct(null);
          fetchPreviousWorks();
        }} 
      />
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-[#F9F9F8] text-stone-900 min-h-screen selection:bg-amber-900 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center space-y-6">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/5 text-amber-700 border border-amber-900/10 text-[10px] tracking-widest font-bold uppercase">
            <Sparkles size={12} />
            {t("sectionLabel")}
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif text-stone-950 font-medium tracking-tight">
            {t("sectionTitle")}
          </h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border ${
                  activeCategory === cat.key
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-white text-stone-500 border-stone-200 hover:text-stone-900 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Dynamic Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-32 text-center border border-stone-200 rounded-[2rem] bg-white shadow-sm">
            <p className="text-lg font-serif text-stone-400 italic">No historical artifacts available in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProducts.map((product) => {
              const avgRating = getAverageRating(product.reviews);
              const resolvedCategoryLabel = categories.find(c => c.key === product.category)?.label || product.category;
              
              const title = locale === "am" ? product.title_am || product.title_en : product.title_en || product.title_am;
              const material = locale === "am" ? product.material_am || product.material_en : product.material_en || product.material_am;
              const price = locale === "am" ? product.price_am || product.price_en : product.price_en || product.price_am;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col"
                >
                  {/* Stable Image Frame */}
                  <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500 z-10"></div>
                    
                    <span className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[9px] font-bold tracking-widest text-stone-800 uppercase rounded-lg shadow-sm">
                      {resolvedCategoryLabel}
                    </span>
                    
                    {avgRating && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-stone-950/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span>{avgRating}</span>
                        <span className="text-[10px] text-stone-300 ml-0.5">({product.reviews?.length})</span>
                      </div>
                    )}

                    <img
                      src={product.image_url}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  </div>

                  {/* Description Block */}
                  <div className="p-8 flex justify-between items-center bg-white flex-1 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl text-stone-900 font-medium tracking-tight group-hover:text-amber-700 transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs text-stone-500 font-bold tracking-wide uppercase">
                        {material} <span className="mx-2 font-normal text-stone-300">|</span> <span className="text-stone-700 normal-case">{price}</span>
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full border border-stone-200 flex-shrink-0 flex items-center justify-center text-stone-400 group-hover:bg-amber-700 group-hover:border-amber-700 group-hover:text-white transition-all duration-300 shadow-sm">
                      <ArrowRight size={18} className="transform transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Philosophy Block */}
        <div className="pt-24 border-t border-stone-200/60 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-stone-300"></span> {t("philosophyLabel")}
            </h4>
            <h3 className="text-3xl md:text-4xl font-serif text-stone-900 font-medium leading-tight tracking-tight">
              {t("philosophyTitle")}
            </h3>
          </div>
          <div className="lg:col-span-7 space-y-6 text-stone-500 text-sm leading-loose font-light lg:pl-8 lg:border-l border-stone-200/60">
            <p>{t("philosophyDesc1")}</p>
            <p>{t("philosophyDesc2")}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
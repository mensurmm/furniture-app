"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Check, ShieldCheck, Truck, MessageSquare, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

interface ProductType {
  id: string;
  title_en: string;
  title_am: string;
  desc_en: string;
  desc_am: string;
  price_en: string;
  price_am: string;
  material_en: string;
  material_am: string;
  color_hex: string;
  image_url: string;
  category: string;
  detail_images: { url: string; price?: string }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const locale = (params?.locale as string) || "en";

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [activePreview, setActivePreview] = useState<string>("");
  const [activePrice, setActivePrice] = useState<string>("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          const fetchedProduct = data as ProductType;
          setProduct(fetchedProduct);
          
          setActivePreview(fetchedProduct.image_url || "");
          setActivePrice(
            locale === "am" 
              ? fetchedProduct.price_am || fetchedProduct.price_en 
              : fetchedProduct.price_en || fetchedProduct.price_am
          );
        }
      } catch (err) {
        console.error("Error retrieving product details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center bg-[#F9F9F8]">
        <Loader2 className="animate-spin text-stone-900" size={32} />
        <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">Loading Artifact...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F8] p-6 text-center">
        <h2 className="text-2xl font-serif text-stone-900 mb-4">Artifact Not Found</h2>
        <Link href="/new-products" className="text-sm font-bold uppercase tracking-widest text-amber-700 hover:text-amber-900 underline-offset-4 hover:underline">
          Return to Collection
        </Link>
      </div>
    );
  }

  const title = locale === "am" ? product.title_am || product.title_en : product.title_en || product.title_am;
  const description = locale === "am" ? product.desc_am || product.desc_en : product.desc_en || product.desc_am;
  const material = locale === "am" ? product.material_am || product.material_en : product.material_en || product.material_am;

  const hasGalleryImages = product.detail_images && product.detail_images.length > 0;

  return (
    <main className="min-h-screen bg-[#F9F9F8] py-12 px-4 sm:px-6 md:px-12 selection:bg-amber-900 selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation back */}
        <Link 
          href="/new-products" 
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 mb-10 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </Link>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 bg-white rounded-[2rem] p-6 sm:p-10 md:p-12 border border-stone-100 shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
          
          {/* Left: Product Media Frame */}
          <div className="space-y-6">
            <div className="rounded-[1.5rem] overflow-hidden bg-stone-50 border border-stone-100 relative aspect-[4/3] lg:aspect-square group">
              <img 
                src={activePreview} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Sub-gallery View Thumbs */}
            <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
              {hasGalleryImages && (
                <button 
                  onClick={() => {
                    setActivePreview(product.image_url);
                    setActivePrice(locale === 'am' ? product.price_am : product.price_en);
                  }}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-stone-50 cursor-pointer flex-shrink-0 transition-all duration-300 ${
                    activePreview === product.image_url ? 'border-amber-600 ring-4 ring-amber-600/10 scale-95' : 'border-stone-100 hover:border-stone-300'
                  }`}
                >
                  <img src={product.image_url} alt="Main view" className="w-full h-full object-cover" />
                </button>
              )}

              {product.detail_images?.map((item: any, idx: number) => {
                const imageUrl = typeof item === 'string' ? item : item?.url;
                const itemPrice = typeof item === 'object' && item?.price 
                  ? item.price 
                  : (locale === 'am' ? product.price_am : product.price_en);
                
                return (
                  <button 
                    key={idx}
                    onClick={() => {
                      setActivePreview(imageUrl);
                      setActivePrice(itemPrice);
                    }}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-stone-50 cursor-pointer flex-shrink-0 transition-all duration-300 ${
                      activePreview === imageUrl ? 'border-amber-600 ring-4 ring-amber-600/10 scale-95' : 'border-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <img src={imageUrl} alt={`Detail view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Feature Configurator Panel */}
          <div className="flex flex-col justify-center space-y-10">
            
            <div className="space-y-5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-900/5 px-3 py-1.5 rounded-full border border-amber-900/10">
                {product.category?.replace('_', ' ')}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-medium text-stone-900 tracking-tight leading-tight">{title}</h1>
              
              <p className="text-2xl font-bold text-stone-600 transition-all duration-200">
                {activePrice || "Price on request"}
              </p>
              
              <hr className="border-stone-100" />
            </div>

            <div className="space-y-8">
              {material && (
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-stone-400 mb-3 tracking-widest">
                    <span className="w-4 h-px bg-stone-300"></span> Base Material
                  </span>
                  <span className="inline-block px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm font-medium text-stone-800">
                    {material}
                  </span>
                </div>
              )}

              {description && (
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-stone-400 mb-3 tracking-widest">
                    <span className="w-4 h-px bg-stone-300"></span> Artifact Details
                  </span>
                  <p className="text-stone-500 text-sm leading-loose font-light bg-stone-50/50 p-5 rounded-2xl border border-stone-100">
                    {description}
                  </p>
                </div>
              )}

              {product.color_hex && (
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-stone-400 mb-3 tracking-widest">
                    <span className="w-4 h-px bg-stone-300"></span> Primary Finish
                  </span>
                  <div className="flex items-center gap-3">
                    <div 
                      style={{ backgroundColor: product.color_hex }} 
                      className="w-8 h-8 rounded-full border border-stone-200 shadow-inner"
                    />
                    <span className="text-xs font-mono font-medium text-stone-500 uppercase bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                      {product.color_hex}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link 
                href={`/contact?product=${encodeURIComponent(title)}`}
                className="w-full relative overflow-hidden group bg-stone-900 text-white py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <span className="relative flex items-center gap-2">
                  <MessageSquare size={18} />
                  Request Quote for Artifact
                </span>
              </Link>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-8">
              <div className="flex flex-col gap-1.5">
                <Truck size={20} className="text-amber-600" />
                <span className="text-xs font-semibold text-stone-900">White Glove Delivery</span>
                <span className="text-[10px] text-stone-500">Careful & precise installation</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <ShieldCheck size={20} className="text-amber-600" />
                <span className="text-xs font-semibold text-stone-900">Heirloom Warranty</span>
                <span className="text-[10px] text-stone-500">Built to last generations</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
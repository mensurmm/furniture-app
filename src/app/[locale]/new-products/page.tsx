"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing"; 
import { supabase } from "@/lib/supabase";
import { Sparkles, ArrowRight } from "lucide-react";

interface ProductItem {
  id: string;
  title_en: string;
  title_am: string;
  desc_en: string;
  desc_am: string;
  price_en: string;
  price_am: string;
  image_url: string;
  category: "living_room" | "kitchen" | "bedroom" | "office" | "dining";
  section: string;
  created_at: string;
}

export default function NewProductsPage() {
  const t = useTranslations("NewProductsPage");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    { key: "All", label: t("catAll", { defaultValue: "All Collection" }) },
    { key: "living_room", label: t("catLivingRoom", { defaultValue: "Living Room" }) },
    { key: "kitchen", label: t("catKitchen", { defaultValue: "Kitchen" }) },
    { key: "bedroom", label: t("catBedroom", { defaultValue: "Bedroom" }) },
    { key: "office", label: t("catOffice", { defaultValue: "Office" }) },
    { key: "dining", label: t("catDining", { defaultValue: "Dining" }) }
  ];

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("section", "new_products")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setProducts(data as ProductItem[]);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F9F9F8] py-20 px-4 sm:px-6 md:px-12 selection:bg-amber-900 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 flex flex-col items-center text-center space-y-6">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/5 text-amber-700 border border-amber-900/10 text-[10px] tracking-widest font-bold uppercase">
            <Sparkles size={12} />
            Latest Additions
          </span>
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-stone-950 tracking-tight mb-4">
              {t("title", { defaultValue: "Our New Arrivals" })}
            </h1>
            <p className="text-stone-500 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
              {t("subtitle", { defaultValue: "Explore our latest handcrafted, premium quality furniture items built with generational joinery standards." })}
            </p>
          </div>

          {/* Elegant Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border ${
                  activeCategory === cat.key
                    ? "bg-stone-900 text-white border-stone-900 shadow-md"
                    : "bg-white text-stone-500 border-stone-200 hover:text-stone-900 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </header>

        {/* Products Grid Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-900"></div>
            <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">Curating Collection...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2rem] border border-stone-100 p-8 shadow-sm">
            <p className="text-stone-400 font-serif text-lg italic">No artifacts found in this collection.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
            {filteredProducts.map((product) => {
              const title = locale === "am" ? product.title_am || product.title_en : product.title_en || product.title_am;
              const description = locale === "am" ? product.desc_am || product.desc_en : product.desc_en || product.desc_am;
              const price = locale === "am" ? product.price_am || product.price_en : product.price_en || product.price_am;

              const productDetailRoute = `/new-products/${product.id}`;

              return (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-3xl border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col h-full flex-grow"
                >
                  <Link href={productDetailRoute} className="h-64 overflow-hidden bg-stone-100 block relative cursor-pointer">
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500 z-10"></div>
                    <img 
                      src={product.image_url} 
                      alt={title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                    />
                  </Link>

                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-serif font-medium text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">{title}</h3>
                      <p className="text-sm font-bold text-stone-500 mb-4">{price || "Price on Request"}</p>
                      <p className="text-stone-400 text-xs leading-relaxed line-clamp-2 font-light">{description}</p>
                    </div>

                    <Link
                      href={productDetailRoute}
                      className="mt-6 text-xs font-bold uppercase tracking-widest text-stone-900 group-hover:text-amber-700 transition-colors duration-300 self-start inline-flex items-center gap-2"
                    >
                      View Artifact <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
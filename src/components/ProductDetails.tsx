"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { PreviousWorkProduct, Review } from '../app/[locale]/previous-works/page';
import { useTranslations } from 'next-intl';
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, MessageSquare, Star } from "lucide-react";

interface ProductDetailsProps {
  product: PreviousWorkProduct;
  onBack: () => void;
}

export default function ProductDetails({ product, onBack }: ProductDetailsProps) {
  const t = useTranslations("ProductDetails");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const title = locale === "am" ? product.title_am || product.title_en : product.title_en || product.title_am;
  const description = locale === "am" ? product.desc_am || product.desc_en : product.desc_en || product.desc_am;
  const material = locale === "am" ? product.material_am || product.material_en : product.material_en || product.material_am;
  const masterPrice = locale === "am" ? product.price_am || product.price_en : product.price_en || product.price_am;

  const galleryImages = Array.isArray(product.detail_images)
    ? product.detail_images.map((img) => (
        typeof img === 'string' 
          ? { url: img, price: "" } 
          : { url: img.url, price: img.price }
      ))
    : [];

  const allImages = [
    { url: product.image_url, price: masterPrice },
    ...galleryImages
  ].filter(img => img.url);

  const [activeImage, setActiveImage] = useState<{ url: string; price: string }>(allImages[0]);
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);
  
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'living_room': return t("catLivingRoom", { defaultValue: 'Living Room' });
      case 'kitchen': return t("catKitchen", { defaultValue: 'Kitchen' });
      case 'bedroom': return t("catBedroom", { defaultValue: 'Bedroom' });
      case 'office': return t("catOffice", { defaultValue: 'Office' });
      case 'dining': return t("catDining", { defaultValue: 'Dining' });
      default: return cat.replace('_', ' ');
    }
  };

  const getAverageRating = () => {
    if (reviewsList.length === 0) return t("noReviewsYet", { defaultValue: 'No reviews yet' });
    const total = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviewsList.length).toFixed(1);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) {
      setReviewError("Please fill in your name and comment.");
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            previous_works_id: product.id,
            reviewer_name: reviewerName.trim(),
            rating: rating,
            comment: comment.trim()
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setReviewsList((prev) => [data[0] as Review, ...prev]);
        setReviewerName('');
        setComment('');
        setRating(5);
      }
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setReviewError(err.message || "Failed to submit rating.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 md:px-12 bg-[#F9F9F8] text-stone-900 min-h-screen selection:bg-amber-900 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t("backToCatalog", { defaultValue: 'Back to Archives' })}
        </button>

        {/* Primary Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start bg-white rounded-[2rem] p-6 sm:p-10 md:p-12 border border-stone-100 shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
          
          {/* Left Column: Rich Media Swapper */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden bg-stone-50 border border-stone-100 relative group">
              <img
                src={activeImage.url}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Gallery Selector strip */}
            <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
              {allImages.map((imgObj, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgObj)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-stone-50 cursor-pointer flex-shrink-0 transition-all duration-300 ${
                    activeImage.url === imgObj.url ? 'border-amber-600 ring-4 ring-amber-600/10 scale-95' : 'border-stone-100 hover:border-stone-300'
                  }`}
                >
                  <img src={imgObj.url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Spec Sheet & Interaction */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
            <div className="space-y-5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-900/5 px-3 py-1.5 rounded-full border border-amber-900/10">
                {getCategoryLabel(product.category)}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-medium leading-tight tracking-tight">
                {title}
              </h1>

              {/* Display Review & Pricing together */}
              <div className="flex items-center gap-4 pt-1">
                <div className="text-2xl font-bold text-stone-600 transition-all duration-200">
                  {activeImage.price || masterPrice}
                </div>
                <div className="h-6 w-px bg-stone-200" />
                <div className="flex items-center gap-1.5 text-sm">
                  <Star size={18} className="text-amber-500 fill-amber-500" />
                  <span className="font-bold text-stone-800">{getAverageRating()}</span>
                  <span className="text-stone-400 font-medium">
                    ({reviewsList.length} reviews)
                  </span>
                </div>
              </div>
              <hr className="border-stone-100" />
            </div>

            <div className="space-y-8">
              <div>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-stone-400 mb-3 tracking-widest">
                  <span className="w-4 h-px bg-stone-300"></span> Artifact History & Details
                </span>
                <p className="text-stone-500 text-sm leading-loose font-light bg-stone-50/50 p-5 rounded-2xl border border-stone-100">
                  {description}
                </p>
              </div>

              <div>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-stone-400 mb-3 tracking-widest">
                  <span className="w-4 h-px bg-stone-300"></span> Base Material / Timber
                </span>
                <span className="inline-block px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm font-medium text-stone-800">
                  {material}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                href={`/contact?product=${encodeURIComponent(title)}`} 
                className="w-full relative overflow-hidden group bg-stone-900 text-white py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <span className="relative flex items-center gap-2">
                  <MessageSquare size={18} />
                  {t("ctaInquire", { defaultValue: 'Inquire About Customization' })}
                </span>
              </Link>
            </div>
            
          </div>
        </div>

        {/* Ratings Showcase and Interactive Form Block */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Timeline Feed display list */}
          <div className="md:col-span-7 space-y-6">
            <h3 className="text-2xl font-serif font-medium text-stone-900 mb-6 flex items-center gap-3">
              Client Testimonials <span className="text-xs font-sans font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">{reviewsList.length}</span>
            </h3>
            
            {reviewsList.length === 0 ? (
              <div className="p-8 border border-dashed border-stone-200 rounded-2xl text-center bg-white shadow-sm">
                <p className="text-stone-400 font-serif italic text-lg">No reviews yet. Be the first to leave one!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{rev.reviewer_name}</h4>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mt-1">
                          {new Date(rev.created_at).toLocaleDateString(locale === "am" ? "am-ET" : "en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex text-amber-500 gap-0.5 text-sm">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-stone-600 font-light leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review form submissions */}
          <div className="md:col-span-5">
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm sticky top-8">
              <h3 className="text-xl font-serif font-medium text-stone-900 mb-6">Leave a Review</h3>
              
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                {reviewError && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 font-medium">{reviewError}</p>
                )}
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-600 ml-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full text-sm px-4 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none placeholder:text-stone-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-600 ml-1">Overall Rating</label>
                  <div className="flex gap-2 items-center p-3 bg-stone-50 rounded-xl border border-stone-200 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          size={24} 
                          className={star <= rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'} 
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-500 ml-3 bg-white px-2 py-1 rounded-md shadow-sm border border-stone-100">
                      {rating}.0
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-600 ml-1">Your Experience</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts on the craftsmanship and details..."
                    className="w-full text-sm px-4 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none resize-none placeholder:text-stone-400 leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                >
                  {submittingReview ? <Loader2 size={16} className="animate-spin" /> : "Submit Feedback"}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
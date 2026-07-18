"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { 
  Loader2, Upload, CheckCircle2, AlertCircle, Image as ImageIcon, 
  User, Phone, Home, Armchair, Palette, Trees, Ruler, Sparkles, Box 
} from 'lucide-react';

interface CatalogItemOption {
  id: string;
  title_en: string;
  image_url: string;
  sourceTable: 'products' | 'previous_works';
}

export default function CustomOrderPage() {
  const t = useTranslations("CustomOrder");
  
  // Base Details
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [preferredColor, setPreferredColor] = useState('');
  const [material, setMaterial] = useState('');
  const [specifications, setSpecifications] = useState('');
  
  // Selection Logic Matrix
  const [referenceType, setReferenceType] = useState<'catalog' | 'upload' | 'none'>('catalog');
  const [catalogSource, setCatalogSource] = useState<'products' | 'previous_works'>('products');
  const [catalogItems, setCatalogItems] = useState<CatalogItemOption[]>([]);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItemOption | null>(null);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customPreview, setCustomPreview] = useState<string>('');

  // Execution States
  const [loading, setLoading] = useState(false);
  const [fetchingCatalog, setFetchingCatalog] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Sync internal listings depending on targeted showcase tab
  useEffect(() => {
    if (referenceType !== 'catalog') return;
    
    const loadSourceCatalog = async () => {
      setFetchingCatalog(true);
      try {
        const { data, error } = await supabase
          .from(catalogSource)
          .select('id, title_en, image_url');
        
        if (error) throw error;
        
        const structured: CatalogItemOption[] = (data || []).map(item => ({
          id: item.id.toString(),
          title_en: item.title_en || 'Untitled Artifact',
          image_url: item.image_url,
          sourceTable: catalogSource
        }));
        
        setCatalogItems(structured);
        setSelectedCatalogItem(structured[0] || null);
      } catch (err) {
        console.error("Failed fetching reference layout targets:", err);
      } finally {
        setFetchingCatalog(false);
      }
    };

    loadSourceCatalog();
  }, [catalogSource, referenceType]);

  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFile(file);
      setCustomPreview(URL.createObjectURL(file));
    }
  };

  const handleOrderSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      let finalImageUrl = "";

      if (referenceType === 'upload' && customFile) {
        const storagePath = `custom-client-briefs/${Date.now()}-${customFile.name}`;
        const { error: uploadErr } = await supabase.storage
          .from('products')
          .upload(storagePath, customFile, { upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(storagePath);

        finalImageUrl = publicUrl;
      } 
      else if (referenceType === 'catalog' && selectedCatalogItem) {
        finalImageUrl = selectedCatalogItem.image_url;
      }

      const orderPayload = {
        full_name: fullName,
        phone_number: phoneNumber,
        room_type: roomType || null,
        item_category: itemCategory || null,
        preferred_color: preferredColor || null,
        material: material || null,
        specifications: specifications || null,
        reference_type: referenceType,
        catalog_source: referenceType === 'catalog' ? catalogSource : null,
        catalog_item_title: referenceType === 'catalog' ? selectedCatalogItem?.title_en : null,
        image_url: finalImageUrl || null,
        is_seen: false
      };

      const { error: dbError } = await supabase
        .from('custom_orders')
        .insert([orderPayload]);

      if (dbError) throw dbError;

      setStatus({ type: 'success', msg: 'Your custom configuration order brief was registered successfully!' });
      
      setFullName('');
      setPhoneNumber('');
      setRoomType('');
      setItemCategory('');
      setPreferredColor('');
      setMaterial('');
      setSpecifications('');
      setCustomFile(null);
      setCustomPreview('');
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Processing brief submission encountered issues.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F8] py-16 px-4 sm:px-6 lg:px-8 selection:bg-amber-900 selection:text-white">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden">
        
        {/* Banner Headers */}
        <div className="relative px-8 py-14 bg-stone-950 text-white text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 text-amber-500 border border-amber-500/20 text-[10px] tracking-widest font-bold uppercase">
              <Sparkles size={12} />
              Bespoke Studio
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-stone-50">
              Customize Your Furniture
            </h1>
            <p className="text-sm text-stone-400 max-w-lg mx-auto font-light leading-relaxed">
              Provide specs, design reference picks, or sketches to construct custom-built artisanal configurations tailored to your space.
            </p>
          </div>
        </div>

        <form onSubmit={handleOrderSubmission} className="p-6 sm:p-10 md:p-12 space-y-12">
          {status && (
            <div className={`flex items-start gap-3 p-5 rounded-2xl text-sm transition-all duration-500 ${
              status.type === 'success' ? 'bg-emerald-50/80 text-emerald-900 border border-emerald-200' : 'bg-rose-50/80 text-rose-900 border border-rose-200'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} /> : <AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={20} />}
              <p className="font-medium leading-relaxed">{status.msg}</p>
            </div>
          )}

          {/* Section 1: Personal Details */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-stone-200 flex-1"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">01. Personal Info</h3>
              <div className="h-px bg-stone-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} 
                    className="w-full text-sm pl-11 pr-4 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none placeholder:text-stone-400" 
                    placeholder="e.g. Almaz Kebede" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input required type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} 
                    className="w-full text-sm pl-11 pr-4 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none placeholder:text-stone-400" 
                    placeholder="e.g. +251 911 000 000" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Configuration */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-stone-200 flex-1"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">02. Design Specs</h3>
              <div className="h-px bg-stone-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600 ml-1">Room Environment</label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <select value={roomType} onChange={(e) => setRoomType(e.target.value)} 
                    className="w-full appearance-none text-sm pl-11 pr-10 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none text-stone-700 cursor-pointer">
                    <option value="" disabled>Select Target Space</option>
                    <option value="living_room">Living Room</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="office">Office</option>
                    <option value="dining">Dining Area</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600 ml-1">Item Classification</label>
                <div className="relative">
                  <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} 
                    className="w-full appearance-none text-sm pl-11 pr-10 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none text-stone-700 cursor-pointer">
                    <option value="" disabled>Select Item Type</option>
                    <option value="sofa">Sofa / Couch</option>
                    <option value="bed">Bedframe Structure</option>
                    <option value="table">Dining / Work Table</option>
                    <option value="cabinet">Cabinet / Storage</option>
                    <option value="chair">Accent Chair Block</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600 ml-1">Preferred Color Accent</label>
                <div className="relative">
                  <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input type="text" value={preferredColor} onChange={(e) => setPreferredColor(e.target.value)} 
                    className="w-full text-sm pl-11 pr-4 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none placeholder:text-stone-400" 
                    placeholder="e.g. Matte Gold / Charcoal" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600 ml-1">Timber / Wood Material</label>
                <div className="relative">
                  <Trees className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} 
                    className="w-full text-sm pl-11 pr-4 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none placeholder:text-stone-400" 
                    placeholder="e.g. Solid Wanza / Weyra" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-600 ml-1">Detailed Specifications</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-4 text-stone-400" size={18} />
                <textarea rows={4} value={specifications} onChange={(e) => setSpecifications(e.target.value)} 
                  className="w-full text-sm pl-11 pr-4 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none resize-none placeholder:text-stone-400 leading-relaxed" 
                  placeholder="Specify layout dimensions (LxWxH), custom finishing waxes, upholstery texturing ideas..."></textarea>
              </div>
            </div>
          </section>

          {/* Section 3: Inspiration */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-stone-200 flex-1"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">03. Visual Blueprint</h3>
              <div className="h-px bg-stone-200 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50/50 p-2 rounded-2xl border border-stone-100">
              {(['catalog', 'upload', 'none'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setReferenceType(mode)}
                  className={`py-3.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    referenceType === mode 
                      ? 'bg-white text-stone-900 shadow-[0_2px_10px_rgb(0,0,0,0.06)] border border-stone-200' 
                      : 'bg-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100 border border-transparent'
                  }`}
                >
                  {mode === 'catalog' && <Box size={16} className={referenceType === mode ? 'text-amber-600' : ''} />}
                  {mode === 'upload' && <Upload size={16} className={referenceType === mode ? 'text-amber-600' : ''} />}
                  {mode === 'none' && <ImageIcon size={16} className={referenceType === mode ? 'text-amber-600' : ''} />}
                  <span>{mode === 'catalog' ? 'Site Catalog' : mode === 'upload' ? 'Upload File' : 'No Reference'}</span>
                </button>
              ))}
            </div>

            <div className="min-h-[160px]">
              {/* Mode A Elements: catalog options lookup */}
              {referenceType === 'catalog' && (
                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap">Source Library:</label>
                    <div className="flex gap-2 w-full p-1 bg-stone-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setCatalogSource('products')}
                        className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${catalogSource === 'products' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                      >
                        New Products
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatalogSource('previous_works')}
                        className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${catalogSource === 'previous_works' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                      >
                        Previous Works
                      </button>
                    </div>
                  </div>

                  {fetchingCatalog ? (
                    <div className="flex flex-col items-center justify-center py-8 text-stone-400 gap-3">
                      <Loader2 className="animate-spin" size={24} />
                      <span className="text-xs tracking-widest uppercase">Fetching archives...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
                      <div className="sm:col-span-8 space-y-2">
                        <label className="block text-xs font-semibold text-stone-600 ml-1">Select Artifact Design</label>
                        <div className="relative">
                          <select 
                            value={selectedCatalogItem?.id || ''} 
                            onChange={(e) => setSelectedCatalogItem(catalogItems.find(item => item.id === e.target.value) || null)}
                            className="w-full appearance-none text-sm pl-4 pr-10 py-3.5 bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 outline-none text-stone-700 cursor-pointer"
                          >
                            {catalogItems.map(item => (
                              <option key={item.id} value={item.id}>{item.title_en}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-4">
                        {selectedCatalogItem?.image_url ? (
                          <div className="w-full aspect-video sm:aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100 group">
                            <img src={selectedCatalogItem.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Preview Thumbnail" />
                          </div>
                        ) : (
                          <div className="w-full aspect-video sm:aspect-square rounded-xl border border-dashed border-stone-200 flex items-center justify-center text-stone-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mode B Elements: Upload picker fields */}
              {referenceType === 'upload' && (
                <div className="relative group p-10 border-2 border-dashed border-stone-200 rounded-2xl text-center bg-stone-50/50 hover:bg-stone-50 hover:border-amber-400/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                  <input type="file" accept="image/*" onChange={handleCustomFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  
                  {!customPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-stone-400 group-hover:text-amber-600 group-hover:scale-110 transition-all duration-300">
                        <Upload size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-700">Click or drag image here</p>
                        <p className="text-xs text-stone-500 mt-1">Supports PNG, JPG (Max 10MB)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <img src={customPreview} className="w-32 h-32 rounded-xl object-cover shadow-md border-4 border-white" alt="Custom inspiration preview" />
                        <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                      <p className="text-xs font-medium text-stone-600 bg-white px-4 py-1.5 rounded-full border border-stone-200 shadow-sm">
                        {customFile?.name}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {referenceType === 'none' && (
                <div className="p-8 text-center border border-stone-100 bg-stone-50/50 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-sm text-stone-500">No visual reference will be attached to this brief. Our artisans will rely entirely on your detailed specifications.</p>
                </div>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden group bg-stone-900 disabled:bg-stone-300 text-white py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Submit Custom Request'}
            </span>
          </button>
        </form>
      </div>
    </main>
  );
}
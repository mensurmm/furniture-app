"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 
import { Image as ImageIcon, Loader2, Upload, Globe, X, AlertTriangle, Image, Trash2, Edit3, PlusCircle, CheckCircle2 } from 'lucide-react';
import AdminLogin from './AdminLogin';

interface PendingGalleryItem {
  file?: File; 
  previewUrl: string;
  price: string; 
}

interface LoadedItem {
  id: string;
  title_en: string;
  title_am: string;
  category: string;
  section?: string;
  price_en: string;
  price_am: string;
  material_en: string;
  material_am: string;
  desc_en: string;
  desc_am: string;
  color_hex?: string;
  image_url: string;
  detail_images?: { url: string; price: string }[] | string[];
}
// 2. ADD THIS NEW GATEKEEPER COMPONENT RIGHT ABOVE LINE 30
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a clean loading state while verifying auth status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="animate-spin text-zinc-300" size={32} />
      </div>
    );
  }

  // If not authenticated, intercept and show the beautiful login screen
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // If authenticated, render the main dashboard down below
  return <AdminDashboard />;
}
function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; title: string; details: string } | null>(null);
  
  // Tab & Form States
  const [activeTab, setActiveTab] = useState<'en' | 'am'>('en');
  const [section, setSection] = useState('new_products'); 
  const [category, setCategory] = useState('dining'); 
  const [titleEn, setTitleEn] = useState('');
  const [titleAm, setTitleAm] = useState('');
  const [priceEn, setPriceEn] = useState('');
  const [priceAm, setPriceAm] = useState('');
  const [materialEn, setMaterialEn] = useState('');
  const [materialAm, setMaterialAm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAm, setDescAm] = useState('');
  const [colorHex, setColorHex] = useState('#ffffff');
  
  // Files States
  const [imageFiles, setImageFiles] = useState<File[]>([]); 
  const [existingImageUrl, setExistingImageUrl] = useState<string>(''); 
  const [detailItems, setDetailItems] = useState<PendingGalleryItem[]>([]); 
  
  // CRUD Management States
  const [existingItems, setExistingItems] = useState<LoadedItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSourceTable, setEditingSourceTable] = useState<'products' | 'previous_works' | null>(null);
 
  // Duplicate Check States
  const [showOverridePrompt, setShowOverridePrompt] = useState(false);
  const [duplicateFiles, setDuplicateFiles] = useState<string[]>([]);

  // Helper to determine active database table name based on selection
  const getTargetTable = (secValue: string) => {
    return secValue === 'previous_works' ? 'previous_works' : 'products';
  };

  // Bespoke custom order tracking additions
  const [customOrders, setCustomOrders] = useState<any[]>([]);
  const [activeManageTable, setActiveManageTable] = useState<'products' | 'previous_works' | 'custom_orders'>('products');
  
  // Pull incoming customized ordering streams from the database
  const fetchCustomOrders = async () => {
    setListLoading(true);
    try {
      const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setCustomOrders(data || []);
    } catch (err: any) {
      console.error("Custom order collection issue:", err.message);
    } finally {
      setListLoading(false);
    }
  };

  // Toggle order status visibility flag and sync state
  const toggleOrderSeen = async (id: string, currentSeenStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_orders')
        .update({ is_seen: !currentSeenStatus })
        .eq('id', id);
      if (error) throw error;
      
      setCustomOrders(prev => prev.map(ord => ord.id === id ? { ...ord, is_seen: !currentSeenStatus } : ord));
    } catch (err: any) {
      alert("Error mutating order visibility status: " + err.message);
    }
  };

  // Delete an incoming customer order
  const handleDeleteCustomOrder = async (id: string) => {
    if (!window.confirm("Permanently erase this custom client configuration tracking index row?")) return;
    try {
      const { error } = await supabase.from('custom_orders').delete().eq('id', id);
      if (error) throw error;
      setCustomOrders(prev => prev.filter(ord => ord.id !== id));
    } catch (err: any) {
      alert("Failed destroying row object entry target: " + err.message);
    }
  };

  useEffect(() => {
    if (activeManageTable === 'custom_orders') {
      fetchCustomOrders();
    } else {
      fetchExistingItems(activeManageTable);
    }
  }, [activeManageTable]);

  // Fetch items for the management panel
  const fetchExistingItems = async (table: 'products' | 'previous_works') => {
    setListLoading(true);
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExistingItems(data || []);
    } catch (err: any) {
      console.error("Error fetching admin list:", err.message);
    } finally {
      setListLoading(false);
    }
  };

  const refreshActiveTable = () => {
    if (activeManageTable === 'custom_orders') {
      fetchCustomOrders();
    } else {
      fetchExistingItems(activeManageTable);
    }
  };

  useEffect(() => {
    refreshActiveTable();
  }, [activeManageTable]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const duplicatesFound: string[] = [];

      setLoading(true); 

      try {
        const targetTable = getTargetTable(section);
        
        for (const file of selectedFiles) {
          let query = supabase
            .from(targetTable)
            .select('image_url')
            .eq('category', category);

          if (targetTable === 'products') {
            query = query.eq('section', section);
          }

          const { data, error } = await query;
          if (error) throw error;

          const fileExists = data?.some((item) => 
            item.image_url && item.image_url.toLowerCase().includes(file.name.toLowerCase())
          );

          if (fileExists) {
            duplicatesFound.push(file.name);
          }
        }

        if (duplicatesFound.length > 0) {
          setDuplicateFiles(duplicatesFound);
          setShowOverridePrompt(true);
        }

        setImageFiles(selectedFiles);
      } catch (err: any) {
        setStatus({ 
          type: 'error', 
          title: 'Error checking duplicates', 
          details: err.message 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDetailFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newItems: PendingGalleryItem[] = selectedFiles.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
        price: "" 
      }));
      setDetailItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleDetailPriceChange = (index: number, val: string) => {
    setDetailItems((prev) => {
      const updated = [...prev];
      updated[index].price = val;
      return updated;
    });
  };

  const removeDetailItem = (index: number) => {
    setDetailItems((prev) => {
      if (prev[index].file) {
        URL.revokeObjectURL(prev[index].previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Enable Edit Mode on a specific item
  const handleEditInit = (item: LoadedItem) => {
    setEditingId(item.id);
    if (activeManageTable !== 'custom_orders') {
      setEditingSourceTable(activeManageTable);
    }
    
    const determinedSection = item.section || (activeManageTable === 'previous_works' ? 'previous_works' : 'new_products');
    setSection(determinedSection);
    setCategory(item.category);
    setTitleEn(item.title_en || '');
    setTitleAm(item.title_am || '');
    setPriceEn(item.price_en || '');
    setPriceAm(item.price_am || '');
    setMaterialEn(item.material_en || '');
    setMaterialAm(item.material_am || '');
    setDescEn(item.desc_en || '');
    setDescAm(item.desc_am || '');
    setColorHex(item.color_hex || '#ffffff');
    
    setExistingImageUrl(item.image_url);
    setImageFiles([]); 

    if (item.detail_images && Array.isArray(item.detail_images)) {
      const formattedDetails: PendingGalleryItem[] = item.detail_images.map((img: any) => {
        if (typeof img === 'string') {
          return { previewUrl: img, price: "" };
        }
        return { previewUrl: img.url || '', price: img.price || '' };
      });
      setDetailItems(formattedDetails);
    } else {
      setDetailItems([]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exit edit mode safely
  const cancelEditMode = () => {
    setEditingId(null);
    setEditingSourceTable(null);
    setTitleEn('');
    setTitleAm('');
    setPriceEn('');
    setPriceAm('');
    setMaterialEn('');
    setMaterialAm('');
    setDescEn('');
    setDescAm('');
    setImageFiles([]);
    setExistingImageUrl('');
    detailItems.forEach(item => item.file && URL.revokeObjectURL(item.previewUrl));
    setDetailItems([]);
  };

  // Delete product logic
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to delete this item permanently?")) return;

    setLoading(true);
    try {
      const targetTable = activeManageTable;
      const parsedId = isNaN(Number(id)) ? id : Number(id);

      const { error } = await supabase
        .from(targetTable)
        .delete()
        .eq('id', parsedId);

      if (error) throw error;

      setStatus({
        type: 'success',
        title: 'Delete Successful',
        details: 'The item was deleted cleanly from the database.'
      });

      refreshActiveTable();
    } catch (err: any) {
      setStatus({ type: 'error', title: 'Deletion Failed', details: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, overrideConfirmed = false) => {
    e.preventDefault();
    
    if (showOverridePrompt && !overrideConfirmed) {
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const targetTable = getTargetTable(section);
      const storageBucket = 'products'; 

      if (imageFiles.length === 0 && !existingImageUrl) {
        throw new Error('Please select at least one main showcase image.');
      }

      // 1. Process and upload gallery detail images
      const uploadedDetailImages: { url: string; price: string }[] = [];
      if (detailItems.length > 0) {
        for (const item of detailItems) {
          if (item.file) {
            const detailPath = `product-details/${Date.now()}-${item.file.name}`;
            const { error: uploadErr } = await supabase.storage
              .from(storageBucket)
              .upload(detailPath, item.file, { upsert: true });

            if (uploadErr) throw uploadErr;

            const { data: { publicUrl } } = supabase.storage
              .from(storageBucket)
              .getPublicUrl(detailPath);

            uploadedDetailImages.push({
              url: publicUrl,
              price: item.price.trim() 
            });
          } else {
            uploadedDetailImages.push({
              url: item.previewUrl,
              price: item.price.trim()
            });
          }
        }
      }

      // 2. Process main showcase image
      let finalImageUrl = existingImageUrl;
      if (imageFiles.length > 0) {
        const file = imageFiles[0];
        const filePath = `product-images/${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from(storageBucket)
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(storageBucket)
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 3. Assemble write schema dynamically based on target database
      const itemPayload: any = {
        title_en: titleEn || null,
        title_am: titleAm || null,
        category: category,
        price_en: priceEn || null,
        price_am: priceAm || null,
        material_en: materialEn || null,
        material_am: materialAm || null,
        desc_en: descEn || null,
        desc_am: descAm || null,
        image_url: finalImageUrl,
        detail_images: uploadedDetailImages,
      };

      if (targetTable === 'products') {
        itemPayload.section = section;
        itemPayload.color_hex = colorHex;
      }

      if (editingId) {
        const parsedEditingId = isNaN(Number(editingId)) ? editingId : Number(editingId);

        if (editingSourceTable && editingSourceTable !== targetTable) {
          await supabase.from(editingSourceTable).delete().eq('id', parsedEditingId);
          const { error: insertError } = await supabase.from(targetTable).insert([itemPayload]);
          if (insertError) throw insertError;
        } else {
          const { error: dbError } = await supabase
            .from(targetTable)
            .update(itemPayload)
            .eq('id', parsedEditingId);

          if (dbError) throw dbError;
        }

        setStatus({ 
          type: 'success', 
          title: 'Update Completed Successfully',
          details: `Updated entry matches ID: ${editingId}`
        });
        setEditingId(null);
        setEditingSourceTable(null);
      } else {
        const { error: dbError } = await supabase
          .from(targetTable)
          .insert([itemPayload]);

        if (dbError) throw dbError;

        setStatus({ 
          type: 'success', 
          title: 'Upload Completed Successfully',
          details: `Saved new item successfully to table ${targetTable}.`
        });
      }
      
      // Clean form states
      setTitleEn('');
      setTitleAm('');
      setPriceEn('');
      setPriceAm('');
      setMaterialEn('');
      setMaterialAm('');
      setDescEn('');
      setDescAm('');
      setImageFiles([]);
      setExistingImageUrl('');
      
      detailItems.forEach(item => item.file && URL.revokeObjectURL(item.previewUrl));
      setDetailItems([]);
      
      setShowOverridePrompt(false);
      setDuplicateFiles([]);

      refreshActiveTable();

    } catch (err: any) {
      setStatus({ type: 'error', title: 'Operation Failed', details: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8 text-zinc-900 font-sans selection:bg-zinc-200">
      
      {/* Status Banners */}
      {status && (
         <div className="max-w-2xl mx-auto mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
           <div className={`p-5 rounded-2xl shadow-lg flex items-start justify-between border ${
             status.type === 'success' 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 shadow-emerald-900/5' 
              : 'bg-rose-50/80 border-rose-200 text-rose-900 shadow-rose-900/5'
           }`}>
             <div className="flex gap-3">
               {status.type === 'success' ? <CheckCircle2 className="text-emerald-500 mt-0.5" /> : <AlertTriangle className="text-rose-500 mt-0.5" />}
               <div>
                 <h3 className="font-bold text-sm">{status.title}</h3>
                 <p className="text-xs opacity-80 mt-1 font-medium">{status.details}</p>
               </div>
             </div>
             <button onClick={() => setStatus(null)} className="text-current opacity-50 hover:opacity-100 transition-opacity p-1">
               <X size={18} />
             </button>
           </div>
         </div>
      )}

      {/* Override Prompt Alert Dialog */}
      {showOverridePrompt && (
        <div className="max-w-2xl mx-auto mb-8 bg-amber-50/90 backdrop-blur-sm border border-amber-200 text-amber-900 p-6 rounded-2xl shadow-xl shadow-amber-900/5 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex gap-4">
            <div className="p-2 bg-amber-100 rounded-full h-fit">
              <AlertTriangle className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base">Duplicate Files Detected</h3>
              <p className="text-sm mt-1 text-amber-800">
                The following files already exist in this category. Overriding will replace the existing images.
              </p>
              <ul className="list-disc pl-5 mt-3 text-xs font-mono space-y-1 bg-amber-100/50 p-3 rounded-xl border border-amber-200/50">
                {duplicateFiles.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button 
              type="button" 
              onClick={() => { setImageFiles([]); setShowOverridePrompt(false); }} 
              className="bg-white border border-amber-200 text-amber-900 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-100/50 transition-colors"
            >
              Cancel Upload
            </button>
            <button 
              type="button" 
              onClick={(e) => handleSubmit(e, true)} 
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98]"
            >
              Override & Save
            </button>
          </div>
        </div>
      )}

      {/* Upload UI Box */}
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 overflow-hidden">
        {/* Sleek Dark Header */}
        <div className="px-8 py-8 bg-zinc-950 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-950 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight">
              {editingId ? "Edit Product Listing" : "Product Uploader"}
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5 font-medium">
              {editingId ? `Modifying database entry ID: ${editingId}` : "Add new arrivals and custom collections to the catalog"}
            </p>
          </div>
          <div className="relative z-10 p-3 bg-zinc-800/50 rounded-2xl backdrop-blur-md border border-zinc-700/50">
            <Globe size={24} className="text-zinc-300" />
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="p-8 sm:p-10 space-y-8">
          
          {/* Main Language Tabs - Refined */}
          <div className="flex gap-8 border-b border-zinc-100 pb-px">
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'en' ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              English
              {activeTab === 'en' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-950 rounded-t-full animate-in fade-in zoom-in-75" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('am')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'am' ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Amharic
              {activeTab === 'am' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-950 rounded-t-full animate-in fade-in zoom-in-75" />}
            </button>
          </div>

          {/* Dynamic Multilang Inputs - Polished Forms */}
          <div className="space-y-5 animate-in fade-in duration-300">
            {activeTab === 'en' ? (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Product Title</label>
                  <input required type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400" placeholder="e.g. Luxury Velvet Sofa" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Price / Range</label>
                    <input type="text" value={priceEn} onChange={(e) => setPriceEn(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400" placeholder="e.g. 150,000 ETB" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Material Specification</label>
                    <input type="text" value={materialEn} onChange={(e) => setMaterialEn(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400" placeholder="e.g. Oak wood & Velvet textile" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Product Description</label>
                  <textarea rows={4} value={descEn} onChange={(e) => setDescEn(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none placeholder:text-zinc-400" placeholder="Enter detailed product specifications..."></textarea>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">የምርት ስም (Title)</label>
                  <input required type="text" value={titleAm} onChange={(e) => setTitleAm(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400 font-medium" placeholder="ለምሳሌ፡ የቅንጦት ቬልቬት ሶፋ" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">ዋጋ (Price)</label>
                    <input type="text" value={priceAm} onChange={(e) => setPriceAm(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400 font-medium" placeholder="ለምሳሌ፡ 150,000 ብር" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">ጥሬ ዕቃ / ማቴሪያል (Material)</label>
                    <input type="text" value={materialAm} onChange={(e) => setMaterialAm(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400 font-medium" placeholder="ለምሳሌ፡ የኦክ እንጨት እና ቬልቬት ጨርቅ" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">መግለጫ (Description)</label>
                  <textarea rows={4} value={descAm} onChange={(e) => setDescAm(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none placeholder:text-zinc-400 font-medium" placeholder="ስለ ምርቱ ዝርዝር መረጃ እዚህ ያስገቡ..."></textarea>
                </div>
              </>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all appearance-none font-medium text-zinc-700">
                  <option value="living_room">Living Room</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="office">Office</option>
                  <option value="dining">Dining</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Display Section</label>
              <div className="relative">
                <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all appearance-none font-medium text-zinc-700">
                  <option value="new_products">New Products</option>
                  <option value="previous_works">Previous Works</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Color configuration picker */}
          {section !== 'previous_works' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Brand Accent Color</label>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-zinc-200 shadow-sm flex-shrink-0 cursor-pointer hover:border-zinc-400 transition-colors">
                  <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="absolute -inset-2 w-20 h-20 cursor-pointer" />
                </div>
                <input type="text" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="px-5 py-3.5 text-sm border border-zinc-200 bg-zinc-50/50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 w-32 font-mono uppercase tracking-wider transition-all" />
              </div>
            </div>
          )}

          <hr className="border-zinc-100" />

          {/* File Upload Zone - Main Image */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Main Showcase Image <span className="text-rose-500">*</span></label>
            <div className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-300 text-center relative group flex flex-col items-center justify-center min-h-[160px]">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="bg-white p-4 rounded-full shadow-sm border border-zinc-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 mb-4 text-zinc-400 group-hover:text-zinc-900">
                <Upload size={24} />
              </div>
              <p className="text-sm font-semibold text-zinc-700">Click to upload main image</p>
              <p className="text-xs text-zinc-400 mt-1">High quality WEBP, PNG, or JPG</p>
              
              {imageFiles.length > 0 && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center pointer-events-none border border-emerald-100">
                  <CheckCircle2 className="text-emerald-500 mb-2" size={28} />
                  <p className="text-sm font-bold text-emerald-700">{imageFiles[0].name}</p>
                </div>
              )}
              {editingId && existingImageUrl && imageFiles.length === 0 && (
                <div className="absolute inset-0 bg-white/95 rounded-[2rem] flex items-center justify-center gap-4 pointer-events-none p-4">
                  <img src={existingImageUrl} className="h-full w-auto max-w-[50%] object-contain rounded-xl shadow-sm border border-zinc-100" alt="Current" />
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 block mb-1">Current Image</span>
                    <span className="text-xs font-medium text-zinc-600 block">Upload a new file to replace</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive File Upload Zone - Detail Images */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Gallery Views & Angles <span className="normal-case font-normal text-zinc-400">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-6 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-300 text-center relative group">
              <input type="file" multiple accept="image/*" onChange={handleDetailFilesChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                 <Image className="text-zinc-300 mb-3 group-hover:text-zinc-600 transition-colors" size={28} />
                 <p className="text-sm font-semibold text-zinc-700">Add secondary angles</p>
              </div>
            </div>

            {/* Dynamic Interactive List of Selected Gallery Images */}
            {detailItems.length > 0 && (
              <div className="space-y-3 mt-4">
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider pl-1">Gallery Items Configuration:</p>
                {detailItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 pr-4 rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/5 items-center animate-in slide-in-from-bottom-2 duration-300">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200/50">
                      <img src={item.previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow flex flex-col gap-1.5 min-w-0">
                      <span className="text-[11px] font-semibold text-zinc-600 truncate">
                        {item.file ? item.file.name : "Existing Detail Image"}
                      </span>
                      <input
                        type="text"
                        placeholder="Price variant (e.g. 135,000 ETB)"
                        value={item.price}
                        onChange={(e) => handleDetailPriceChange(idx, e.target.value)}
                        className="w-full text-xs font-medium px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeDetailItem(idx)}
                      className="flex-shrink-0 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 p-2.5 rounded-xl transition-all self-center"
                      title="Remove image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex gap-4 pt-4">
            {editingId && (
              <button
                type="button"
                onClick={cancelEditMode}
                className="flex-1 bg-white border-2 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:shadow-none text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>                  
              ) : (
                editingId ? 'Save Changes' : 'Upload Product'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ================= CRUD PANEL PANEL AT BOTTOM ================= */}
      <div className="max-w-5xl mx-auto mt-20 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 overflow-hidden mb-20">
        
        {/* Panel Header */}
        <div className="px-8 py-8 bg-zinc-950 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-950 pointer-events-none" />
           <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight">Database Management</h2>
            <p className="text-sm text-zinc-400 mt-1.5 font-medium">Review, edit, and manage all catalog entries and custom orders</p>
          </div>
          
          {/* Table Switcher - Pill Design */}
          <div className="relative z-10 flex bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-700/50 backdrop-blur-md w-full md:w-auto overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveManageTable('products')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeManageTable === 'products' ? 'bg-white text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => setActiveManageTable('previous_works')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeManageTable === 'previous_works' ? 'bg-white text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Previous Works
            </button>
            <button
              type="button"
              onClick={() => setActiveManageTable('custom_orders')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${
                activeManageTable === 'custom_orders' ? 'bg-white text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Orders
              {customOrders.some(o => !o.is_seen) && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </button>
          </div>
        </div>

       <div className="p-8 bg-zinc-50/30">
          {listLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
              <Loader2 className="animate-spin text-zinc-900" size={40} />
              <p className="text-sm font-medium tracking-wide">Syncing records...</p>
            </div>
          ) : activeManageTable === 'custom_orders' ? (
            // ================= INCOMING CUSTOM BESPOKE ORDERS VIEW WORKSPACE =================
            customOrders.length === 0 ? (
              <div className="text-center py-24 text-zinc-400">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200">
                  <PlusCircle className="text-zinc-300" size={32} />
                </div>
                <p className="text-base font-semibold text-zinc-600">No bespoke entries found</p>
                <p className="text-sm mt-1">New client requests will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {customOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className={`group p-6 rounded-3xl border transition-all duration-300 relative flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between ${
                      !order.is_seen 
                        ? 'bg-rose-50/50 border-rose-200 shadow-[0_8px_30px_rgb(225,29,72,0.08)] ring-1 ring-rose-200/50' 
                        : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5'
                    }`}
                  >
                    {!order.is_seen && (
                      <div className="absolute -top-3 -right-3 flex items-center gap-1.5 bg-rose-500 px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/20 z-10 animate-bounce">
                        <span className="text-[10px] font-bold uppercase text-white tracking-widest">New Lead</span>
                      </div>
                    )}

                    <div className="flex gap-5 items-center w-full lg:w-auto">
                      <div className="w-24 h-24 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200/80 flex-shrink-0 flex items-center justify-center shadow-sm">
                        {order.image_url ? (
                          <img src={order.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Ref" />
                        ) : (
                          <ImageIcon size={28} className="text-zinc-300" />
                        )}
                      </div>
                      
                      <div className="space-y-1.5 min-w-0">
                        <span className="text-[10px] font-bold uppercase bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md tracking-wider border border-zinc-200 inline-block">
                          {order.reference_type === 'catalog' ? `Catalog: ${order.catalog_source}` : order.reference_type === 'upload' ? 'External Upload' : 'No Photo Provided'}
                        </span>
                        <h4 className="text-lg font-bold text-zinc-900 truncate">{order.full_name}</h4>
                        <p className="text-sm font-mono font-bold text-zinc-500">{order.phone_number}</p>
                        <p className="text-xs text-zinc-500 font-medium max-w-md line-clamp-2 mt-1 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                          <span className="text-zinc-700 font-semibold mr-1">Specs:</span> {order.specifications || 'None provided'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs bg-zinc-50/80 p-4 rounded-2xl border border-zinc-100 w-full lg:w-auto font-medium text-zinc-700 min-w-[200px]">
                      <div className="flex flex-col"><span className="text-[10px] uppercase text-zinc-400 font-bold mb-0.5">Space</span> {order.room_type || '—'}</div>
                      <div className="flex flex-col"><span className="text-[10px] uppercase text-zinc-400 font-bold mb-0.5">Type</span> {order.item_category || '—'}</div>
                      <div className="flex flex-col"><span className="text-[10px] uppercase text-zinc-400 font-bold mb-0.5">Color</span> {order.preferred_color || '—'}</div>
                      <div className="flex flex-col"><span className="text-[10px] uppercase text-zinc-400 font-bold mb-0.5">Material</span> {order.material || '—'}</div>
                    </div>

                    <div className="flex gap-3 self-end lg:self-center w-full lg:w-auto justify-end mt-4 lg:mt-0">
                      <button
                        onClick={() => toggleOrderSeen(order.id, order.is_seen)}
                        className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                          order.is_seen 
                            ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900' 
                            : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-95'
                        }`}
                      >
                        {order.is_seen ? 'Mark Unread' : 'Acknowledge'}
                      </button>
                      <button
                        onClick={() => handleDeleteCustomOrder(order.id)}
                        className="p-3 rounded-2xl bg-white text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 transition-all shadow-sm active:scale-95"
                        title="Delete Request"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // ================= STANDARD DATABASE CATALOG MANAGE GRID =================
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {existingItems.map((item) => (
                <div key={item.id} className="group flex gap-5 p-5 rounded-3xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5 transition-all duration-300 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-100 shadow-inner">
                    <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-grow min-w-0 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1 inline-block">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 truncate">{item.title_en || "Untitled Item"}</h4>
                    <p className="text-xs text-zinc-500 font-medium truncate mt-0.5">{item.material_en || 'Standard Materials'}</p>
                    <p className="text-sm font-semibold text-zinc-900 mt-2">{item.price_en || 'Price TBA'}</p>
                  </div>

                  <div className="flex flex-col gap-2 pl-2 border-l border-zinc-100">
                    <button
                      onClick={() => handleEditInit(item)}
                      className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-900 hover:border-zinc-900 hover:text-white text-zinc-600 transition-all"
                      title="Edit Item"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-rose-500 hover:border-rose-500 hover:text-white text-zinc-400 transition-all"
                      title="Delete Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
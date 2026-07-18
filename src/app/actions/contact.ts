"use server";

import { supabase } from "@/lib/supabase";

// 100% Free email wrapper if you decide to add email alerts later

export interface FormResponse {
  success: boolean;
  error: string | null;
}

export async function submitContactForm(formData: FormData): Promise<FormResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const reason = formData.get("reason") as string;
  const message = formData.get("message") as string;

  // Validation fallback
  if (!name || !email || !message) {
    return { success: false, error: "Please fill out all required fields." };
  }

  try {
    // 1. Direct write to your free Supabase Table
    const { error: dbError } = await supabase
      .from("contact_inquiries")
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          reason: reason.trim() || "General Inquiry",
          message: message.trim(),
        }
      ]);

    if (dbError) throw dbError;

    // Everything went great!
    return { success: true, error: null };

  } catch (err: any) {
    console.error("Supabase submit failure:", err);
    return { 
      success: false, 
      error: err.message || "Failed to submit to Supabase. Please check your network connection." 
    };
  }
}
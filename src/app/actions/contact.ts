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

    // 2. Direct email notification alert (Runs for free if API key is in .env)
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Beba Website <onboarding@resend.dev>',
        to: 'info@alphafurniture.net',
        subject: `🛋️ New Custom Request: ${reason || "General Inquiry"}`,
        html: `
          <div style="font-family: sans-serif; color: #171717; max-width: 600px;">
            <h2 style="font-family: serif; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px;">New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p style="margin-top: 20px; color: #737373;"><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 16px; rounded: 12px;">${message}</p>
          </div>
        `
      });
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error("Supabase submit failure:", err);
    return { success: false, error: err.message || "Failed to submit to Supabase. Please check your network connection." };
  }
}
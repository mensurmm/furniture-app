"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;
      
      if (data?.session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#FDFDFD]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        
        {/* Branding Header */}
        <div className="px-8 pt-10 pb-8 bg-zinc-950 text-white text-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
              <Lock size={20} className="text-zinc-200" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-sans">BEBA Furniture</h2>
            <p className="text-xs text-zinc-400 mt-1.5 font-medium uppercase tracking-wider">Management Console</p>
          </div>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleSignIn} className="p-8 sm:p-10 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50/80 border border-rose-100 text-rose-600 text-xs font-medium rounded-2xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Authorized Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Mail size={16} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-5 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/30 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
                  placeholder="name@bebafurniture.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Security Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Lock size={16} />
                </div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 rounded-2xl border border-zinc-200 bg-zinc-50/30 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white py-4 rounded-2xl text-sm font-bold tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-zinc-950/10"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Verify Identity"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
"use client"

import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEndIcon } from "lucide-react"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2.5 font-bold font-fredoka text-lg">
            <img src="/credinorte.png" alt="CreditNorte Logo" className="size-8 object-contain" />
            CreditNorte
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-zinc-950 lg:flex flex-col items-center justify-center p-12 text-white overflow-hidden">
        {/* Glowing background gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-emerald-950 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        
        {/* Stylized Quote Panel */}
        <div className="relative z-10 max-w-lg w-full text-center space-y-8 px-6">
          <div className="flex justify-center mb-6">
            <img 
              src="/credinorte.png" 
              alt="CreditNorte Logo" 
              className="w-16 h-16 object-contain opacity-90 drop-shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
            />
          </div>

          <blockquote className="space-y-4">
            <p className="text-3xl lg:text-4xl font-extrabold font-fredoka leading-tight tracking-wide text-white drop-shadow-sm">
              “Con CrediNorte vivimos la pasión del fútbol”
            </p>
            <cite className="block text-xs text-indigo-400 font-mono tracking-[0.2em] uppercase font-bold not-italic pt-4">
              — Tecnología & Deporte
            </cite>
          </blockquote>

          <div className="pt-8 flex justify-center gap-2 text-xs text-slate-500 font-mono">
            <span>v1.0.0</span>
            <span>•</span>
            <span>Secure SSL</span>
          </div>
        </div>
      </div>
    </div>
  )
}

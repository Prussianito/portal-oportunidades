import React, { useState } from "react";
import { ExternalLink, Sparkles, AlertCircle, X } from "lucide-react";

import { AdBanner } from "../types";

interface AdPlacementProps {
  type: "horizontal" | "card" | "sidebar";
  id?: string;
  className?: string;
  banners?: AdBanner[];
}

export const DEFAULT_BANNERS: AdBanner[] = [
  {
    id: "ad-1",
    title: "Aprende Inglés Gratis con Duolingo for Schools",
    description: "Únete a la plataforma educativa número uno del mundo. Certificaciones de nivel y recursos exclusivos para estudiantes y docentes de todo Chile.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&fit=crop&q=80",
    ctaText: "Comenzar Gratis",
    ctaUrl: "https://duolingo.com",
    sponsorName: "Duolingo Chile",
    tags: ["Educación", "Idiomas"],
    type: "horizontal",
    active: true
  },
  {
    id: "ad-2",
    title: "Beca de Programación 2026 • Platzi & Corfo",
    description: "Postula a una de las 10,000 becas completas de especialización en Inteligencia Artificial, Desarrollo Web y Ciencia de Datos. Cupos limitados para chilenos.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&fit=crop&q=80",
    ctaText: "Postular Aquí",
    ctaUrl: "https://platzi.com",
    sponsorName: "Platzi + Corfo",
    tags: ["Tecnología", "Becas"],
    type: "horizontal",
    active: true
  },
  {
    id: "ad-3",
    title: "Sé parte de la Hackathon Nacional de Robótica",
    description: "Inscribe a tu club o establecimiento educacional y compite por financiamiento para tus proyectos de hardware. Evento presencial en Santiago de Chile.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&fit=crop&q=80",
    ctaText: "Ver Bases",
    ctaUrl: "https://example.com",
    sponsorName: "Mineduc + TechChile",
    tags: ["Robótica", "Innovación"],
    type: "card",
    active: true
  },
  {
    id: "ad-4",
    title: "Soporte y Orientación Vocacional Personalizada",
    description: "Agenda una sesión de 30 minutos sin costo con un mentor acreditado para elegir tu beca ideal.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&fit=crop&q=80",
    ctaText: "Agendar Sesión",
    ctaUrl: "https://calendly.com",
    sponsorName: "Portal Futuro",
    tags: ["Orientación"],
    type: "sidebar",
    active: true
  }
];

export default function AdPlacement({ type, id, className = "", banners }: AdPlacementProps) {
  const [isClosed, setIsClosed] = useState(false);
  const currentBanners = banners || DEFAULT_BANNERS;
  
  // Filter active banners matching the specific type
  const matchingTypeBanners = currentBanners.filter(b => b.active && b.type === type);
  // Fallback to any active banner if no match for type
  const finalBanners = matchingTypeBanners.length > 0 
    ? matchingTypeBanners 
    : currentBanners.filter(b => b.active);

  if (isClosed || finalBanners.length === 0) return null;

  // Select ad based on id hash, or random
  const index = id 
    ? (id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % finalBanners.length) 
    : Math.floor(Math.random() * finalBanners.length);
  const ad = finalBanners[index];


  // HORIZONTAL BANNER AD (Between homepage sections)
  if (type === "horizontal") {
    return (
      <div 
        id={id}
        className={`w-full bg-linear-to-r from-slate-900 to-blue-950 text-white rounded-3xl overflow-hidden border border-blue-900/30 dark:border-blue-800/40 shadow-lg relative flex flex-col md:flex-row items-center p-6 md:p-8 gap-6 animate-in fade-in duration-300 ${className}`}
      >
        {/* Floating Sponsored Label */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-widest z-10">
          <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
          <span>Patrocinado</span>
        </div>

        {/* Ad Image */}
        <div className="w-full md:w-1/3 h-40 rounded-2xl overflow-hidden shrink-0 relative bg-slate-950">
          <img 
            src={ad.image} 
            alt={ad.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90 hover:scale-103 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
            Anuncio
          </span>
        </div>

        {/* Ad Copy */}
        <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              {ad.sponsorName}
            </span>
            <h3 className="font-display font-black text-lg md:text-xl text-white tracking-tight leading-snug">
              {ad.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {ad.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={ad.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{ad.ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            
            <button 
              onClick={() => setIsClosed(true)}
              className="text-[10px] text-slate-400 hover:text-slate-300 underline underline-offset-2 cursor-pointer"
            >
              Ocultar anuncio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CARD AD (Fits into bento grids or regular columns)
  if (type === "card") {
    return (
      <div 
        id={id}
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-orange-200/60 dark:border-orange-900/30 overflow-hidden flex flex-col group shadow-xs hover:shadow-lg transition-all duration-300 relative ${className}`}
      >
        {/* Floating Sponsored Label */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest z-10">
          <Sparkles className="w-2.5 h-2.5 text-orange-400" />
          <span>Patrocinado</span>
        </div>

        <div className="h-44 relative overflow-hidden bg-slate-950">
          <img 
            src={ad.image} 
            alt={ad.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {ad.tags?.map(tag => (
              <span key={tag} className="bg-slate-900/90 text-orange-400 border border-orange-500/20 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
          <div className="space-y-1.5 text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
              {ad.sponsorName}
            </span>
            <h3 className="font-display font-black text-sm text-slate-800 dark:text-white leading-snug line-clamp-2">
              {ad.title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {ad.description}
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Colaborador</span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Oficial</span>
            </div>
            
            <a 
              href={ad.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{ad.ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // SIDEBAR AD (Compact, sits inside modal sidebar, or card detail)
  return (
    <div 
      id={id}
      className={`bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 border border-blue-100 dark:border-blue-950/50 space-y-3 relative ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-slate-400">
          <AlertCircle className="w-3 h-3 text-blue-500" />
          <span className="text-[8px] font-black uppercase tracking-widest">Enlace Patrocinado</span>
        </div>
        <button 
          onClick={() => setIsClosed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-3 items-start text-left">
        <img 
          src={ad.image} 
          alt={ad.title} 
          referrerPolicy="no-referrer"
          className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0" 
        />
        <div className="space-y-0.5 min-w-0">
          <span className="text-[8px] font-black uppercase tracking-widest text-blue-500 block">
            {ad.sponsorName}
          </span>
          <h4 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-2 leading-snug">
            {ad.title}
          </h4>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2 text-left">
        {ad.description}
      </p>

      <a 
        href={ad.ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
      >
        {ad.ctaText}
      </a>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Users, GraduationCap, BookOpen } from "lucide-react";
import { CATEGORIES, REGIONS_AND_COMUNAS, TARGET_AUDIENCES } from "../data";

interface BannerProps {
  onCategoryToggle: (category: string) => void;
  selectedCategories: string[];
  onRegionChange: (region: string) => void;
  selectedRegion: string;
  onAudienceChange: (audience: string) => void;
  selectedAudience: string;
  onCategorySelectOnly: (category: string) => void;
}

export default function Banner({
  onCategoryToggle,
  selectedCategories,
  onRegionChange,
  selectedRegion,
  onAudienceChange,
  selectedAudience,
  onCategorySelectOnly
}: BannerProps) {
  return (
    <div 
      id="banner-hero-container" 
      className="relative bg-gradient-to-br from-[#F4F3EF]/90 via-[#F7F9FA]/80 to-white/70 backdrop-blur-md text-slate-900 overflow-hidden rounded-[2.5rem] mx-auto max-w-7xl border border-slate-200/60 shadow-xl flex flex-col space-y-4 pb-6 transition-all"
    >
      {/* Soft floating organic blobs background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#E2B13C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C87A53]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section Container (Left Text, Right Organic-Masked Image) */}
      <div className="relative z-10 px-8 pt-8 sm:pt-10 flex flex-col md:flex-row items-center gap-8 justify-between">
        
        {/* Left Side Content */}
        <div className="text-left space-y-4 max-w-xl md:w-3/5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2B13C]/10 text-[#C87A53] text-[10px] font-black uppercase tracking-wider">
            📚 Explora Convocatorias Nacionales
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight text-[#1E293B] leading-tight">
            Descubre y Postula a <span className="text-[#C87A53] font-serif italic">Oportunidades</span> Escolares
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Participa de olimpiadas científicas, torneos deportivos, becas de estudio y talleres interactivos. Conéctate con instituciones académicas verificadas y potencia tu aprendizaje.
          </p>
        </div>

        {/* Right Side Image with Organic Asymmetric Blob Mask */}
        <div className="hidden md:block md:w-2/5 relative">
          {/* Subtle background glow shadow for image */}
          <div className="absolute inset-0 bg-[#C87A53]/10 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] blur-xl transform scale-105" />
          <img 
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&fit=crop&q=80" 
            alt="Estudiantes en el laboratorio" 
            className="w-full h-56 object-cover rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] shadow-lg border border-[#C87A53]/20 animate-in zoom-in-95 duration-700 hover:scale-102 hover:rotate-1 transition-all"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="relative z-20 px-6 max-w-4xl mx-auto w-full space-y-4">
        
        {/* Central Filters Bar */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-800 text-slate-800 dark:text-white w-full space-y-3">
          <h2 className="text-left font-display font-medium text-xs uppercase tracking-wider text-[#1E293B] dark:text-white flex items-center justify-start gap-2">
            <span className="w-1.5 h-3.5 rounded-full bg-[#E2B13C]" />
            Buscador de Convocatorias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Region Selector */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#C87A53] pointer-events-none z-10" />
              <select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F7F9FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-hidden text-slate-800 dark:text-slate-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231E293B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat font-medium cursor-pointer"
              >
                <option value="">🗺️ Toda Región</option>
                {Object.keys(REGIONS_AND_COMUNAS).map((reg) => (
                  <option key={reg} value={reg}>{reg.replace("Región de ", "").replace("Región Metropolitana de ", "R.M. ")}</option>
                ))}
              </select>
            </div>

            {/* Area Selector (Area/Categoria) */}
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-[#C87A53] pointer-events-none z-10" />
              <select
                value={selectedCategories.length === 1 ? selectedCategories[0] : ""}
                onChange={(e) => onCategorySelectOnly(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F7F9FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-hidden text-slate-800 dark:text-slate-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231E293B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat font-medium cursor-pointer"
              >
                <option value="">🎓 Área / Categoría</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Target Audience Selector (Público Objetivo) */}
            <div className="relative">
              <Users className="absolute left-3 top-3 w-4 h-4 text-[#C87A53] pointer-events-none z-10" />
              <select
                value={selectedAudience}
                onChange={(e) => onAudienceChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F7F9FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-hidden text-slate-800 dark:text-slate-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231E293B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat font-medium cursor-pointer"
              >
                <option value="">👥 Público Objetivo</option>
                {TARGET_AUDIENCES.map((aud) => (
                  <option key={aud} value={aud}>{aud}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

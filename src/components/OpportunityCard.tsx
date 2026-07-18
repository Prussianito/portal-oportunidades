/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Opportunity, CostType } from "../types";
import { MapPin, Calendar, CheckCircle2, Bookmark, Star, ArrowRight } from "lucide-react";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isFavorited: boolean;
  onFavoriteToggle: (id: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  onViewProfile?: (id: string, type: "user" | "institution") => void;
  key?: string;
  mini?: boolean;
}

export default function OpportunityCard({
  opportunity,
  isFavorited,
  onFavoriteToggle,
  onViewDetails,
  onViewProfile,
  mini = false
}: OpportunityCardProps) {
  
  // Quick helper to format dates nicely in Spanish
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${day} ${months[monthIndex]} ${year}`;
  };

  const isClosingSoon = () => {
    const deadline = new Date(opportunity.applicationDeadline);
    const today = new Date("2026-06-27"); // Simulated today as given in metadata
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  if (mini) {
    return (
      <div 
        id={`opportunity-card-${opportunity.id}`}
        onClick={() => onViewDetails(opportunity)}
        className="group flex-none w-[210px] sm:w-[235px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col h-[320px] cursor-pointer"
      >
        {/* Card Header Media */}
        <div className="relative h-28 w-full overflow-hidden bg-slate-50 dark:bg-slate-950 shrink-0">
          <img
            src={opportunity.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop&q=80"}
            alt={opportunity.title}
            className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40" />

          {/* Floating Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
            {isClosingSoon() ? (
              <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-[#C87A53]/95 text-white uppercase tracking-wider">
                Urgente ⏳
              </span>
            ) : (
              <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-[#E2B13C]/95 text-white uppercase tracking-wider">
                Abierto
              </span>
            )}
          </div>

          {/* Save/Favorite Button */}
          <button
            id={`fav-btn-mini-${opportunity.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(opportunity.id);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-700 dark:text-amber-400 hover:text-[#C87A53] hover:bg-white transition-all z-10 hover:scale-110 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Agregar a Favoritos"
          >
            <Star className={`w-3 h-3 ${isFavorited ? "fill-[#E2B13C] text-[#E2B13C]" : "text-slate-500 dark:text-slate-400"}`} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-3.5 flex flex-col flex-1 justify-between min-h-0 space-y-1">
          <div className="space-y-1.5 min-h-0">
            {/* Organizer and Verification State */}
            <div 
              onClick={(e) => {
                if (onViewProfile) {
                  e.stopPropagation();
                  onViewProfile(opportunity.institutionId, "institution");
                }
              }}
              className={`flex items-center gap-1 text-[9px] font-bold text-slate-500 dark:text-slate-400 ${
                onViewProfile ? "hover:text-[#C87A53] cursor-pointer" : ""
              }`}
            >
              {opportunity.institutionLogo && (
                <img 
                  src={opportunity.institutionLogo} 
                  alt={opportunity.institutionName} 
                  className="w-4.5 h-4.5 rounded-full object-cover border border-slate-100" 
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="truncate max-w-[120px]">{opportunity.institutionName}</span>
              {opportunity.isInstitutionVerified && (
                <span className="inline-flex items-center text-[#E2B13C]">
                  <CheckCircle2 className="w-3 h-3 fill-[#E2B13C]/10 text-[#E2B13C]" />
                </span>
              )}
            </div>

            {/* Opportunity Title */}
            <h3 className="font-display font-medium text-xs text-slate-800 dark:text-slate-100 line-clamp-2 tracking-tight leading-snug group-hover:text-[#C87A53] transition-colors h-7.5">
              {opportunity.title}
            </h3>

            {/* Location & Address */}
            <div className="flex items-center gap-1 text-[9px] font-medium text-slate-400 dark:text-slate-400 leading-none">
              <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-400" />
              <span className="truncate">{opportunity.comuna}</span>
            </div>

            {/* Short Description */}
            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {opportunity.briefDescription}
            </p>
          </div>

          <div className="space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 shrink-0">
            {/* Footer Dates & Action */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[8px] font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-[#C87A53]" />
                  Cierra: {formatDate(opportunity.applicationDeadline)}
                </span>
              </div>

              <div className="text-[#C87A53] hover:text-[#b0653f] transition-all shrink-0 group-hover:translate-x-0.5 flex items-center gap-0.5 text-[9px] font-bold">
                <span>Ver →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={`opportunity-card-${opportunity.id}`}
      className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col h-full"
    >
      
      {/* Card Header Media */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
        <img
          src={opportunity.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop&q=80"}
          alt={opportunity.title}
          className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        
        {/* Soft overlay for top tags contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-40" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          
          {/* Status Tag - Redesigned to Organic oval badge using Accent Color */}
          {isClosingSoon() ? (
            <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-[#C87A53] text-white uppercase tracking-wider shadow-xs">
              Urgente ⏳
            </span>
          ) : (
            <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-[#E2B13C] text-slate-900 uppercase tracking-wider shadow-xs">
              Abierto
            </span>
          )}

          {/* Modality Badge */}
          <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-[#2C3E35] text-white uppercase tracking-wider">
            {opportunity.modality}
          </span>
        </div>

        {/* Save/Favorite Star Button */}
        <button
          id={`fav-btn-${opportunity.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(opportunity.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-700 dark:text-amber-400 hover:text-[#C87A53] hover:bg-white shadow-xs transition-all z-10 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Agregar a Favoritos"
        >
          <Star className={`w-3.5 h-3.5 ${isFavorited ? "fill-[#E2B13C] text-[#E2B13C]" : "text-slate-500 dark:text-slate-400"}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 space-y-3 text-left">
        
        {/* Organizer and Verification State */}
        <div 
          onClick={(e) => {
            if (onViewProfile) {
              e.stopPropagation();
              onViewProfile(opportunity.institutionId, "institution");
            }
          }}
          className={`flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 ${
            onViewProfile ? "hover:text-[#C87A53] cursor-pointer" : ""
          }`}
        >
          {opportunity.institutionLogo && (
            <img 
              src={opportunity.institutionLogo} 
              alt={opportunity.institutionName} 
              className="w-5 h-5 rounded-full object-cover border border-slate-100" 
              referrerPolicy="no-referrer"
            />
          )}
          <span className="truncate max-w-[140px]">{opportunity.institutionName}</span>
          {opportunity.isInstitutionVerified && (
            <span className="inline-flex items-center text-[#E2B13C]" title="Institución Verificada">
              <CheckCircle2 className="w-3.5 h-3.5 fill-[#E2B13C]/10 text-[#E2B13C]" />
            </span>
          )}
        </div>

        {/* Opportunity Title */}
        <h3 className="font-display font-medium text-sm sm:text-base text-[#1E293B] dark:text-slate-100 line-clamp-2 tracking-tight leading-snug group-hover:text-[#C87A53] transition-colors">
          {opportunity.title}
        </h3>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1">
          {opportunity.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-[9px] font-medium px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full"
            >
              {cat}
            </span>
          ))}
          {opportunity.categories.length > 3 && (
            <span className="text-[9px] font-medium px-2 py-0.5 bg-[#F4F3EF] text-slate-500 rounded-full">
              +{opportunity.categories.length - 3}
            </span>
          )}
        </div>

        {/* Location & Address */}
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-400 leading-none">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{opportunity.comuna}, {opportunity.region.replace("Región de ", "").replace("Región Metropolitana de ", "R.M.")}</span>
        </div>

        {/* Short Description */}
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {opportunity.briefDescription}
        </p>

        {/* Spacer to push button to the bottom */}
        <div className="flex-1" />

        {/* Separator */}
        <div className="border-t border-slate-100 dark:border-slate-800/60 my-1 shrink-0" />

        {/* Footer Dates & Action */}
        <div className="flex items-center justify-between pt-1 gap-2 shrink-0">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 shrink-0 text-[#C87A53]" />
              <span className="truncate text-slate-400">Cierra: </span>
              <span className="truncate text-slate-700 dark:text-slate-300 font-semibold">{formatDate(opportunity.applicationDeadline)}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 pl-4.5">
              <span className="truncate">Costo: </span>
              <span className="truncate font-semibold text-slate-600 dark:text-slate-300">
                {opportunity.cost === CostType.Gratuito ? "Gratuito" : (opportunity.price || "Suscripción")}
              </span>
            </div>
          </div>

          <button
            id={`details-btn-${opportunity.id}`}
            onClick={() => onViewDetails(opportunity)}
            className="text-[#C87A53] hover:text-[#b0653f] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 select-none group-hover:translate-x-1"
          >
            <span>Ver convocatoria</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

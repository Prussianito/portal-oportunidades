import React, { useRef } from "react";
import { Opportunity } from "../types";
import OpportunityCard from "./OpportunityCard";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";

interface CarouselSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  opportunities: Opportunity[];
  savedFavorites: string[];
  onFavoriteToggle: (id: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  onViewProfile?: (id: string, type: "user" | "institution") => void;
  colorTheme?: "blue" | "indigo" | "rose" | "emerald" | "amber" | "purple";
}

export default function CarouselSection({
  title,
  subtitle,
  icon,
  opportunities,
  savedFavorites,
  onFavoriteToggle,
  onViewDetails,
  onViewProfile,
  colorTheme = "blue"
}: CarouselSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -245, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 245, behavior: "smooth" });
    }
  };

  const themeClasses = {
    blue: {
      card: "bg-blue-50/30 dark:bg-blue-950/10 border-blue-100/70 dark:border-blue-900/20",
      accent: "text-blue-600 dark:text-blue-400",
      btn: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300",
      indicator: "bg-blue-500"
    },
    indigo: {
      card: "bg-indigo-50/30 dark:bg-indigo-950/10 border-indigo-100/70 dark:border-indigo-900/20",
      accent: "text-indigo-600 dark:text-indigo-400",
      btn: "bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300",
      indicator: "bg-indigo-500"
    },
    rose: {
      card: "bg-rose-50/30 dark:bg-rose-950/10 border-rose-100/70 dark:border-rose-900/20",
      accent: "text-rose-600 dark:text-rose-400",
      btn: "bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300",
      indicator: "bg-rose-500"
    },
    emerald: {
      card: "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-100/70 dark:border-emerald-900/20",
      accent: "text-emerald-600 dark:text-emerald-400",
      btn: "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
      indicator: "bg-emerald-500"
    },
    amber: {
      card: "bg-amber-50/30 dark:bg-amber-950/10 border-amber-100/70 dark:border-amber-900/20",
      accent: "text-amber-600 dark:text-amber-400",
      btn: "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300",
      indicator: "bg-amber-500"
    },
    purple: {
      card: "bg-purple-50/30 dark:bg-purple-950/10 border-purple-100/70 dark:border-purple-900/20",
      accent: "text-purple-600 dark:text-purple-400",
      btn: "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300",
      indicator: "bg-purple-500"
    }
  };

  const activeTheme = themeClasses[colorTheme];

  return (
    <div className={`rounded-3xl border p-5 transition-all duration-300 hover:shadow-md flex flex-col h-full justify-between ${activeTheme.card}`}>
      <div className="space-y-4">
        {/* Carousel Header */}
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="space-y-0.5">
            <h3 className="font-display font-black text-xs sm:text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-800 dark:text-white">
              <span className={`w-1.5 h-3.5 rounded-full ${activeTheme.indicator}`} />
              <span className="flex items-center gap-1">
                {icon}
                {title}
              </span>
            </h3>
            {subtitle && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                {subtitle}
              </span>
            )}
          </div>

          {/* Scrolling controls */}
          {opportunities.length > 0 && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={scrollLeft}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${activeTheme.btn}`}
                aria-label="Scroll Izquierda"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={scrollRight}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${activeTheme.btn}`}
                aria-label="Scroll Derecha"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel body with opportunities */}
        {opportunities.length === 0 ? (
          <div className="h-[320px] flex flex-col items-center justify-center text-center p-4 bg-white/40 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-850">
            <p className="text-xs text-slate-400 font-medium">No hay convocatorias vigentes en este momento.</p>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {opportunities.map((opp) => (
              <div key={opp.id} className="snap-start shrink-0">
                <OpportunityCard
                  opportunity={opp}
                  isFavorited={savedFavorites.includes(opp.id)}
                  onFavoriteToggle={onFavoriteToggle}
                  onViewDetails={onViewDetails}
                  onViewProfile={onViewProfile}
                  mini={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
